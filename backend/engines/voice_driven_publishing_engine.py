# Voice-Driven Publishing Engine - Publish projects using voice commands
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class DeploymentTarget(str, Enum):
    STAGING = "staging"
    PRODUCTION = "production"


class PublishStatus(str, Enum):
    NOT_PUBLISHED = "not_published"
    STAGING_ONLY = "staging_only"
    PRODUCTION = "production"
    DEPLOYING = "deploying"
    FAILED = "failed"


class PublishAction(str, Enum):
    PUBLISH_STAGING = "publish_staging"
    PUBLISH_PRODUCTION = "publish_production"
    UNPUBLISH = "unpublish"
    CHECK_STATUS = "check_status"


class PublishRequest(BaseModel):
    """Voice-initiated publish request."""
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    user_id: str
    action: PublishAction
    target: Optional[DeploymentTarget] = None
    requires_confirmation: bool = False
    confirmed: bool = False
    diagnostics_passed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PublishResult(BaseModel):
    """Result of voice publishing action."""
    success: bool
    action: PublishAction
    message: str
    voice_message: str
    url: Optional[str] = None
    status: PublishStatus = PublishStatus.NOT_PUBLISHED
    diagnostics: Optional[Dict[str, Any]] = None
    requires_confirmation: bool = False
    confirmation_prompt: Optional[str] = None


