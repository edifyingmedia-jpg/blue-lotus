# Intelligent Builder Engine - Advanced AI for app generation
# This engine provides multi-step reasoning, self-correction, and creative expansion

from typing import Dict, List, Any, Optional, Tuple
from pydantic import BaseModel, Field
from enum import Enum
import json
import uuid
import os
from datetime import datetime

from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")


class AppComplexity(str, Enum):
    SIMPLE = "simple"  # 1-3 screens, basic features
    MODERATE = "moderate"  # 4-8 screens, some complexity
    COMPLEX = "complex"  # 9+ screens, advanced features
    ENTERPRISE = "enterprise"  # Full-scale application


class GenerationPhase(str, Enum):
    UNDERSTANDING = "understanding"
    PLANNING = "planning"
    GENERATING = "generating"
    VALIDATING = "validating"
    ENHANCING = "enhancing"
    COMPLETE = "complete"


class AppBlueprint(BaseModel):
    """High-level app structure plan"""
    app_name: str
    app_type: str
    complexity: AppComplexity
    screens: List[Dict[str, Any]]
    features: List[str]
    data_models: List[Dict[str, Any]]
    user_flows: List[str]
    tech_requirements: List[str]


class GenerationResult(BaseModel):
    """Result of component generation"""
    success: bool
    phase: GenerationPhase
    components: List[Dict[str, Any]]
    blueprint: Optional[Dict[str, Any]] = None
    thinking: List[str] = []
    suggestions: List[str] = []
    warnings: List[str] = []
    errors_fixed: List[str] = []
    message: str


# ============ SYSTEM PROMPTS FOR DIFFERENT PHASES ============

UNDERSTANDING_PROMPT = """You are an expert app architect analyzing user requirements.

Your task is to deeply understand what the user wants to build and extract:
1. App type (e-commerce, social, productivity, entertainment, etc.)
2. Core features needed
3. Target users
4. Key screens/pages
5. Data that needs to be stored
6. Potential challenges

Respond in JSON format:
{
    "app_name": "suggested name",
    "app_type": "category",
    "complexity": "simple|moderate|complex|enterprise",
    "core_features": ["feature1", "feature2"],
    "target_users": "description",
    "screens": [{"name": "Screen Name", "purpose": "what it does", "priority": 1-5}],
    "data_models": [{"name": "Model", "fields": ["field1", "field2"]}],
    "challenges": ["potential issues"],
    "suggestions": ["ideas to make it better"]
}"""

PLANNING_PROMPT = """You are an expert UI/UX architect creating a detailed app blueprint.

Based on the app understanding, create a comprehensive component plan.

For each screen, define:
1. Layout structure (header, body, footer, sidebar)
2. Components needed with hierarchy
3. Data bindings required
4. User interactions
5. Navigation flows

COMPONENT TYPES available:
- header, text, button, input, form, card, list, image, stats, table
- nav, video, container, grid, tabs, modal, progress, slider, toggle
- dropdown, timeline, upload, chart, avatar, badge, alert, divider
- carousel, accordion, breadcrumb, pagination, search, filter, sort

Respond in JSON:
{
    "screens": [
        {
            "name": "Screen Name",
            "layout": "single-column|two-column|dashboard|fullscreen",
            "components": [
                {
                    "type": "component_type",
                    "name": "Component Name",
                    "purpose": "what it does",
                    "children": [],
                    "data_source": "where data comes from",
                    "interactions": ["click", "submit", etc.]
                }
            ]
        }
    ],
    "shared_components": ["Header", "Footer", "Nav"],
    "navigation_flow": {"Screen1": ["Screen2", "Screen3"]},
    "state_management": ["what state needs to be tracked"]
}"""

