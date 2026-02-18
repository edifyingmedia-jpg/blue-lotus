# Billing Routes - Stripe payment and subscription management
from fastapi import APIRouter, HTTPException, Header, Request, Body
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

from routes.auth import get_current_user
from engines.billing_engine import (
    BillingEngine, SubscriptionPlan, PaymentStatus, PaymentType,
    PaymentTransaction, PlanConfig, CreditPackage
)
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse, CheckoutStatusResponse
)


class SubscribeRequest(BaseModel):
    plan: str
    origin_url: str


class PurchaseCreditsRequest(BaseModel):
    package_id: str
    origin_url: str


class CheckoutStatusRequest(BaseModel):
    session_id: str


def create_billing_routes(db):
    """Create billing API routes."""
    router = APIRouter(prefix="/billing", tags=["Billing"])
    
    stripe_api_key = os.getenv("STRIPE_API_KEY")
    
    # ============ Plans & Pricing ============
    
    @router.get("/plans")
    async def get_plans():
        """Get all subscription plans."""
        return {
            "plans": [p.model_dump() for p in BillingEngine.get_all_plans()]
        }
    
    @router.get("/plans/compare")
    async def compare_plans():
        """Get plan comparison for pricing page."""
        return {
            "comparison": BillingEngine.get_plan_comparison()
        }
    
    @router.get("/credits/packages")
    async def get_credit_packages():
        """Get available credit packages."""
        return {
            "packages": [p.model_dump() for p in BillingEngine.get_credit_packages()]
        }
    
    # ============ Subscription Checkout ============
    
    @router.post("/subscribe")
    async def create_subscription_checkout(
        request: SubscribeRequest,
        http_request: Request,
        authorization: Optional[str] = Header(None)
    ):
        """Create Stripe checkout session for subscription."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Validate plan
        try:
            plan = SubscriptionPlan(request.plan)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid plan: {request.plan}")
        
        if plan == SubscriptionPlan.FREE:
            raise HTTPException(status_code=400, detail="Cannot subscribe to free plan")
        
        # Get plan config and price
        plan_config = BillingEngine.get_plan_config(plan)
        
        # Build URLs
        success_url = f"{request.origin_url}/dashboard?payment=success&session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{request.origin_url}/pricing?payment=cancelled"
        
        # Create webhook URL
        host_url = str(http_request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        # Initialize Stripe
        stripe = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=float(plan_config.price),
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user.id,
                "user_email": user.email,
                "payment_type": PaymentType.SUBSCRIPTION.value,
                "plan": plan.value
            }
        )
        
        try:
            session: CheckoutSessionResponse = await stripe.create_checkout_session(checkout_request)
            
            # Create transaction record
            transaction = BillingEngine.create_transaction(
                user_id=user.id,
                user_email=user.email,
                session_id=session.session_id,
                payment_type=PaymentType.SUBSCRIPTION,
                amount=plan_config.price,
                plan=plan,
                metadata={"source": "web_checkout"}
            )
            
            await db.payment_transactions.insert_one(transaction.model_dump())
            
            return {
                "checkout_url": session.url,
                "session_id": session.session_id
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create checkout: {str(e)}")
    
    # ============ Credit Purchase Checkout ============
    
    @router.post("/credits/purchase")
    async def create_credits_checkout(
        request: PurchaseCreditsRequest,
        http_request: Request,
        authorization: Optional[str] = Header(None)
    ):
        """Create Stripe checkout session for credit purchase."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get package
        package = BillingEngine.get_credit_package(request.package_id)
        if not package:
            raise HTTPException(status_code=400, detail=f"Invalid package: {request.package_id}")
        
        # Build URLs
        success_url = f"{request.origin_url}/dashboard?payment=success&session_id={{CHECKOUT_SESSION_ID}}&type=credits"
        cancel_url = f"{request.origin_url}/pricing?payment=cancelled"
        
        # Create webhook URL
        host_url = str(http_request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        # Initialize Stripe
        stripe = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=float(package.price),
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user.id,
                "user_email": user.email,
                "payment_type": PaymentType.CREDIT_PURCHASE.value,
                "package_id": package.package_id,
                "credits": str(package.credits)
            }
        )
        
        try:
            session: CheckoutSessionResponse = await stripe.create_checkout_session(checkout_request)
            
            # Create transaction record
            transaction = BillingEngine.create_transaction(
                user_id=user.id,
                user_email=user.email,
                session_id=session.session_id,
                payment_type=PaymentType.CREDIT_PURCHASE,
                amount=package.price,
                credits_amount=package.credits,
                metadata={"package_id": package.package_id}
            )
            
            await db.payment_transactions.insert_one(transaction.model_dump())
            
            return {
                "checkout_url": session.url,
                "session_id": session.session_id
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create checkout: {str(e)}")
    
    # ============ Payment Status ============
    
    @router.get("/status/{session_id}")
    async def check_payment_status(
        session_id: str,
        http_request: Request,
        authorization: Optional[str] = Header(None)
    ):
        """Check payment status and apply if successful."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get transaction
        transaction_doc = await db.payment_transactions.find_one(
            {"session_id": session_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not transaction_doc:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # If already processed, return cached status
        if transaction_doc.get("status") in ["paid", "failed", "refunded"]:
            return {
                "status": transaction_doc["status"],
                "payment_type": transaction_doc["payment_type"],
                "amount": transaction_doc["amount"],
                "already_processed": True
            }
        
        # Check with Stripe
        host_url = str(http_request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        try:
            checkout_status: CheckoutStatusResponse = await stripe.get_checkout_status(session_id)
            
            # Update transaction status
            new_status = PaymentStatus.PENDING.value
            if checkout_status.payment_status == "paid":
                new_status = PaymentStatus.PAID.value
            elif checkout_status.status == "expired":
                new_status = PaymentStatus.EXPIRED.value
            
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "status": new_status,
                    "completed_at": datetime.now(timezone.utc).isoformat() if new_status == "paid" else None
                }}
            )
            
            # If paid, apply the purchase
            if new_status == PaymentStatus.PAID.value:
                transaction = PaymentTransaction(**transaction_doc)
                
                if transaction.payment_type == PaymentType.SUBSCRIPTION:
                    success, msg = await BillingEngine.apply_subscription(
                        db, user.id, transaction.plan, transaction
                    )
                elif transaction.payment_type == PaymentType.CREDIT_PURCHASE:
                    success, msg = await BillingEngine.apply_credit_purchase(
                        db, user.id, transaction.credits_amount, transaction
                    )
                else:
                    success, msg = True, "Payment processed"
            
            return {
                "status": new_status,
                "payment_status": checkout_status.payment_status,
                "payment_type": transaction_doc["payment_type"],
                "amount": transaction_doc["amount"],
                "already_processed": False
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to check status: {str(e)}")
    
    # ============ User Billing Info ============
    
    @router.get("/info")
    async def get_billing_info(
        authorization: Optional[str] = Header(None)
    ):
        """Get user's billing information."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        user_doc = await db.users.find_one({"id": user.id}, {"_id": 0})
        
        # Get transaction history
        transactions = await db.payment_transactions.find(
            {"user_id": user.id},
            {"_id": 0}
        ).sort("created_at", -1).limit(10).to_list(10)
        
        current_plan = user_doc.get("plan", "free")
        plan_config = BillingEngine.get_plan_config(SubscriptionPlan(current_plan))
        
        return {
            "current_plan": {
                "plan": current_plan,
                "name": plan_config.name,
                "price": plan_config.price
            },
            "subscription": user_doc.get("subscription", {}),
            "credits": user_doc.get("credits", {}),
            "recent_transactions": transactions
        }
    
    @router.get("/transactions")
    async def get_transactions(
        limit: int = 20,
        authorization: Optional[str] = Header(None)
    ):
        """Get user's transaction history."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        transactions = await db.payment_transactions.find(
            {"user_id": user.id},
            {"_id": 0}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        
        return {"transactions": transactions}
    
    return router


def create_webhook_routes(db):
    """Create Stripe webhook routes."""
    router = APIRouter(tags=["Webhooks"])
    
    stripe_api_key = os.getenv("STRIPE_API_KEY")
    
    @router.post("/webhook/stripe")
    async def stripe_webhook(
        request: Request
    ):
        """Handle Stripe webhook events."""
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        try:
            event = await stripe.handle_webhook(body, signature)
            
            # Process event
            if event.event_type in ["checkout.session.completed", "payment_intent.succeeded"]:
                # Update transaction status
                await db.payment_transactions.update_one(
                    {"session_id": event.session_id},
                    {"$set": {
                        "status": PaymentStatus.PAID.value,
                        "completed_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                
                # Apply the purchase
                transaction_doc = await db.payment_transactions.find_one(
                    {"session_id": event.session_id},
                    {"_id": 0}
                )
                
                if transaction_doc:
                    transaction = PaymentTransaction(**transaction_doc)
                    
                    if transaction.payment_type == PaymentType.SUBSCRIPTION:
                        await BillingEngine.apply_subscription(
                            db, transaction.user_id, transaction.plan, transaction
                        )
                    elif transaction.payment_type == PaymentType.CREDIT_PURCHASE:
                        await BillingEngine.apply_credit_purchase(
                            db, transaction.user_id, transaction.credits_amount, transaction
                        )
            
            elif event.event_type == "checkout.session.expired":
                await db.payment_transactions.update_one(
                    {"session_id": event.session_id},
                    {"$set": {"status": PaymentStatus.EXPIRED.value}}
                )
            
            return {"status": "ok"}
            
        except Exception as e:
            # Log but don't fail - webhook should return 200
            print(f"Webhook error: {e}")
            return {"status": "error", "message": str(e)}
    
    return router
