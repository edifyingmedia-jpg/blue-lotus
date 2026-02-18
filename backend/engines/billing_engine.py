# Billing Engine - Stripe subscription and payment management
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv

load_dotenv()


class SubscriptionPlan(str, Enum):
    FREE = "free"
    CREATOR = "creator"
    PRO = "pro"
    ELITE = "elite"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    REFUNDED = "refunded"


class PaymentType(str, Enum):
    SUBSCRIPTION = "subscription"
    CREDIT_PURCHASE = "credit_purchase"
    ONE_TIME = "one_time"


class PaymentTransaction(BaseModel):
    """Record of a payment transaction."""
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    session_id: str
    payment_type: PaymentType
    amount: float
    currency: str = "usd"
    status: PaymentStatus = PaymentStatus.PENDING
    plan: Optional[SubscriptionPlan] = None
    credits_amount: Optional[int] = None
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class PlanConfig(BaseModel):
    """Configuration for a subscription plan."""
    plan: SubscriptionPlan
    name: str
    price: float  # Monthly price
    stripe_price_id: Optional[str] = None
    monthly_credits: int
    daily_bonus: int
    max_projects: int
    can_publish_staging: bool
    can_publish_production: bool
    features: List[str] = []


class CreditPackage(BaseModel):
    """A purchasable credit package."""
    package_id: str
    name: str
    credits: int
    price: float  # In USD
    popular: bool = False


