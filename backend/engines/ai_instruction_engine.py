# AI Instruction Engine - Interprets natural language into structured tasks
from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import re


class InstructionType(str, Enum):
    CREATE_SCREEN = "create_screen"
    CREATE_PAGE = "create_page"
    REFINE_CONTENT = "refine_content"
    ADD_FEATURE = "add_feature"
    MODIFY_NAVIGATION = "modify_navigation"
    UPDATE_DATA_MODEL = "update_data_model"
    EXPLAIN_PROJECT = "explain_project"
    GENERATE_FLOW = "generate_flow"
    DELETE_ITEM = "delete_item"
    DUPLICATE_ITEM = "duplicate_item"
    UNKNOWN = "unknown"


class ParsedInstruction(BaseModel):
    instruction_type: InstructionType
    target: Optional[str] = None  # What to act on (screen name, model name, etc.)
    parameters: Dict[str, Any] = {}
    requires_confirmation: bool = False
    credits_required: int = 0
    original_prompt: str = ""
    confidence: float = 0.0


class InstructionResult(BaseModel):
    success: bool
    instruction: ParsedInstruction
    output: Dict[str, Any] = {}
    message: str = ""
    warnings: List[str] = []


class AIInstructionEngine:
    """
    AI Instruction Engine interprets user natural language and converts
    it into structured generation tasks.
    
    Rules:
    - Never delete user content without confirmation
    - Never overwrite existing structures
    - Always generate structured output
    - Respect credit engine
    - Respect plan enforcement
    """
    
    # Keywords for instruction classification
    CREATE_KEYWORDS = ["create", "add", "make", "build", "generate", "new"]
    MODIFY_KEYWORDS = ["modify", "update", "change", "edit", "refine", "improve"]
    DELETE_KEYWORDS = ["delete", "remove", "drop"]
    EXPLAIN_KEYWORDS = ["explain", "describe", "what is", "how does", "tell me about"]
    DUPLICATE_KEYWORDS = ["duplicate", "copy", "clone"]
    
    SCREEN_KEYWORDS = ["screen", "view", "page", "ui", "interface", "dashboard", "home", "profile", "settings"]
    PAGE_KEYWORDS = ["page", "landing", "about", "contact", "blog", "section"]
    FLOW_KEYWORDS = ["flow", "navigation", "journey", "process", "workflow"]
    MODEL_KEYWORDS = ["model", "data", "schema", "entity", "table", "field", "database"]
    FEATURE_KEYWORDS = ["feature", "functionality", "capability", "button", "form", "input"]
    NAV_KEYWORDS = ["navigation", "menu", "tab", "sidebar", "drawer", "link"]
    
    # Credit costs
    CREDIT_COSTS = {
        InstructionType.CREATE_SCREEN: 3,
        InstructionType.CREATE_PAGE: 5,
        InstructionType.REFINE_CONTENT: 1,
        InstructionType.ADD_FEATURE: 2,
        InstructionType.MODIFY_NAVIGATION: 1,
        InstructionType.UPDATE_DATA_MODEL: 1,
        InstructionType.EXPLAIN_PROJECT: 0,
        InstructionType.GENERATE_FLOW: 8,
        InstructionType.DELETE_ITEM: 0,
        InstructionType.DUPLICATE_ITEM: 1,
        InstructionType.UNKNOWN: 0,
    }
    
    @staticmethod
    def parse_instruction(prompt: str) -> ParsedInstruction:
        """
        Parse a natural language prompt into a structured instruction.
        """
        prompt_lower = prompt.lower().strip()
        
        # Determine action type
        is_create = any(kw in prompt_lower for kw in AIInstructionEngine.CREATE_KEYWORDS)
        is_modify = any(kw in prompt_lower for kw in AIInstructionEngine.MODIFY_KEYWORDS)
        is_delete = any(kw in prompt_lower for kw in AIInstructionEngine.DELETE_KEYWORDS)
        is_explain = any(kw in prompt_lower for kw in AIInstructionEngine.EXPLAIN_KEYWORDS)
        is_duplicate = any(kw in prompt_lower for kw in AIInstructionEngine.DUPLICATE_KEYWORDS)
        
        # Determine target type
        is_screen = any(kw in prompt_lower for kw in AIInstructionEngine.SCREEN_KEYWORDS)
        is_page = any(kw in prompt_lower for kw in AIInstructionEngine.PAGE_KEYWORDS)
        is_flow = any(kw in prompt_lower for kw in AIInstructionEngine.FLOW_KEYWORDS)
        is_model = any(kw in prompt_lower for kw in AIInstructionEngine.MODEL_KEYWORDS)
        is_feature = any(kw in prompt_lower for kw in AIInstructionEngine.FEATURE_KEYWORDS)
        is_nav = any(kw in prompt_lower for kw in AIInstructionEngine.NAV_KEYWORDS)
        
        # Classify instruction
        instruction_type = InstructionType.UNKNOWN
        confidence = 0.5
        requires_confirmation = False
        target = None
        parameters = {}
        
        if is_explain:
            instruction_type = InstructionType.EXPLAIN_PROJECT
            confidence = 0.9
        elif is_delete:
            instruction_type = InstructionType.DELETE_ITEM
            requires_confirmation = True  # Always confirm deletions
            confidence = 0.85
        elif is_duplicate:
            instruction_type = InstructionType.DUPLICATE_ITEM
            confidence = 0.8
        elif is_create:
            if is_screen:
                instruction_type = InstructionType.CREATE_SCREEN
                confidence = 0.85
            elif is_page:
                instruction_type = InstructionType.CREATE_PAGE
                confidence = 0.85
            elif is_flow:
                instruction_type = InstructionType.GENERATE_FLOW
                confidence = 0.85
            elif is_model:
                instruction_type = InstructionType.UPDATE_DATA_MODEL
                confidence = 0.8
            elif is_feature:
                instruction_type = InstructionType.ADD_FEATURE
                confidence = 0.75
        elif is_modify:
            if is_nav:
                instruction_type = InstructionType.MODIFY_NAVIGATION
                confidence = 0.8
            elif is_model:
                instruction_type = InstructionType.UPDATE_DATA_MODEL
                confidence = 0.8
            else:
                instruction_type = InstructionType.REFINE_CONTENT
                confidence = 0.7
        
        # Extract target name (simple extraction - could be enhanced with NLP)
        target = AIInstructionEngine._extract_target(prompt, instruction_type)
        
        # Extract parameters
        parameters = AIInstructionEngine._extract_parameters(prompt, instruction_type)
        
        return ParsedInstruction(
            instruction_type=instruction_type,
            target=target,
            parameters=parameters,
            requires_confirmation=requires_confirmation,
            credits_required=AIInstructionEngine.CREDIT_COSTS.get(instruction_type, 0),
            original_prompt=prompt,
            confidence=confidence
        )
    
    @staticmethod
    def _extract_target(prompt: str, instruction_type: InstructionType) -> Optional[str]:
        """Extract the target name from the prompt."""
        prompt_lower = prompt.lower()
        
        # Common patterns: "create a dashboard screen", "add user model"
        patterns = [
            r'(?:create|add|make|build|generate)\s+(?:a|an|the)?\s*([a-zA-Z0-9\s]+?)(?:\s+screen|\s+page|\s+model|\s+flow|$)',
            r'(?:called|named)\s+["\']?([a-zA-Z0-9\s]+)["\']?',
            r'"([^"]+)"',
            r"'([^']+)'",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, prompt, re.IGNORECASE)
            if match:
                target = match.group(1).strip()
                # Clean up common words
                for word in ['a', 'an', 'the', 'new', 'screen', 'page', 'model', 'flow']:
                    target = re.sub(rf'\b{word}\b', '', target, flags=re.IGNORECASE).strip()
                if target:
                    return target.title()
        
        return None
    
    @staticmethod
    def _extract_parameters(prompt: str, instruction_type: InstructionType) -> Dict[str, Any]:
        """Extract parameters from the prompt based on instruction type."""
        params = {}
        prompt_lower = prompt.lower()
        
        # Extract fields for data models
        if instruction_type == InstructionType.UPDATE_DATA_MODEL:
            field_pattern = r'(?:with|having|include|contains?)\s+(?:fields?:?\s*)?([a-zA-Z0-9,\s]+)'
            match = re.search(field_pattern, prompt, re.IGNORECASE)
            if match:
                fields = [f.strip() for f in match.group(1).split(',') if f.strip()]
                params['fields'] = fields
        
        # Extract components for screens
        if instruction_type == InstructionType.CREATE_SCREEN:
            component_pattern = r'(?:with|having|include|contains?)\s+(?:components?:?\s*)?([a-zA-Z0-9,\s]+)'
            match = re.search(component_pattern, prompt, re.IGNORECASE)
            if match:
                components = [c.strip() for c in match.group(1).split(',') if c.strip()]
                params['components'] = components
        
        # Extract description
        desc_patterns = [
            r'(?:that|which|to)\s+(.+?)(?:\.|$)',
            r'(?:for|about)\s+(.+?)(?:\.|$)',
        ]
        for pattern in desc_patterns:
            match = re.search(pattern, prompt, re.IGNORECASE)
            if match:
                params['description'] = match.group(1).strip()
                break
        
        return params
    
    @staticmethod
    def validate_instruction(
        instruction: ParsedInstruction,
        existing_items: List[str],
        available_credits: int
    ) -> Tuple[bool, List[str]]:
        """
        Validate an instruction before execution.
        Returns: (is_valid, list_of_warnings)
        """
        warnings = []
        
        # Check credits
        if instruction.credits_required > available_credits:
            return False, [f"Insufficient credits. Required: {instruction.credits_required}, Available: {available_credits}"]
        
        # Check for overwrites
        if instruction.target and instruction.target.lower() in [item.lower() for item in existing_items]:
            if instruction.instruction_type in [InstructionType.CREATE_SCREEN, InstructionType.CREATE_PAGE]:
                warnings.append(f"'{instruction.target}' already exists. Will create a new version instead of overwriting.")
        
        # Unknown instruction warning
        if instruction.instruction_type == InstructionType.UNKNOWN:
            warnings.append("Could not determine the exact action. Please clarify your request.")
            return False, warnings
        
        # Low confidence warning
        if instruction.confidence < 0.7:
            warnings.append(f"Low confidence ({instruction.confidence:.0%}) in understanding. Please confirm the action.")
        
        return True, warnings
    
    @staticmethod
    def generate_response(
        instruction: ParsedInstruction,
        execution_result: Dict[str, Any]
    ) -> str:
        """Generate a human-friendly response for the instruction result."""
        if instruction.instruction_type == InstructionType.CREATE_SCREEN:
            return f"Created screen '{instruction.target or 'New Screen'}'. Used {instruction.credits_required} credits."
        
        elif instruction.instruction_type == InstructionType.CREATE_PAGE:
            return f"Created page '{instruction.target or 'New Page'}'. Used {instruction.credits_required} credits."
        
        elif instruction.instruction_type == InstructionType.GENERATE_FLOW:
            return f"Generated flow '{instruction.target or 'New Flow'}'. Used {instruction.credits_required} credits."
        
        elif instruction.instruction_type == InstructionType.REFINE_CONTENT:
            return f"Refined content. Used {instruction.credits_required} credit."
        
        elif instruction.instruction_type == InstructionType.ADD_FEATURE:
            return f"Added feature '{instruction.target or 'New Feature'}'. Used {instruction.credits_required} credits."
        
        elif instruction.instruction_type == InstructionType.MODIFY_NAVIGATION:
            return "Updated navigation structure."
        
        elif instruction.instruction_type == InstructionType.UPDATE_DATA_MODEL:
            return f"Updated data model '{instruction.target or 'Model'}'."
        
        elif instruction.instruction_type == InstructionType.EXPLAIN_PROJECT:
            return execution_result.get('explanation', 'Here is your project overview.')
        
        elif instruction.instruction_type == InstructionType.DELETE_ITEM:
            return f"Deleted '{instruction.target}'."
        
        elif instruction.instruction_type == InstructionType.DUPLICATE_ITEM:
            return f"Duplicated '{instruction.target}'. Used {instruction.credits_required} credit."
        
        else:
            return "Action completed."
    
    @staticmethod
    def get_suggested_prompts(project_type: str, current_state: Dict[str, Any]) -> List[str]:
        """Get suggested prompts based on project state."""
        suggestions = []
        
        screen_count = len(current_state.get('screens', []))
        page_count = len(current_state.get('pages', []))
        model_count = len(current_state.get('data_models', []))
        
        if project_type == "app":
            if screen_count < 3:
                suggestions.append("Create a dashboard screen with stats and recent activity")
                suggestions.append("Add a user profile screen")
            if model_count < 2:
                suggestions.append("Create a User data model with email and name fields")
            suggestions.append("Generate an authentication flow")
            suggestions.append("Add a settings screen with preferences")
        
        elif project_type == "website":
            if page_count < 3:
                suggestions.append("Create a landing page with hero and features sections")
                suggestions.append("Add an about page with team section")
            suggestions.append("Create a contact page with form")
            suggestions.append("Add a blog page with post listing")
        
        else:  # both
            suggestions.append("Create a dashboard screen")
            suggestions.append("Add a landing page for marketing")
            suggestions.append("Generate a user authentication flow")
        
        return suggestions[:5]  # Return top 5 suggestions
