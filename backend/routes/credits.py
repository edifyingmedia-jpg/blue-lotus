# Credits Routes
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime, timezone

from models.schemas import CreditPurchase, CreditBalance, User
from routes.auth import get_current_user
from engines.credit_engine import CreditEngine, CREDIT_PACKS

router = APIRouter(prefix="/credits", tags=["Credits"])


def create_credits_routes(db: AsyncIOMotorDatabase):
    """Create credits routes with database dependency."""
    
    @router.get("/balance", response_model=CreditBalance)
    async def get_balance(authorization: Optional[str] = Header(None)):
        """Get current credit balance."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check and refresh bonus credits
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        
        # Update in database
        await db.users.update_one(
            {"id": user.id},
            {"$set": {
                "credits": {
                    **user.credits.model_dump(),
                    "last_bonus_refresh": user.credits.last_bonus_refresh.isoformat()
                }
            }}
        )
        
        return CreditBalance(
            total=CreditEngine.get_total_credits(user.credits),
            monthly=user.credits.monthly,
            monthly_total=user.credits.monthly_total,
            bonus=user.credits.bonus,
            bonus_total=user.credits.bonus_total,
            purchased=user.credits.purchased,
            starter=user.credits.starter,
            next_bonus_refresh=CreditEngine.get_next_bonus_refresh(user.credits)
        )
    
    @router.get("/packs")
    async def get_credit_packs():
        """Get available credit packs for purchase."""
        return {
            "packs": [
                {"id": pack_id, **pack_data}
                for pack_id, pack_data in CREDIT_PACKS.items()
            ]
        }
    
    @router.post("/purchase")
    async def purchase_credits(
        purchase: CreditPurchase,
        authorization: Optional[str] = Header(None)
    ):
        """Purchase credit pack (mock - integrate with Stripe)."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        if purchase.pack_id not in CREDIT_PACKS:
            raise HTTPException(status_code=400, detail="Invalid credit pack")
        
        pack = CREDIT_PACKS[purchase.pack_id]
        
        # In production, integrate with Stripe here
        # For now, just add the credits (mock purchase)
        
        user.credits = CreditEngine.add_purchased_credits(user.credits, pack["credits"])
        
        # Update in database
        await db.users.update_one(
            {"id": user.id},
            {"$set": {
                "credits": {
                    **user.credits.model_dump(),
                    "last_bonus_refresh": user.credits.last_bonus_refresh.isoformat()
                }
            }}
        )
        
        return {
            "success": True,
            "message": f"Successfully purchased {pack['credits']} credits",
            "credits_added": pack["credits"],
            "total_credits": CreditEngine.get_total_credits(user.credits)
        }
    
    @router.get("/deduction-priority")
    async def get_deduction_priority():
        """Get credit deduction priority order."""
        return {
            "priority": [
                {"order": 1, "type": "bonus", "description": "Bonus credits are used first (refresh daily, no rollover)"},
                {"order": 2, "type": "monthly", "description": "Monthly credits are used second (reset on billing cycle)"},
                {"order": 3, "type": "purchased", "description": "Purchased credits are used third (never expire)"},
                {"order": 4, "type": "starter", "description": "Starter credits are used last (one-time, never expire)"}
            ]
        }
    
    return router