class BillingEngine:
    """
    Billing Engine for Blue Lotus.
    
    Responsibilities:
    - Manage subscription plans
    - Handle plan upgrades/downgrades
    - Process credit purchases
    - Track payment transactions
    - Sync with plan enforcement
    """
    
    # Plan configurations
    PLAN_CONFIGS: Dict[SubscriptionPlan, PlanConfig] = {
        SubscriptionPlan.FREE: PlanConfig(
            plan=SubscriptionPlan.FREE,
            name="Free",
            price=0.00,
            monthly_credits=0,
            daily_bonus=0,
            max_projects=1,
            can_publish_staging=False,
            can_publish_production=False,
            features=["1 project", "Basic components", "Community support"]
        ),
        SubscriptionPlan.CREATOR: PlanConfig(
            plan=SubscriptionPlan.CREATOR,
            name="Creator",
            price=9.99,
            monthly_credits=150,
            daily_bonus=10,
            max_projects=5,
            can_publish_staging=True,
            can_publish_production=False,
            features=["5 projects", "150 monthly credits", "10 daily bonus", "Staging deployment", "Email support"]
        ),
        SubscriptionPlan.PRO: PlanConfig(
            plan=SubscriptionPlan.PRO,
            name="Pro",
            price=19.99,
            monthly_credits=500,
            daily_bonus=25,
            max_projects=20,
            can_publish_staging=True,
            can_publish_production=True,
            features=["20 projects", "500 monthly credits", "25 daily bonus", "Production deployment", "Priority support"]
        ),
        SubscriptionPlan.ELITE: PlanConfig(
            plan=SubscriptionPlan.ELITE,
            name="Elite",
            price=29.99,
            monthly_credits=2000,
            daily_bonus=50,
            max_projects=100,
            can_publish_staging=True,
            can_publish_production=True,
            features=["100 projects", "2000 monthly credits", "50 daily bonus", "White-label exports", "Dedicated support"]
        ),
    }
    
    # Credit packages
    CREDIT_PACKAGES: Dict[str, CreditPackage] = {
        "starter": CreditPackage(
            package_id="starter",
            name="Starter Pack",
            credits=50,
            price=4.99
        ),
        "growth": CreditPackage(
            package_id="growth",
            name="Growth Pack",
            credits=150,
            price=12.99,
            popular=True
        ),
        "pro": CreditPackage(
            package_id="pro",
            name="Pro Pack",
            credits=500,
            price=39.99
        ),
        "enterprise": CreditPackage(
            package_id="enterprise",
            name="Enterprise Pack",
            credits=2000,
            price=149.99
        ),
    }
    
    @classmethod
    def get_plan_config(cls, plan: SubscriptionPlan) -> PlanConfig:
        """Get configuration for a plan."""
        return cls.PLAN_CONFIGS.get(plan, cls.PLAN_CONFIGS[SubscriptionPlan.FREE])
    
    @classmethod
    def get_all_plans(cls) -> List[PlanConfig]:
        """Get all available plans."""
        return list(cls.PLAN_CONFIGS.values())
    
    @classmethod
    def get_credit_packages(cls) -> List[CreditPackage]:
        """Get all credit packages."""
        return list(cls.CREDIT_PACKAGES.values())
    
    @classmethod
    def get_credit_package(cls, package_id: str) -> Optional[CreditPackage]:
        """Get a specific credit package."""
        return cls.CREDIT_PACKAGES.get(package_id)
    
    @classmethod
    def calculate_plan_upgrade_cost(
        cls,
        current_plan: SubscriptionPlan,
        new_plan: SubscriptionPlan,
        days_remaining: int = 30
    ) -> float:
        """Calculate prorated cost for plan upgrade."""
        current_config = cls.PLAN_CONFIGS[current_plan]
        new_config = cls.PLAN_CONFIGS[new_plan]
        
        if new_config.price <= current_config.price:
            return 0.0  # Downgrades don't charge
        
        # Calculate prorated difference
        daily_diff = (new_config.price - current_config.price) / 30
        prorated_cost = daily_diff * days_remaining
        
        return round(prorated_cost, 2)
    
    @classmethod
    def can_upgrade_to(cls, current_plan: SubscriptionPlan, target_plan: SubscriptionPlan) -> Tuple[bool, str]:
        """Check if upgrade is allowed."""
        plan_order = [SubscriptionPlan.FREE, SubscriptionPlan.CREATOR, SubscriptionPlan.PRO, SubscriptionPlan.ELITE]
        
        current_idx = plan_order.index(current_plan)
        target_idx = plan_order.index(target_plan)
        
        if target_idx <= current_idx:
            return False, "Cannot upgrade to same or lower plan"
        
        return True, "Upgrade allowed"
    
    @classmethod
    def can_downgrade_to(cls, current_plan: SubscriptionPlan, target_plan: SubscriptionPlan) -> Tuple[bool, str]:
        """Check if downgrade is allowed."""
        plan_order = [SubscriptionPlan.FREE, SubscriptionPlan.CREATOR, SubscriptionPlan.PRO, SubscriptionPlan.ELITE]
        
        current_idx = plan_order.index(current_plan)
        target_idx = plan_order.index(target_plan)
        
        if target_idx >= current_idx:
            return False, "Cannot downgrade to same or higher plan"
        
        return True, "Downgrade allowed (effective next billing cycle)"
    
    @classmethod
    async def apply_subscription(
        cls,
        db,
        user_id: str,
        plan: SubscriptionPlan,
        transaction: PaymentTransaction
    ) -> Tuple[bool, str]:
        """Apply subscription to user account."""
        plan_config = cls.PLAN_CONFIGS[plan]
        
        # Update user's plan and credits
        update_data = {
            "plan": plan.value,
            "credits.monthly": plan_config.monthly_credits,
            "credits.monthly_total": plan_config.monthly_credits,
            "credits.bonus": plan_config.daily_bonus,
            "credits.bonus_total": plan_config.daily_bonus,
            "subscription.plan": plan.value,
            "subscription.status": "active",
            "subscription.started_at": datetime.now(timezone.utc).isoformat(),
            "subscription.transaction_id": transaction.transaction_id,
        }
        
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return True, f"Successfully upgraded to {plan_config.name} plan"
        return False, "Failed to apply subscription"
    
    @classmethod
    async def apply_credit_purchase(
        cls,
        db,
        user_id: str,
        credits: int,
        transaction: PaymentTransaction
    ) -> Tuple[bool, str]:
        """Apply purchased credits to user account."""
        result = await db.users.update_one(
            {"id": user_id},
            {"$inc": {"credits.purchased": credits}}
        )
        
        if result.modified_count > 0:
            return True, f"Successfully added {credits} credits"
        return False, "Failed to add credits"
    
    @classmethod
    def create_transaction(
        cls,
        user_id: str,
        user_email: str,
        session_id: str,
        payment_type: PaymentType,
        amount: float,
        plan: Optional[SubscriptionPlan] = None,
        credits_amount: Optional[int] = None,
        metadata: Dict[str, Any] = None
    ) -> PaymentTransaction:
        """Create a new payment transaction record."""
        return PaymentTransaction(
            user_id=user_id,
            user_email=user_email,
            session_id=session_id,
            payment_type=payment_type,
            amount=amount,
            plan=plan,
            credits_amount=credits_amount,
            metadata=metadata or {}
        )
    
    @classmethod
    def get_plan_comparison(cls) -> List[Dict[str, Any]]:
        """Get plan comparison data for pricing page."""
        features = [
            "Projects",
            "Monthly Credits",
            "Daily Bonus",
            "AI Generation",
            "Voice Commands",
            "Staging Deploy",
            "Production Deploy",
            "Export Code",
            "Support Level"
        ]
        
        comparison = []
        for plan_type in [SubscriptionPlan.FREE, SubscriptionPlan.CREATOR, SubscriptionPlan.PRO, SubscriptionPlan.ELITE]:
            config = cls.PLAN_CONFIGS[plan_type]
            comparison.append({
                "plan": plan_type.value,
                "name": config.name,
                "price": config.price,
                "features": {
                    "Projects": config.max_projects,
                    "Monthly Credits": config.monthly_credits,
                    "Daily Bonus": config.daily_bonus,
                    "AI Generation": "✓",
                    "Voice Commands": "✓",
                    "Staging Deploy": "✓" if config.can_publish_staging else "✗",
                    "Production Deploy": "✓" if config.can_publish_production else "✗",
                    "Export Code": "✓" if plan_type in [SubscriptionPlan.PRO, SubscriptionPlan.ELITE] else "✗",
                    "Support Level": "Community" if plan_type == SubscriptionPlan.FREE else "Priority" if plan_type == SubscriptionPlan.ELITE else "Email"
                }
            })
        
        return comparison