GENERATION_PROMPT = """You are an expert UI component generator. Generate production-ready JSON components.

RULES:
1. Every component MUST have: id, type, name
2. Use semantic, descriptive names
3. Include realistic placeholder content
4. Create proper component hierarchy with children
5. Add data-testid for testing
6. Include accessibility considerations

COMPONENT SCHEMA:
- header: {id, type, name, content, level: 1-6}
- text: {id, type, name, content, variant: "body"|"caption"|"label"}
- button: {id, type, name, label, variant: "primary"|"secondary"|"danger"|"ghost", icon?, disabled?}
- input: {id, type, name, placeholder, inputType, required?, validation?}
- form: {id, type, name, fields: [{label, type, placeholder, required}], submitLabel, onSubmit?}
- card: {id, type, name, title, content, image?, actions?: []}
- list: {id, type, name, items: [{text, id, icon?}], ordered?}
- image: {id, type, name, src, alt, aspectRatio?}
- stats: {id, type, name, items: [{label, value, change?, icon?}]}
- table: {id, type, name, columns: [], rows: [[]], sortable?, filterable?}
- nav: {id, type, name, items: [{label, href, icon?, active?}], orientation?}
- video: {id, type, name, src, controls, autoplay?, poster?}
- container: {id, type, name, title?, children: [], variant?: "card"|"section"|"modal"}
- grid: {id, type, name, columns: 1-12, gap?, children: []}
- tabs: {id, type, name, tabs: [{label, content, icon?}], defaultTab?}
- modal: {id, type, name, title, content, actions?: [], size?: "sm"|"md"|"lg"}
- progress: {id, type, name, value, max, showLabel?, variant?}
- slider: {id, type, name, min, max, value, step?, label?}
- toggle: {id, type, name, label, checked, onChange?}
- dropdown: {id, type, name, options: [], placeholder, multiple?, searchable?}
- upload: {id, type, name, accept, multiple?, maxSize?, dragDrop?}
- avatar: {id, type, name, src, alt, size?: "sm"|"md"|"lg", fallback?}
- badge: {id, type, name, text, variant?: "default"|"success"|"warning"|"error"}
- alert: {id, type, name, title, message, variant, dismissible?}
- chart: {id, type, name, chartType: "line"|"bar"|"pie"|"area", data: [], options?}
- search: {id, type, name, placeholder, onSearch?, suggestions?: []}
- filter: {id, type, name, filters: [{name, options}], onFilter?}

Generate a COMPLETE JSON array of components. Be comprehensive and creative."""

VALIDATION_PROMPT = """You are a QA engineer validating generated UI components.

Check for:
1. Missing required properties (id, type, name)
2. Invalid component types
3. Inconsistent data structures
4. Missing accessibility attributes
5. Logical errors (e.g., form without submit)
6. Empty or placeholder content that should be filled
7. Missing navigation between screens
8. Orphaned components (not connected to anything)

For each issue found, provide:
- Component ID
- Issue type
- Severity (critical, warning, info)
- Fix suggestion

Respond in JSON:
{
    "valid": true/false,
    "issues": [
        {
            "component_id": "id",
            "issue": "description",
            "severity": "critical|warning|info",
            "fix": "how to fix it"
        }
    ],
    "fixes_applied": ["description of auto-fixes"],
    "components": [/* fixed components array */]
}"""

ENHANCEMENT_PROMPT = """You are a creative product designer enhancing an app.

Review the generated components and suggest:
1. UX improvements
2. Missing features users would expect
3. Visual enhancements
4. Accessibility improvements
5. Performance optimizations
6. Modern UI patterns to apply

Also consider:
- Mobile responsiveness
- Loading states
- Error states
- Empty states
- Edge cases

Respond in JSON:
{
    "suggestions": [
        {
            "type": "ux|feature|visual|accessibility|performance",
            "description": "what to improve",
            "priority": "high|medium|low",
            "implementation": "how to implement"
        }
    ],
    "enhanced_components": [/* components with enhancements applied */],
    "new_components": [/* additional components to add */]
}"""


