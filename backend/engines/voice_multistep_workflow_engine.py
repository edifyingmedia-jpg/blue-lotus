# Voice Multi-Step Workflow Engine - Handle complex multi-step voice instructions
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class WorkflowStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    AWAITING_INPUT = "awaiting_input"
    CONFIRMING = "confirming"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"


class WorkflowStep(BaseModel):
    """Individual step in a multi-step workflow."""
    step_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    step_number: int
    name: str
    description: str
    voice_prompt: str
    requires_input: bool = True
    input_type: str = "text"  # text, choice, confirmation
    choices: List[str] = []
    user_response: Optional[str] = None
    completed: bool = False
    output: Optional[Dict[str, Any]] = None


class Workflow(BaseModel):
    """Multi-step workflow instance."""
    workflow_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_id: Optional[str] = None
    workflow_type: str
    name: str
    steps: List[WorkflowStep] = []
    current_step: int = 0
    status: WorkflowStatus = WorkflowStatus.NOT_STARTED
    context: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class WorkflowResult(BaseModel):
    """Result of workflow execution."""
    success: bool
    workflow: Workflow
    current_prompt: Optional[str] = None
    voice_prompt: Optional[str] = None
    needs_input: bool = False
    choices: List[str] = []
    message: str = ""


class VoiceMultiStepWorkflowEngine:
    """
    Voice-Based Multi-Step Workflow Engine.
    
    Responsibilities:
    - Handle multi-step voice instructions
    - Maintain workflow context across multiple commands
    - Guide users through complex creation tasks
    - Support branching workflows based on user responses
    
    Workflow Examples:
    - Create a checkout flow with three steps
    - Build a profile setup wizard
    - Generate a multi-screen onboarding sequence
    - Add a data model and bind it to a screen
    
    Session Memory:
    - current_workflow, pending_steps, user_choices, intermediate_outputs
    
    Rules:
    - Must confirm before finalizing
    - Must handle ambiguous steps
    - Must offer corrections
    """
    
    # Active workflows
    _workflows: Dict[str, Workflow] = {}
    
    # Workflow templates
    WORKFLOW_TEMPLATES = {
        "checkout_flow": {
            "name": "Checkout Flow",
            "steps": [
                {"name": "Cart Review", "description": "Review items in cart", "voice_prompt": "First, I'll create a cart review screen. What should users see here?"},
                {"name": "Shipping Info", "description": "Collect shipping details", "voice_prompt": "Next, the shipping information step. What fields do you need?"},
                {"name": "Payment", "description": "Payment method selection", "voice_prompt": "Now the payment step. Should this include card and PayPal options?"},
                {"name": "Confirmation", "description": "Order confirmation", "voice_prompt": "Finally, the confirmation screen. What should users see after purchase?"}
            ]
        },
        "onboarding_flow": {
            "name": "Onboarding Flow",
            "steps": [
                {"name": "Welcome", "description": "Welcome screen", "voice_prompt": "Let's start with a welcome screen. What message should users see?"},
                {"name": "Account Setup", "description": "Basic account info", "voice_prompt": "Next, account setup. What information do you need to collect?"},
                {"name": "Preferences", "description": "User preferences", "voice_prompt": "Now for preferences. What options should users be able to set?"},
                {"name": "Complete", "description": "Completion screen", "voice_prompt": "Finally, the completion screen. What's the next action for users?"}
            ]
        },
        "signup_flow": {
            "name": "Signup Flow",
            "steps": [
                {"name": "Email", "description": "Email collection", "voice_prompt": "First, the email step. Should this include email validation?"},
                {"name": "Password", "description": "Password creation", "voice_prompt": "Next, password creation. Any specific requirements?"},
                {"name": "Profile", "description": "Profile setup", "voice_prompt": "Now profile setup. What profile fields do you need?"},
                {"name": "Verification", "description": "Email verification", "voice_prompt": "Finally, verification. Should users verify their email?"}
            ]
        },
        "data_model_binding": {
            "name": "Data Model & Screen Binding",
            "steps": [
                {"name": "Create Model", "description": "Create data model", "voice_prompt": "What should we call this data model?"},
                {"name": "Add Fields", "description": "Define model fields", "voice_prompt": "What fields should this model have?"},
                {"name": "Create Screen", "description": "Create display screen", "voice_prompt": "Now let's create a screen for this data. What type of screen?"},
                {"name": "Bind Data", "description": "Connect model to screen", "voice_prompt": "I'll bind the data to the screen. Any specific display preferences?"}
            ]
        },
        "crud_screens": {
            "name": "CRUD Screens",
            "steps": [
                {"name": "List View", "description": "List/table view", "voice_prompt": "First, the list view. What columns should be displayed?"},
                {"name": "Detail View", "description": "Detail/view screen", "voice_prompt": "Next, the detail view. What information should be shown?"},
                {"name": "Create Form", "description": "Create/add form", "voice_prompt": "Now the create form. What fields are required?"},
                {"name": "Edit Form", "description": "Edit/update form", "voice_prompt": "Finally, the edit form. Should it be different from create?"}
            ]
        }
    }
    
    @classmethod
    def detect_workflow_intent(cls, text: str) -> Optional[str]:
        """Detect if user wants to start a multi-step workflow."""
        text_lower = text.lower()
        
        patterns = {
            "checkout_flow": ["checkout flow", "checkout process", "payment flow", "shopping cart"],
            "onboarding_flow": ["onboarding", "welcome flow", "getting started flow", "tutorial flow"],
            "signup_flow": ["signup flow", "registration flow", "sign up process", "user registration"],
            "data_model_binding": ["model and screen", "data model with screen", "bind model", "connect model"],
            "crud_screens": ["crud", "list and detail", "create read update delete", "admin screens"]
        }
        
        for workflow_type, keywords in patterns.items():
            if any(kw in text_lower for kw in keywords):
                return workflow_type
        
        # Generic flow detection
        if "flow" in text_lower or "wizard" in text_lower or "multi-step" in text_lower:
            return "onboarding_flow"  # Default
        
        return None
    
    @classmethod
    def start_workflow(
        cls,
        user_id: str,
        workflow_type: str,
        project_id: Optional[str] = None,
        custom_name: Optional[str] = None
    ) -> WorkflowResult:
        """Start a new multi-step workflow."""
        template = cls.WORKFLOW_TEMPLATES.get(workflow_type)
        if not template:
            return WorkflowResult(
                success=False,
                workflow=None,
                message=f"Unknown workflow type: {workflow_type}"
            )
        
        # Create workflow steps from template
        steps = [
            WorkflowStep(
                step_number=i + 1,
                name=step["name"],
                description=step["description"],
                voice_prompt=step["voice_prompt"]
            )
            for i, step in enumerate(template["steps"])
        ]
        
        workflow = Workflow(
            user_id=user_id,
            project_id=project_id,
            workflow_type=workflow_type,
            name=custom_name or template["name"],
            steps=steps,
            status=WorkflowStatus.IN_PROGRESS
        )
        
        cls._workflows[workflow.workflow_id] = workflow
        
        # Get first step prompt
        first_step = steps[0]
        
        return WorkflowResult(
            success=True,
            workflow=workflow,
            current_prompt=f"**{workflow.name}**\n\nStep 1 of {len(steps)}: {first_step.name}\n\n{first_step.description}",
            voice_prompt=f"Starting {workflow.name}. Step 1 of {len(steps)}. {first_step.voice_prompt}",
            needs_input=True,
            message=f"Started workflow: {workflow.name}"
        )
    
    @classmethod
    def process_step_response(
        cls,
        workflow_id: str,
        response: str
    ) -> WorkflowResult:
        """Process user's response to current workflow step."""
        workflow = cls._workflows.get(workflow_id)
        if not workflow:
            return WorkflowResult(
                success=False,
                workflow=None,
                message="Workflow not found"
            )
        
        if workflow.status not in [WorkflowStatus.IN_PROGRESS, WorkflowStatus.AWAITING_INPUT]:
            return WorkflowResult(
                success=False,
                workflow=workflow,
                message=f"Workflow is {workflow.status.value}"
            )
        
        # Check for cancel
        if response.lower() in ["cancel", "stop", "quit", "exit"]:
            workflow.status = WorkflowStatus.CANCELLED
            return WorkflowResult(
                success=True,
                workflow=workflow,
                message="Workflow cancelled"
            )
        
        # Check for back/undo
        if response.lower() in ["back", "previous", "undo", "go back"]:
            if workflow.current_step > 0:
                workflow.current_step -= 1
                current = workflow.steps[workflow.current_step]
                current.completed = False
                return WorkflowResult(
                    success=True,
                    workflow=workflow,
                    current_prompt=f"Step {current.step_number}: {current.name}\n\n{current.description}",
                    voice_prompt=f"Going back to step {current.step_number}. {current.voice_prompt}",
                    needs_input=True
                )
        
        # Store response for current step
        current_step = workflow.steps[workflow.current_step]
        current_step.user_response = response
        current_step.completed = True
        current_step.output = {"response": response}
        
        # Store in workflow context
        workflow.context[current_step.name.lower().replace(" ", "_")] = response
        
        # Move to next step
        workflow.current_step += 1
        
        if workflow.current_step >= len(workflow.steps):
            # Workflow complete - ask for confirmation
            workflow.status = WorkflowStatus.CONFIRMING
            
            summary = cls._generate_workflow_summary(workflow)
            
            return WorkflowResult(
                success=True,
                workflow=workflow,
                current_prompt=f"**{workflow.name} - Review**\n\n{summary}\n\nShould I create this now? Say 'yes' to confirm or 'no' to cancel.",
                voice_prompt=f"Here's what I'll create: {summary}. Should I create this now? Say yes to confirm or no to cancel.",
                needs_input=True,
                choices=["Yes, create it", "No, cancel"]
            )
        
        # Get next step
        next_step = workflow.steps[workflow.current_step]
        workflow.status = WorkflowStatus.AWAITING_INPUT
        
        return WorkflowResult(
            success=True,
            workflow=workflow,
            current_prompt=f"Step {next_step.step_number} of {len(workflow.steps)}: {next_step.name}\n\n{next_step.description}",
            voice_prompt=f"Step {next_step.step_number}. {next_step.voice_prompt}",
            needs_input=True
        )
    
    @classmethod
    def confirm_workflow(cls, workflow_id: str, confirmed: bool) -> WorkflowResult:
        """Confirm or cancel workflow completion."""
        workflow = cls._workflows.get(workflow_id)
        if not workflow:
            return WorkflowResult(success=False, workflow=None, message="Workflow not found")
        
        if confirmed:
            workflow.status = WorkflowStatus.COMPLETED
            workflow.completed_at = datetime.now(timezone.utc)
            
            return WorkflowResult(
                success=True,
                workflow=workflow,
                current_prompt=f"✅ {workflow.name} created successfully!",
                voice_prompt=f"Done! Your {workflow.name} has been created.",
                message="Workflow completed"
            )
        else:
            workflow.status = WorkflowStatus.CANCELLED
            return WorkflowResult(
                success=True,
                workflow=workflow,
                message="Workflow cancelled"
            )
    
    @classmethod
    def _generate_workflow_summary(cls, workflow: Workflow) -> str:
        """Generate a summary of workflow choices."""
        lines = []
        for step in workflow.steps:
            if step.user_response:
                lines.append(f"• **{step.name}**: {step.user_response[:50]}{'...' if len(step.user_response) > 50 else ''}")
        return "\n".join(lines)
    
    @classmethod
    def get_workflow(cls, workflow_id: str) -> Optional[Workflow]:
        """Get a workflow by ID."""
        return cls._workflows.get(workflow_id)
    
    @classmethod
    def get_active_workflow(cls, user_id: str) -> Optional[Workflow]:
        """Get user's active (in-progress) workflow."""
        for workflow in cls._workflows.values():
            if workflow.user_id == user_id and workflow.status in [WorkflowStatus.IN_PROGRESS, WorkflowStatus.AWAITING_INPUT, WorkflowStatus.CONFIRMING]:
                return workflow
        return None
    
    @classmethod
    def cancel_workflow(cls, workflow_id: str) -> bool:
        """Cancel a workflow."""
        workflow = cls._workflows.get(workflow_id)
        if workflow:
            workflow.status = WorkflowStatus.CANCELLED
            return True
        return False
    
    @classmethod
    def get_available_workflows(cls) -> List[Dict[str, Any]]:
        """Get list of available workflow templates."""
        return [
            {
                "type": key,
                "name": template["name"],
                "steps": len(template["steps"]),
                "description": f"Create a {template['name'].lower()} in {len(template['steps'])} steps"
            }
            for key, template in cls.WORKFLOW_TEMPLATES.items()
        ]
