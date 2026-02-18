# Plan Enforcement Engine
from models.schemas import PlanType, PLAN_CONFIG, ProjectStatus
from typing import Dict, Any, Tuple


class PlanEnforcementEngine:
    """
    Plan Enforcement Engine handles all plan-based permission checks
    for export, publishing, project limits, and team access.
    """
    
    @staticmethod
    def get_plan_config(plan: PlanType) -> Dict[str, Any]:
        """Get configuration for a plan."""
        return PLAN_CONFIG.get(plan, PLAN_CONFIG[PlanType.FREE])
    
    @staticmethod
    def can_export(plan: PlanType) -> Tuple[bool, str]:
        """Check if user can export projects."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        if config["export_allowed"]:
            return True, "Export allowed"
        return False, "Export requires Creator plan or higher"
    
    @staticmethod
    def can_publish_staging(plan: PlanType) -> Tuple[bool, str]:
        """Check if user can publish to staging."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        if config["publish_staging"]:
            return True, "Staging publish allowed"
        return False, "Publishing requires Creator plan or higher"
    
    @staticmethod
    def can_publish_production(plan: PlanType) -> Tuple[bool, str]:
        """Check if user can publish to production."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        if config["publish_production"]:
            return True, "Production publish allowed"
        return False, "Production publishing requires Pro plan or higher"
    
    @staticmethod
    def can_create_project(plan: PlanType, current_count: int) -> Tuple[bool, str]:
        """Check if user can create more projects."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        max_projects = config["max_projects"]
        
        if current_count < max_projects:
            return True, f"Can create project ({current_count}/{max_projects})"
        return False, f"Project limit reached ({current_count}/{max_projects}). Upgrade to create more."
    
    @staticmethod
    def can_publish_more(plan: PlanType, published_count: int) -> Tuple[bool, str]:
        """Check if user can publish more projects."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        max_published = config["max_published"]
        
        # -1 means unlimited
        if max_published == -1:
            return True, "Unlimited publishing"
        
        if published_count < max_published:
            return True, f"Can publish project ({published_count}/{max_published})"
        return False, f"Publishing limit reached ({published_count}/{max_published}). Upgrade to publish more."
    
    @staticmethod
    def can_add_team_member(plan: PlanType, current_team_size: int) -> Tuple[bool, str]:
        """Check if user can add team members."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        team_seats = config["team_seats"]
        
        if team_seats <= 0:
            return False, "Team access requires Elite plan"
        
        if current_team_size < team_seats:
            return True, f"Can add team member ({current_team_size}/{team_seats})"
        return False, f"Team limit reached ({current_team_size}/{team_seats})"
    
    @staticmethod
    def get_plan_limits(plan: PlanType) -> Dict[str, Any]:
        """Get all limits for a plan."""
        config = PlanEnforcementEngine.get_plan_config(plan)
        return {
            "max_projects": config["max_projects"],
            "max_published": config["max_published"] if config["max_published"] != -1 else "Unlimited",
            "team_seats": config["team_seats"],
            "export_allowed": config["export_allowed"],
            "publish_staging": config["publish_staging"],
            "publish_production": config["publish_production"],
            "monthly_credits": config["monthly_credits"],
            "daily_bonus": config["daily_bonus"],
        }