class IntelligentBuilderEngine:
    """
    Advanced AI engine for intelligent app generation.
    
    Features:
    - Multi-phase generation with thinking steps
    - Self-correction and validation
    - Creative enhancement suggestions
    - Context-aware component generation
    - Error detection and fixing
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or EMERGENT_LLM_KEY
        self.session_id = f"builder-{uuid.uuid4().hex[:8]}"
        self.thinking_log = []
        self.generation_history = []
    
    async def generate_app(
        self, 
        prompt: str, 
        context: Dict[str, Any] = None,
        quick_mode: bool = False
    ) -> GenerationResult:
        """
        Generate a complete app with multi-phase AI reasoning.
        
        Args:
            prompt: User's description of what to build
            context: Additional context (existing components, preferences)
            quick_mode: If True, skip validation/enhancement for speed
        
        Returns:
            GenerationResult with components, thinking, and suggestions
        """
        self.thinking_log = []
        
        try:
            # Phase 1: Understanding
            self._log_thinking("🧠 Analyzing your request...")
            understanding = await self._understand_request(prompt)
            
            if not understanding:
                # Fallback to quick generation
                return await self._quick_generate(prompt)
            
            # Phase 2: Planning
            self._log_thinking(f"📋 Planning {understanding.get('app_type', 'app')} structure...")
            blueprint = await self._create_blueprint(understanding)
            
            # Phase 3: Generation
            self._log_thinking("🎨 Generating components...")
            components = await self._generate_components(blueprint, prompt)
            
            if quick_mode:
                return GenerationResult(
                    success=True,
                    phase=GenerationPhase.COMPLETE,
                    components=components,
                    blueprint=blueprint,
                    thinking=self.thinking_log,
                    suggestions=understanding.get('suggestions', []),
                    message=f"Generated {len(components)} components"
                )
            
            # Phase 4: Validation & Self-Correction
            self._log_thinking("🔍 Validating and fixing issues...")
            validated = await self._validate_and_fix(components)
            
            # Phase 5: Enhancement
            self._log_thinking("✨ Adding enhancements...")
            enhanced = await self._enhance_components(validated['components'])
            
            final_components = enhanced.get('enhanced_components', validated['components'])
            
            return GenerationResult(
                success=True,
                phase=GenerationPhase.COMPLETE,
                components=final_components,
                blueprint=blueprint,
                thinking=self.thinking_log,
                suggestions=enhanced.get('suggestions', []),
                warnings=validated.get('issues', []),
                errors_fixed=validated.get('fixes_applied', []),
                message=f"Generated {len(final_components)} components with AI enhancement"
            )
            
        except Exception as e:
            self._log_thinking(f"⚠️ Encountered issue, using fallback: {str(e)}")
            return await self._quick_generate(prompt)
    
    async def _understand_request(self, prompt: str) -> Optional[Dict]:
        """Phase 1: Deep understanding of user request"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-understand",
                system_message=UNDERSTANDING_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"Analyze this app request:\n\n{prompt}"
            ))
            
            return self._parse_json_response(response)
        except Exception as e:
            print(f"[IntelligentBuilder] Understanding error: {e}")
            return None
    
    async def _create_blueprint(self, understanding: Dict) -> Dict:
        """Phase 2: Create detailed app blueprint"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-plan",
                system_message=PLANNING_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"Create a detailed component plan for this app:\n\n{json.dumps(understanding, indent=2)}"
            ))
            
            blueprint = self._parse_json_response(response)
            if blueprint:
                self._log_thinking(f"📱 Planned {len(blueprint.get('screens', []))} screens")
            return blueprint or {"screens": []}
        except Exception as e:
            print(f"[IntelligentBuilder] Planning error: {e}")
            return {"screens": []}
    
    async def _generate_components(self, blueprint: Dict, original_prompt: str) -> List[Dict]:
        """Phase 3: Generate actual components"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-generate",
                system_message=GENERATION_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            generation_context = f"""
Original Request: {original_prompt}

App Blueprint:
{json.dumps(blueprint, indent=2)}

Generate ALL components needed for this app as a JSON array.
Include realistic content, proper hierarchy, and comprehensive coverage.
"""
            
            response = await chat.send_message(UserMessage(text=generation_context))
            components = self._parse_json_response(response)
            
            if isinstance(components, list):
                self._log_thinking(f"🧩 Created {len(components)} components")
                return self._ensure_component_ids(components)
            return []
        except Exception as e:
            print(f"[IntelligentBuilder] Generation error: {e}")
            return []
    
    async def _validate_and_fix(self, components: List[Dict]) -> Dict:
        """Phase 4: Validate components and auto-fix issues"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-validate",
                system_message=VALIDATION_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"Validate and fix these components:\n\n{json.dumps(components, indent=2)}"
            ))
            
            result = self._parse_json_response(response)
            if result:
                fixes = result.get('fixes_applied', [])
                if fixes:
                    self._log_thinking(f"🔧 Fixed {len(fixes)} issues")
                return result
            return {"valid": True, "components": components, "issues": [], "fixes_applied": []}
        except Exception as e:
            print(f"[IntelligentBuilder] Validation error: {e}")
            return {"valid": True, "components": components, "issues": [], "fixes_applied": []}
    
    async def _enhance_components(self, components: List[Dict]) -> Dict:
        """Phase 5: Add creative enhancements"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-enhance",
                system_message=ENHANCEMENT_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"Enhance these components with modern UX patterns:\n\n{json.dumps(components, indent=2)}"
            ))
            
            result = self._parse_json_response(response)
            if result:
                suggestions = result.get('suggestions', [])
                if suggestions:
                    self._log_thinking(f"💡 Found {len(suggestions)} enhancement opportunities")
                return result
            return {"enhanced_components": components, "suggestions": []}
        except Exception as e:
            print(f"[IntelligentBuilder] Enhancement error: {e}")
            return {"enhanced_components": components, "suggestions": []}
    
    async def _quick_generate(self, prompt: str) -> GenerationResult:
        """Fallback quick generation without full pipeline"""
        components = self._generate_from_patterns(prompt)
        
        return GenerationResult(
            success=True,
            phase=GenerationPhase.COMPLETE,
            components=components,
            thinking=self.thinking_log + ["Using quick generation mode"],
            message=f"Generated {len(components)} components"
        )
    
    def _generate_from_patterns(self, prompt: str) -> List[Dict]:
        """Pattern-based component generation (fallback)"""
        prompt_lower = prompt.lower()
        
        # Import the local generator from builder_ai
        from routes.builder_ai import generate_components_locally
        return generate_components_locally(prompt_lower, prompt)
    
    def _parse_json_response(self, response: str) -> Optional[Any]:
        """Parse JSON from LLM response"""
        if not response:
            return None
            
        cleaned = response.strip()
        
        # Remove markdown code blocks
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        # Try to find JSON in response
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to extract JSON from text
            start = cleaned.find('[')
            if start == -1:
                start = cleaned.find('{')
            if start != -1:
                end = max(cleaned.rfind(']'), cleaned.rfind('}')) + 1
                if end > start:
                    try:
                        return json.loads(cleaned[start:end])
                    except:
                        pass
        return None
    
    def _ensure_component_ids(self, components: List[Dict]) -> List[Dict]:
        """Ensure all components have unique IDs"""
        def add_ids(items: List[Dict], prefix: str = "comp") -> List[Dict]:
            for item in items:
                if not item.get('id'):
                    item['id'] = f"{prefix}-{uuid.uuid4().hex[:8]}"
                if 'children' in item and isinstance(item['children'], list):
                    add_ids(item['children'], item.get('type', 'child'))
            return items
        return add_ids(components)
    
    def _log_thinking(self, message: str):
        """Add to thinking log"""
        self.thinking_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "message": message
        })
    
    async def suggest_improvements(self, components: List[Dict], user_goal: str) -> List[Dict]:
        """Generate improvement suggestions for existing components"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-suggest",
                system_message="""You are a product consultant. Analyze the current app state and suggest improvements.
                
