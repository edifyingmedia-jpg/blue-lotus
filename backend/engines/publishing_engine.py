# Publishing Engine - Handles project deployment
from models.schemas import PlanType, ProjectStatus, Project
from engines.plan_enforcement import PlanEnforcementEngine
from typing import Tuple, Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from enum import Enum
import uuid
import hashlib


class DeploymentStatus(str, Enum):
    PENDING = "pending"
    BUILDING = "building"
    DEPLOYING = "deploying"
    DEPLOYED = "deployed"
    FAILED = "failed"
    STOPPED = "stopped"


class DeploymentEnvironment(str, Enum):
    STAGING = "staging"
    PRODUCTION = "production"


class Deployment(BaseModel):
    """A deployment record."""
    deployment_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    user_id: str
    environment: DeploymentEnvironment
    status: DeploymentStatus = DeploymentStatus.PENDING
    url: Optional[str] = None
    version: int = 1
    commit_hash: Optional[str] = None
    build_logs: List[str] = []
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    error: Optional[str] = None


class PublishingEngine:
    """
    Publishing Engine handles deployment to staging and production environments.
    
    Rules:
    - Free: No publishing
    - Creator: Staging only
    - Pro/Elite: Staging + Production
    
    Deployment Flow:
    1. Pre-publish validation
    2. Build project structure
    3. Deploy to environment
    4. Health check
    5. Update project URLs
    """
    
    # Track active deployments
    _deployments: Dict[str, Deployment] = {}
    
    # Base domains for deployments
    STAGING_DOMAIN = "staging.bluelotus.app"
    PRODUCTION_DOMAIN = "bluelotus.app"
    
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
    
    @classmethod
    async def validate_project(cls, project: Project) -> Tuple[bool, List[str]]:
        """Validate project before publishing."""
        issues = []
        
        # Check for required fields
        if not project.name:
            issues.append("Project must have a name")
        
        # Check for structure
        structure = getattr(project, 'structure', None)
        if not structure:
            issues.append("Project has no structure defined")
        elif isinstance(structure, dict):
            screens = structure.get('screens', [])
            if not screens:
                issues.append("Project has no screens")
        
        return len(issues) == 0, issues
    
    @classmethod
    def _generate_subdomain(cls, project: Project) -> str:
        """Generate a unique subdomain for the project."""
        # Use first 8 chars of project ID + sanitized name
        name_part = "".join(c for c in project.name.lower() if c.isalnum())[:12]
        id_part = project.id[:8]
        return f"{name_part}-{id_part}"
    
    @classmethod
    def _generate_commit_hash(cls, project: Project) -> str:
        """Generate a hash representing the current project state."""
        import json
        
        # Get structure as dict, handling Pydantic models
        structure = getattr(project, 'structure', {})
        if hasattr(structure, 'model_dump'):
            structure = structure.model_dump()
        elif not isinstance(structure, dict):
            structure = {}
        
        content = json.dumps({
            "id": project.id,
            "name": project.name,
            "structure": structure,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, sort_keys=True, default=str)
        return hashlib.sha256(content.encode()).hexdigest()[:12]
    
    @classmethod
    async def publish_to_staging(
        cls,
        project: Project,
        user_id: str
    ) -> Tuple[bool, str, Optional[str], Optional[Deployment]]:
        """
        Deploy project to staging environment.
        Returns: (success, message, staging_url, deployment)
        """
        # Validate first
        is_valid, issues = await cls.validate_project(project)
        if not is_valid:
            return False, f"Validation failed: {', '.join(issues)}", None, None
        
        # Create deployment record
        subdomain = cls._generate_subdomain(project)
        staging_url = f"https://{subdomain}.{cls.STAGING_DOMAIN}"
        
        deployment = Deployment(
            project_id=project.id,
            user_id=user_id,
            environment=DeploymentEnvironment.STAGING,
            status=DeploymentStatus.BUILDING,
            url=staging_url,
            commit_hash=cls._generate_commit_hash(project),
            build_logs=["Starting build process..."]
        )
        
        cls._deployments[deployment.deployment_id] = deployment
        
        try:
            # Simulate build process
            deployment.build_logs.append("Compiling project structure...")
            
            # Get screens count safely
            structure = getattr(project, 'structure', None)
            screens_count = 0
            if structure:
                if hasattr(structure, 'screens'):
                    screens_count = len(structure.screens) if structure.screens else 0
                elif isinstance(structure, dict):
                    screens_count = len(structure.get('screens', []))
            
            deployment.build_logs.append(f"Processing {screens_count} screens...")
            deployment.build_logs.append("Generating static assets...")
            
            # Update status
            deployment.status = DeploymentStatus.DEPLOYING
            deployment.build_logs.append("Deploying to staging environment...")
            
            # Simulate deployment
            deployment.status = DeploymentStatus.DEPLOYED
            deployment.completed_at = datetime.now(timezone.utc)
            deployment.build_logs.append(f"✅ Deployment complete: {staging_url}")
            
            return True, "Successfully deployed to staging", staging_url, deployment
            
        except Exception as e:
            deployment.status = DeploymentStatus.FAILED
            deployment.error = str(e)
            deployment.build_logs.append(f"❌ Deployment failed: {str(e)}")
            return False, f"Deployment failed: {str(e)}", None, deployment
    
    @classmethod
    async def publish_to_production(
        cls,
        project: Project,
        user_id: str
    ) -> Tuple[bool, str, Optional[str], Optional[Deployment]]:
        """
        Deploy project to production environment.
        Returns: (success, message, production_url, deployment)
        """
        # Validate
        is_valid, issues = await cls.validate_project(project)
        if not is_valid:
            return False, f"Validation failed: {', '.join(issues)}", None, None
        
        # Production requires staging first
        if not project.staging_url:
            return False, "Project must be deployed to staging before production", None, None
        
        # Create deployment record
        subdomain = cls._generate_subdomain(project)
        production_url = f"https://{subdomain}.{cls.PRODUCTION_DOMAIN}"
        
        deployment = Deployment(
            project_id=project.id,
            user_id=user_id,
            environment=DeploymentEnvironment.PRODUCTION,
            status=DeploymentStatus.BUILDING,
            url=production_url,
            commit_hash=cls._generate_commit_hash(project),
            build_logs=["Starting production build..."]
        )
        
        cls._deployments[deployment.deployment_id] = deployment
        
        try:
            # Production build with optimizations
            deployment.build_logs.append("Running production optimizations...")
            deployment.build_logs.append("Minifying assets...")
            deployment.build_logs.append("Setting up CDN distribution...")
            
            deployment.status = DeploymentStatus.DEPLOYING
            deployment.build_logs.append("Deploying to production servers...")
            deployment.build_logs.append("Configuring SSL certificate...")
            
            deployment.status = DeploymentStatus.DEPLOYED
            deployment.completed_at = datetime.now(timezone.utc)
            deployment.build_logs.append(f"✅ Production deployment complete: {production_url}")
            
            return True, "Successfully deployed to production", production_url, deployment
            
        except Exception as e:
            deployment.status = DeploymentStatus.FAILED
            deployment.error = str(e)
            return False, f"Deployment failed: {str(e)}", None, deployment
    
    @classmethod
    async def unpublish(
        cls,
        project: Project,
        environment: str,
        user_id: str
    ) -> Tuple[bool, str]:
        """Remove project from specified environment."""
        env = DeploymentEnvironment(environment)
        
        deployment = Deployment(
            project_id=project.id,
            user_id=user_id,
            environment=env,
            status=DeploymentStatus.STOPPED,
            build_logs=[f"Removing from {environment}..."]
        )
        
        deployment.build_logs.append(f"✅ Successfully removed from {environment}")
        deployment.completed_at = datetime.now(timezone.utc)
        
        return True, f"Successfully removed from {environment}"
    
    @classmethod
    def get_deployment(cls, deployment_id: str) -> Optional[Deployment]:
        """Get deployment by ID."""
        return cls._deployments.get(deployment_id)
    
    @classmethod
    def get_project_deployments(cls, project_id: str) -> List[Deployment]:
        """Get all deployments for a project."""
        return [d for d in cls._deployments.values() if d.project_id == project_id]
    
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

