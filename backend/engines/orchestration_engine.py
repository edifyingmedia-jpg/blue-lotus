# System Orchestration Engine - Coordinates all internal engines
from typing import Dict, List, Optional, Any, Callable
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import asyncio


class SystemEvent(str, Enum):
    ON_USER_LOGIN = "onUserLogin"
    ON_PROJECT_CREATE = "onProjectCreate"
    ON_GENERATION_REQUEST = "onGenerationRequest"
    ON_PUBLISH_REQUEST = "onPublishRequest"
    ON_EXPORT_REQUEST = "onExportRequest"
    ON_CREDIT_DEDUCTION = "onCreditDeduction"
    ON_PLAN_UPGRADE = "onPlanUpgrade"
    ON_DAILY_BONUS_REFRESH = "onDailyBonusRefresh"
    ON_PROJECT_UPDATE = "onProjectUpdate"
    ON_ERROR = "onError"


class OrchestrationResult(BaseModel):
    success: bool
    event: str
    data: Dict[str, Any] = {}
    errors: List[str] = []
    warnings: List[str] = []
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EventHandler(BaseModel):
    event: SystemEvent
    handler_name: str
    priority: int = 0
    async_handler: bool = True


class SystemOrchestrationEngine:
    """
    System Orchestration Engine coordinates all internal engines.
    
    Responsibilities:
    - Coordinate all internal engines
    - Route user actions to correct subsystems
    - Manage async operations
    - Handle system-level events
    - Ensure consistency across engines
    - Trigger credit checks before operations
    - Trigger plan enforcement before restricted actions
    - Update dashboard and UI state after operations
    """
    
    def __init__(self):
        self._event_handlers: Dict[SystemEvent, List[Callable]] = {}
        self._event_log: List[Dict[str, Any]] = []
        self._max_log_size = 1000
    
    def register_handler(self, event: SystemEvent, handler: Callable, priority: int = 0):
        """Register an event handler."""
        if event not in self._event_handlers:
            self._event_handlers[event] = []
        
        self._event_handlers[event].append({
            "handler": handler,
            "priority": priority
        })
        
        # Sort by priority (higher priority first)
        self._event_handlers[event].sort(key=lambda x: x["priority"], reverse=True)
    
    def unregister_handler(self, event: SystemEvent, handler: Callable):
        """Unregister an event handler."""
        if event in self._event_handlers:
            self._event_handlers[event] = [
                h for h in self._event_handlers[event] 
                if h["handler"] != handler
            ]
    
    async def emit(self, event: SystemEvent, data: Dict[str, Any] = None) -> OrchestrationResult:
        """Emit an event and run all registered handlers."""
        data = data or {}
        errors = []
        warnings = []
        results = {}
        
        # Log the event
        self._log_event(event, data)
        
        handlers = self._event_handlers.get(event, [])
        
        for handler_info in handlers:
            handler = handler_info["handler"]
            try:
                if asyncio.iscoroutinefunction(handler):
                    result = await handler(data)
                else:
                    result = handler(data)
                
                if result:
                    results[handler.__name__] = result
                    
            except Exception as e:
                errors.append(f"Handler {handler.__name__} failed: {str(e)}")
        
        return OrchestrationResult(
            success=len(errors) == 0,
            event=event.value,
            data=results,
            errors=errors,
            warnings=warnings
        )
    
    def _log_event(self, event: SystemEvent, data: Dict[str, Any]):
        """Log an event for debugging/auditing."""
        self._event_log.append({
            "event": event.value,
            "data": data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Trim log if too large
        if len(self._event_log) > self._max_log_size:
            self._event_log = self._event_log[-self._max_log_size:]
    
    def get_event_log(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent event log entries."""
        return self._event_log[-limit:]
    
    @staticmethod
    async def orchestrate_action(
        action_type: str,
        user_id: str,
        project_id: Optional[str],
        payload: Dict[str, Any],
        engines: Dict[str, Any]
    ) -> OrchestrationResult:
        """
        Main orchestration flow for user actions.
        
        Flow:
        1. Receive user action
        2. Validate permissions
        3. Validate credits
        4. Route to correct engine
        5. Receive engine output
        6. Update project state
        7. Return final response
        """
        from engines.credit_engine import CreditEngine
        from engines.plan_enforcement import PlanEnforcementEngine
        
        errors = []
        warnings = []
        output = {}
        
        # Get user and validate
        user = engines.get("user")
        if not user:
            return OrchestrationResult(
                success=False,
                event="action_failed",
                errors=["User not found"]
            )
        
        # Step 1: Validate permissions based on action type
        if action_type in ["publish", "export"]:
            if action_type == "publish":
                environment = payload.get("environment", "staging")
                if environment == "production":
                    can, msg = PlanEnforcementEngine.can_publish_production(user.plan)
                else:
                    can, msg = PlanEnforcementEngine.can_publish_staging(user.plan)
            else:
                can, msg = PlanEnforcementEngine.can_export(user.plan)
            
            if not can:
                return OrchestrationResult(
                    success=False,
                    event="permission_denied",
                    errors=[msg]
                )
        
        # Step 2: Validate credits
        credits_required = payload.get("credits_required", 0)
        if credits_required > 0:
            user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
            
            if not CreditEngine.can_afford(user.credits, credits_required):
                return OrchestrationResult(
                    success=False,
                    event="insufficient_credits",
                    errors=[f"Insufficient credits. Required: {credits_required}, Available: {CreditEngine.get_total_credits(user.credits)}"]
                )
        
        # Step 3: Route to correct engine
        if action_type == "generate":
            from engines.generation_engine import GenerationEngine
            gen_type = payload.get("type")
            prompt = payload.get("prompt", "")
            project_type = payload.get("project_type", "app")
            
            gen_result = await GenerationEngine.generate(
                type(payload.get("request"))(**payload) if "request" in payload else None,
                project_type
            )
            output["generation"] = gen_result
            
        elif action_type == "publish":
            from engines.publishing_engine import PublishingEngine
            project = payload.get("project")
            environment = payload.get("environment", "staging")
            
            if environment == "production":
                success, msg, url = await PublishingEngine.publish_to_production(project)
            else:
                success, msg, url = await PublishingEngine.publish_to_staging(project)
            
            output["publish"] = {"success": success, "message": msg, "url": url}
            
        elif action_type == "export":
            from engines.export_engine import ExportEngine
            project = payload.get("project")
            export_type = payload.get("export_type", "full_app")
            
            success, msg, url = await ExportEngine.export(project, export_type)
            output["export"] = {"success": success, "message": msg, "url": url}
        
        # Step 4: Deduct credits if operation succeeded
        if credits_required > 0 and len(errors) == 0:
            user.credits, deduct_success = CreditEngine.deduct_credits(user.credits, credits_required)
            if deduct_success:
                output["credits_deducted"] = credits_required
                output["credits_remaining"] = CreditEngine.get_total_credits(user.credits)
        
        return OrchestrationResult(
            success=len(errors) == 0,
            event=f"{action_type}_completed",
            data=output,
            errors=errors,
            warnings=warnings
        )


# Global orchestrator instance
_orchestrator: Optional[SystemOrchestrationEngine] = None


def get_orchestrator() -> SystemOrchestrationEngine:
    """Get or create the global orchestrator instance."""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = SystemOrchestrationEngine()
    return _orchestrator