Consider:
- Missing features users would expect
- UX improvements
- Performance optimizations
- Accessibility
- Modern design patterns

Respond with a JSON array of suggestions:
[{"type": "feature|ux|design|accessibility", "title": "...", "description": "...", "priority": "high|medium|low"}]"""
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"User's goal: {user_goal}\n\nCurrent components:\n{json.dumps(components, indent=2)}"
            ))
            
            suggestions = self._parse_json_response(response)
            return suggestions if isinstance(suggestions, list) else []
        except Exception as e:
            print(f"[IntelligentBuilder] Suggestion error: {e}")
            return []
    
    async def fix_component_errors(self, components: List[Dict], error_description: str) -> Tuple[List[Dict], str]:
        """Self-correct component errors based on description"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-fix",
                system_message="""You are an expert debugger. Fix the component issues described.

Return JSON:
{
    "components": [/* fixed components */],
    "explanation": "what was fixed and why"
}"""
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"Error: {error_description}\n\nComponents:\n{json.dumps(components, indent=2)}"
            ))
            
            result = self._parse_json_response(response)
            if result and 'components' in result:
                return result['components'], result.get('explanation', 'Fixed issues')
            return components, "Could not determine fix"
        except Exception as e:
            print(f"[IntelligentBuilder] Fix error: {e}")
            return components, f"Error: {str(e)}"
    
    async def expand_feature(self, existing_components: List[Dict], feature_request: str) -> List[Dict]:
        """Expand app with a new feature while maintaining consistency"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"{self.session_id}-expand",
                system_message="""You are adding a new feature to an existing app.

RULES:
1. Maintain visual consistency with existing components
2. Reuse existing patterns and styles
3. Add only what's needed for the new feature
4. Ensure navigation/connection to existing screens

Return ONLY the NEW components as a JSON array."""
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(
                text=f"""Existing app components:
{json.dumps(existing_components[:10], indent=2)}

Add this feature: {feature_request}

Generate ONLY the new components needed."""
            ))
            
            new_components = self._parse_json_response(response)
            if isinstance(new_components, list):
                return self._ensure_component_ids(new_components)
            return []
        except Exception as e:
            print(f"[IntelligentBuilder] Expand error: {e}")
            return []