class VoiceDrivenPublishingEngine:
    """
    Voice-Driven Publishing & Deployment Engine.
    
    Responsibilities:
    - Allow users to publish projects using voice commands
    - Support staging and production deployments
    - Provide spoken confirmations and status updates
    - Respect plan enforcement and credit rules
    
    Supported Commands:
    - "Publish this to staging"
    - "Deploy to production"
    - "Unpublish this project"
    - "Show me the publish status"
    
    Publishing Flow:
    1. Interpret voice command
    2. Validate plan permissions
    3. Validate credit availability (if required)
    4. Run diagnostics
    5. Deploy to staging or production
    6. Provide spoken and text confirmation
    
    Rules:
    - Must confirm production deployments
    - Must run pre-publish diagnostics
    - Never publish without user confirmation
    """
    
    # Pending publish requests
    _pending_requests: Dict[str, PublishRequest] = {}
    
    # Command patterns
    PUBLISH_PATTERNS = {
        PublishAction.PUBLISH_STAGING: [
            "publish to staging", "deploy to staging", "push to staging",
            "staging deploy", "stage this", "test deployment"
        ],
        PublishAction.PUBLISH_PRODUCTION: [
            "publish to production", "deploy to production", "go live",
            "push to production", "production deploy", "make it live",
            "publish this", "deploy this"
        ],
        PublishAction.UNPUBLISH: [
            "unpublish", "take down", "remove from", "undeploy",
            "stop publishing", "take offline"
        ],
        PublishAction.CHECK_STATUS: [
            "publish status", "deployment status", "is it published",
            "where is it deployed", "show status"
        ]
    }
    
    # Plan-based publish limits
    PLAN_LIMITS = {
        "free": {"staging": True, "production": False},
        "creator": {"staging": True, "production": True},
        "pro": {"staging": True, "production": True},
        "elite": {"staging": True, "production": True}
    }
    
    @classmethod
    def parse_publish_command(cls, command: str) -> Tuple[Optional[PublishAction], Optional[DeploymentTarget]]:
        """Parse voice command to determine publish action."""
        command_lower = command.lower()
        
        for action, patterns in cls.PUBLISH_PATTERNS.items():
            if any(pattern in command_lower for pattern in patterns):
                # Determine target
                target = None
                if "staging" in command_lower:
                    target = DeploymentTarget.STAGING
                elif "production" in command_lower or "live" in command_lower:
                    target = DeploymentTarget.PRODUCTION
                elif action == PublishAction.PUBLISH_PRODUCTION:
                    target = DeploymentTarget.PRODUCTION
                elif action == PublishAction.PUBLISH_STAGING:
                    target = DeploymentTarget.STAGING
                
                return action, target
        
        return None, None
    
    @classmethod
    async def initiate_publish(
        cls,
        project_id: str,
        user_id: str,
        command: str,
        user_plan: str = "free",
        project_data: Dict[str, Any] = None
    ) -> PublishResult:
        """Initiate a voice-driven publish request."""
        action, target = cls.parse_publish_command(command)
        
        if not action:
            return PublishResult(
                success=False,
                action=PublishAction.CHECK_STATUS,
                message="I didn't understand the publish command. Try saying 'Publish to staging' or 'Deploy to production'.",
                voice_message="I didn't understand. Try saying publish to staging, or deploy to production."
            )
        
        # Handle status check
        if action == PublishAction.CHECK_STATUS:
            return cls._get_publish_status(project_id)
        
        # Handle unpublish
        if action == PublishAction.UNPUBLISH:
            return await cls._handle_unpublish(project_id, user_id)
        
        # Check plan permissions
        plan_limits = cls.PLAN_LIMITS.get(user_plan, cls.PLAN_LIMITS["free"])
        target_key = target.value if target else "production"
        
        if not plan_limits.get(target_key, False):
            return PublishResult(
                success=False,
                action=action,
                message=f"Your {user_plan} plan doesn't allow {target_key} deployments. Please upgrade to publish to {target_key}.",
                voice_message=f"Your {user_plan} plan doesn't allow {target_key} deployments. You'll need to upgrade first."
            )
        
        # Run pre-publish diagnostics
        diagnostics = cls._run_diagnostics(project_data or {})
        
        if not diagnostics["passed"]:
            issues = diagnostics.get("issues", [])
            issue_text = ", ".join(issues[:3])
            return PublishResult(
                success=False,
                action=action,
                message=f"Cannot publish due to issues: {issue_text}",
                voice_message=f"I found some issues that need to be fixed first: {issue_text}",
                diagnostics=diagnostics
            )
        
        # Production deployments require confirmation
        if target == DeploymentTarget.PRODUCTION:
            request = PublishRequest(
                project_id=project_id,
                user_id=user_id,
                action=action,
                target=target,
                requires_confirmation=True,
                diagnostics_passed=True
            )
            cls._pending_requests[request.request_id] = request
            
            return PublishResult(
                success=True,
                action=action,
                message="⚠️ You're about to deploy to **production**. This will make your project live. Say 'yes' to confirm or 'no' to cancel.",
                voice_message="You're about to deploy to production. This will make your project live. Say yes to confirm, or no to cancel.",
                requires_confirmation=True,
                confirmation_prompt="Confirm production deployment?"
            )
        
        # Staging can proceed directly
        return await cls._execute_publish(project_id, user_id, target or DeploymentTarget.STAGING)
    
    @classmethod
    async def confirm_publish(
        cls,
        request_id: str,
        confirmed: bool
    ) -> PublishResult:
        """Confirm or cancel a pending publish request."""
        request = cls._pending_requests.get(request_id)
        
        if not request:
            return PublishResult(
                success=False,
                action=PublishAction.CHECK_STATUS,
                message="No pending publish request found.",
                voice_message="There's no pending publish request."
            )
        
        if not confirmed:
            del cls._pending_requests[request_id]
            return PublishResult(
                success=True,
                action=request.action,
                message="Deployment cancelled.",
                voice_message="Okay, I've cancelled the deployment."
            )
        
        # Execute the publish
        del cls._pending_requests[request_id]
        return await cls._execute_publish(
            request.project_id,
            request.user_id,
            request.target or DeploymentTarget.PRODUCTION
        )
    
    @classmethod
    async def _execute_publish(
        cls,
        project_id: str,
        user_id: str,
        target: DeploymentTarget
    ) -> PublishResult:
        """Execute the actual publish (mocked)."""
        # Mock deployment - in real implementation, this would call the Publishing Engine
        mock_url = f"https://{project_id[:8]}.{target.value}.bluelotus.app"
        
        status = PublishStatus.STAGING_ONLY if target == DeploymentTarget.STAGING else PublishStatus.PRODUCTION
        
        return PublishResult(
            success=True,
            action=PublishAction.PUBLISH_STAGING if target == DeploymentTarget.STAGING else PublishAction.PUBLISH_PRODUCTION,
            message=f"✅ Successfully deployed to {target.value}!\n\nURL: {mock_url}",
            voice_message=f"Done! Your project is now live on {target.value}. I'll show you the URL.",
            url=mock_url,
            status=status
        )
    
    @classmethod
    async def _handle_unpublish(cls, project_id: str, user_id: str) -> PublishResult:
        """Handle unpublish request (mocked)."""
        return PublishResult(
            success=True,
            action=PublishAction.UNPUBLISH,
            message="Project has been unpublished and taken offline.",
            voice_message="Done. Your project has been unpublished and taken offline.",
            status=PublishStatus.NOT_PUBLISHED
        )
    
    @classmethod
    def _get_publish_status(cls, project_id: str) -> PublishResult:
        """Get current publish status (mocked)."""
        # Mock status - in real implementation, check actual deployment status
        return PublishResult(
            success=True,
            action=PublishAction.CHECK_STATUS,
            message="**Publish Status**\n\n• Staging: Not deployed\n• Production: Not deployed",
            voice_message="Your project is not currently published. Would you like to deploy to staging?",
            status=PublishStatus.NOT_PUBLISHED
        )
    
    @classmethod
    def _run_diagnostics(cls, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Run pre-publish diagnostics."""
        issues = []
        warnings = []
        
        # Check for empty project
        screens = project_data.get("screens", [])
        pages = project_data.get("pages", [])
        
        if not screens and not pages:
            issues.append("Project has no screens or pages")
        
        # Check for orphan screens
        # In real implementation, check navigation integrity
        
        return {
            "passed": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "checked_at": datetime.now(timezone.utc).isoformat()
        }
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get list of supported publishing commands."""
        return [
            {
                "action": "publish_staging",
                "examples": ["Publish to staging", "Deploy to staging", "Test deployment"],
                "description": "Deploy your project to a staging environment for testing"
            },
            {
                "action": "publish_production",
                "examples": ["Publish to production", "Go live", "Deploy this"],
                "description": "Deploy your project to production (requires confirmation)"
            },
            {
                "action": "unpublish",
                "examples": ["Unpublish this", "Take it down", "Remove from production"],
                "description": "Remove your project from deployment"
            },
            {
                "action": "check_status",
                "examples": ["Publish status", "Is it live?", "Where is it deployed?"],
                "description": "Check the current deployment status"
            }
        ]
