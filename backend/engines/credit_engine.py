# Credit Engine - Full Operational Version
from datetime import datetime, timezone, timedelta
from typing import Tuple, Optional
from models.schemas import Credits, PlanType, PLAN_CONFIG, GenerationType, GENERATION_COSTS


class CreditEngine:
    """
    Credit Engine handles all credit-related operations following the priority:
    1. Bonus Credits (refresh daily, no rollover)
    2. Monthly Credits (reset on billing cycle, no rollover)
    3. Purchased Credits (never expire)
    4. Starter Credits (one-time, never expire)
    """
    
    BONUS_REFRESH_HOURS = 24
    
    @staticmethod
    def get_total_credits(credits: Credits) -> int:
        """Calculate total available credits."""
        return credits.bonus + credits.monthly + credits.purchased + credits.starter
    
    @staticmethod
    def check_bonus_refresh(credits: Credits, plan: PlanType) -> Credits:
        """Check and apply daily bonus refresh if eligible."""
        plan_config = PLAN_CONFIG.get(plan, PLAN_CONFIG[PlanType.FREE])
        daily_bonus = plan_config["daily_bonus"]
        
        if daily_bonus <= 0:
            return credits
        
        now = datetime.now(timezone.utc)
        hours_since_refresh = (now - credits.last_bonus_refresh).total_seconds() / 3600
        
        if hours_since_refresh >= CreditEngine.BONUS_REFRESH_HOURS:
            # Reset bonus credits (no rollover - unused bonus is lost)
            credits.bonus = daily_bonus
            credits.bonus_total = daily_bonus
            credits.last_bonus_refresh = now
        
        return credits
    
    @staticmethod
    def get_next_bonus_refresh(credits: Credits) -> datetime:
        """Get the next bonus refresh time."""
        return credits.last_bonus_refresh + timedelta(hours=CreditEngine.BONUS_REFRESH_HOURS)
    
    @staticmethod
    def can_afford(credits: Credits, cost: int) -> bool:
        """Check if user can afford the operation."""
        return CreditEngine.get_total_credits(credits) >= cost
    
    @staticmethod
    def deduct_credits(credits: Credits, amount: int) -> Tuple[Credits, bool]:
        """
        Deduct credits following priority order:
        1. Bonus Credits
        2. Monthly Credits
        3. Purchased Credits
        4. Starter Credits
        
        Returns: (updated_credits, success)
        """
        if not CreditEngine.can_afford(credits, amount):
            return credits, False
        
        remaining = amount
        
        # 1. Deduct from Bonus Credits first
        if remaining > 0 and credits.bonus > 0:
            deduct = min(credits.bonus, remaining)
            credits.bonus -= deduct
            remaining -= deduct
        
        # 2. Deduct from Monthly Credits
        if remaining > 0 and credits.monthly > 0:
            deduct = min(credits.monthly, remaining)
            credits.monthly -= deduct
            remaining -= deduct
        
        # 3. Deduct from Purchased Credits
        if remaining > 0 and credits.purchased > 0:
            deduct = min(credits.purchased, remaining)
            credits.purchased -= deduct
            remaining -= deduct
        
        # 4. Deduct from Starter Credits
        if remaining > 0 and credits.starter > 0:
            deduct = min(credits.starter, remaining)
            credits.starter -= deduct
            remaining -= deduct
        
        return credits, True
    
    @staticmethod
    def add_purchased_credits(credits: Credits, amount: int) -> Credits:
        """Add purchased credits (never expire)."""
        credits.purchased += amount
        return credits
    
    @staticmethod
    def reset_monthly_credits(credits: Credits, plan: PlanType) -> Credits:
        """Reset monthly credits on billing cycle (no rollover)."""
        plan_config = PLAN_CONFIG.get(plan, PLAN_CONFIG[PlanType.FREE])
        credits.monthly = plan_config["monthly_credits"]
        credits.monthly_total = plan_config["monthly_credits"]
        return credits
    
    @staticmethod
    def initialize_credits(plan: PlanType) -> Credits:
        """Initialize credits for a new user or plan upgrade."""
        plan_config = PLAN_CONFIG.get(plan, PLAN_CONFIG[PlanType.FREE])
        
        return Credits(
            monthly=plan_config["monthly_credits"],
            monthly_total=plan_config["monthly_credits"],
            bonus=plan_config["daily_bonus"],
            bonus_total=plan_config["daily_bonus"],
            purchased=0,
            starter=plan_config["starter_credits"],
            last_bonus_refresh=datetime.now(timezone.utc)
        )
    
    @staticmethod
    def get_generation_cost(gen_type: GenerationType) -> int:
        """Get the credit cost for a generation type."""
        return GENERATION_COSTS.get(gen_type, 1)


# Credit pack definitions
CREDIT_PACKS = {
    "pack100": {"credits": 100, "price": 4.99},
    "pack250": {"credits": 250, "price": 9.99},
    "pack600": {"credits": 600, "price": 19.99},
    "pack1500": {"credits": 1500, "price": 39.99},
}
