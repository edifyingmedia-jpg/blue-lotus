# Publishing Engine - Handles project deployment
from models.schemas import PlanType, ProjectStatus, Project
from engines.plan_enforcement import PlanEnforcementEngine
from typing import Tuple, Optional
import uuid


class PublishingEngine:
    """
    Publishing Engine handles deployment to staging and production environments.
    
    Rules:
    - Free: No publishing
    - Creator: Staging only
    - Pro/Elite: Staging + Production
    """
    
    @staticmethod
    def can_publish(plan: PlanType, environment: str, published_count: int) -> Tuple[bool, str]:
        """Check if user can publish to the specified environment."""
        if environment == "staging":
            can, message = PlanEnforcementEngine.can_publish_staging(plan)
        elif environment == "production":
            can, message = PlanEnforcementEngine.can_publish_production(plan)
        else:
            return False, "Invalid environment. Use 'staging' or 'production'."
        
        if not can:
            return False, message
        
        # Check publishing limits
        can_more, limit_message = PlanEnforcementEngine.can_publish_more(plan, published_count)
        if not can_more:
            return False, limit_message
        
        return True, "Publishing allowed"
    
    @staticmethod
    async def publish_to_staging(project: Project) -> Tuple[bool, str, Optional[str]]:
        """
        Deploy project to staging environment.
        Returns: (success, message, staging_url)
        """
        # Mock deployment - integrate with actual deployment service
        staging_url = f"https://{project.id[:8]}.staging.bluelotus.app"
        
        return True, "Successfully deployed to staging", staging_url
    
    @staticmethod
    async def publish_to_production(project: Project) -> Tuple[bool, str, Optional[str]]:
        """
        Deploy project to production environment.
        Returns: (success, message, production_url)
        """
        # Mock deployment - integrate with actual deployment service
        production_url = f"https://{project.id[:8]}.bluelotus.app"
        
        return True, "Successfully deployed to production", production_url
    
    @staticmethod
    async def unpublish(project: Project, environment: str) -> Tuple[bool, str]:
        """Remove project from specified environment."""
        # Mock unpublish - integrate with actual deployment service
        return True, f"Successfully removed from {environment}"
    
    @staticmethod
    def get_publish_status(project: Project) -> dict:
        """Get publishing status for a project."""
        return {
            "status": project.status.value,
            "staging_url": project.staging_url,
            "production_url": project.production_url,
            "is_staged": project.staging_url is not None,
            "is_published": project.production_url is not None
        }
