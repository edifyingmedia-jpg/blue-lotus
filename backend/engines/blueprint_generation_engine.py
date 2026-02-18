# Blueprint Generation Engine - Generates structured app/page blueprints from specifications
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class BlueprintType(str, Enum):
    SCREEN = "screen"
    PAGE = "page"
    FLOW = "flow"
    DATA_MODEL = "data_model"
    NAVIGATION = "navigation"
    FULL_APP = "full_app"
    COMPONENT = "component"


class BlueprintStatus(str, Enum):
    DRAFT = "draft"
    VALIDATED = "validated"
    APPLIED = "applied"
    FAILED = "failed"


class BlueprintElement(BaseModel):
    """Individual element within a blueprint."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    name: str
    properties: Dict[str, Any] = {}
    children: List["BlueprintElement"] = []
    position: Optional[Dict[str, int]] = None
    style: Dict[str, Any] = {}


class Blueprint(BaseModel):
    """Complete blueprint structure."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: BlueprintType
    name: str
    description: Optional[str] = None
    version: str = "1.0.0"
    elements: List[BlueprintElement] = []
    metadata: Dict[str, Any] = {}
    status: BlueprintStatus = BlueprintStatus.DRAFT
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BlueprintGenerationResult(BaseModel):
    success: bool
    blueprint: Optional[Blueprint] = None
    message: str
    warnings: List[str] = []
    credits_used: int = 0
    generation_time_ms: int = 0


class BlueprintValidationResult(BaseModel):
    valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    suggestions: List[str] = []


class BlueprintGenerationEngine:
    """
    Blueprint Generation Engine generates structured app/page blueprints.
    
    Responsibilities:
    - Generate structured blueprints from natural language specifications
    - Create screen, page, flow, and data model blueprints
    - Validate blueprint structure and compatibility
    - Transform blueprints into executable components
    - Manage blueprint versioning and history
    - Optimize blueprints for performance
    
    Rules:
    - Always generate valid, well-structured blueprints
    - Never overwrite existing blueprints without confirmation
    - Respect component library constraints
    - Ensure accessibility standards
    - Maintain consistency across project
    """
    
    # Credit costs by blueprint type
    CREDIT_COSTS = {
        BlueprintType.SCREEN: 3,
        BlueprintType.PAGE: 5,
        BlueprintType.FLOW: 8,
        BlueprintType.DATA_MODEL: 2,
        BlueprintType.NAVIGATION: 1,
        BlueprintType.FULL_APP: 20,
        BlueprintType.COMPONENT: 1,
    }
    
    # Template structures for different blueprint types
    SCREEN_TEMPLATES = {
        "dashboard": {
            "layout": "grid",
            "sections": ["header", "stats", "charts", "activity", "actions"],
            "components": ["StatsCard", "BarChart", "LineChart", "ActivityFeed", "QuickActions"]
        },
        "profile": {
            "layout": "sidebar",
            "sections": ["avatar", "info", "activity", "settings"],
            "components": ["Avatar", "ProfileInfo", "ActivityList", "SettingsLink"]
        },
        "settings": {
            "layout": "list",
            "sections": ["account", "notifications", "privacy", "appearance"],
            "components": ["SettingsGroup", "Toggle", "Select", "Input", "Button"]
        },
        "list": {
            "layout": "vertical",
            "sections": ["search", "filters", "items", "pagination"],
            "components": ["SearchBar", "FilterBar", "ListView", "Pagination"]
        },
        "detail": {
            "layout": "split",
            "sections": ["header", "content", "sidebar", "actions"],
            "components": ["DetailHeader", "ContentBlock", "RelatedItems", "ActionButtons"]
        },
        "form": {
            "layout": "vertical",
            "sections": ["header", "fields", "actions"],
            "components": ["FormHeader", "InputGroup", "Select", "Submit", "Cancel"]
        },
        "auth": {
            "layout": "centered",
            "sections": ["logo", "form", "social", "links"],
            "components": ["Logo", "EmailInput", "PasswordInput", "SubmitButton", "SocialAuth"]
        }
    }
    
    PAGE_TEMPLATES = {
        "home": {
            "layout": "full-width",
            "sections": ["hero", "features", "testimonials", "cta", "footer"],
            "components": ["Hero", "FeatureGrid", "TestimonialCarousel", "CTASection", "Footer"]
        },
        "about": {
            "layout": "contained",
            "sections": ["hero", "story", "team", "values", "footer"],
            "components": ["PageHero", "ContentBlock", "TeamGrid", "ValueCards", "Footer"]
        },
        "contact": {
            "layout": "split",
            "sections": ["info", "form", "map"],
            "components": ["ContactInfo", "ContactForm", "MapEmbed"]
        },
        "pricing": {
            "layout": "contained",
            "sections": ["header", "plans", "features", "faq", "cta"],
            "components": ["SectionHeader", "PricingCards", "FeatureTable", "FAQ", "CTA"]
        },
        "blog": {
            "layout": "grid",
            "sections": ["header", "featured", "posts", "sidebar", "pagination"],
            "components": ["BlogHeader", "FeaturedPost", "PostGrid", "BlogSidebar", "Pagination"]
        }
    }
    
    # Blueprint storage (in-memory for now, will be DB-backed)
    _blueprints: Dict[str, Blueprint] = {}
    _blueprint_history: Dict[str, List[Blueprint]] = {}
    
    @classmethod
    async def generate(
        cls,
        specification: str,
        blueprint_type: BlueprintType,
        project_context: Dict[str, Any],
        options: Dict[str, Any] = None
    ) -> BlueprintGenerationResult:
        """
        Generate a blueprint from natural language specification.
        
        Args:
            specification: Natural language description
            blueprint_type: Type of blueprint to generate
            project_context: Current project state and settings
            options: Additional generation options
        """
        import time
        start_time = time.time()
        options = options or {}
        warnings = []
        
        # Determine credit cost
        credits_used = cls.CREDIT_COSTS.get(blueprint_type, 1)
        
        # Parse the specification to extract key details
        parsed = cls._parse_specification(specification, blueprint_type)
        
        # Select appropriate template
        template = cls._select_template(parsed, blueprint_type)
        
        # Generate blueprint structure
        if blueprint_type == BlueprintType.SCREEN:
            blueprint = cls._generate_screen_blueprint(parsed, template, project_context)
        elif blueprint_type == BlueprintType.PAGE:
            blueprint = cls._generate_page_blueprint(parsed, template, project_context)
        elif blueprint_type == BlueprintType.FLOW:
            blueprint = cls._generate_flow_blueprint(parsed, project_context)
        elif blueprint_type == BlueprintType.DATA_MODEL:
            blueprint = cls._generate_data_model_blueprint(parsed, project_context)
        elif blueprint_type == BlueprintType.NAVIGATION:
            blueprint = cls._generate_navigation_blueprint(parsed, project_context)
        elif blueprint_type == BlueprintType.FULL_APP:
            blueprint = cls._generate_full_app_blueprint(parsed, project_context)
            credits_used = cls.CREDIT_COSTS[BlueprintType.FULL_APP]
        else:
            blueprint = cls._generate_component_blueprint(parsed, project_context)
        
        # Validate the generated blueprint
        validation = cls.validate(blueprint)
        if not validation.valid:
            return BlueprintGenerationResult(
                success=False,
                message=f"Blueprint validation failed: {', '.join(validation.errors)}",
                warnings=validation.warnings,
                credits_used=0
            )
        
        warnings.extend(validation.warnings)
        
        # Store blueprint
        cls._blueprints[blueprint.id] = blueprint
        
        generation_time = int((time.time() - start_time) * 1000)
        
        return BlueprintGenerationResult(
            success=True,
            blueprint=blueprint,
            message=f"Successfully generated {blueprint_type.value} blueprint: {blueprint.name}",
            warnings=warnings,
            credits_used=credits_used,
            generation_time_ms=generation_time
        )
    
    @classmethod
    def _parse_specification(cls, spec: str, blueprint_type: BlueprintType) -> Dict[str, Any]:
        """Parse natural language specification into structured data."""
        import re
        
        parsed = {
            "name": None,
            "description": spec,
            "keywords": [],
            "features": [],
            "style_hints": []
        }
        
        # Extract name if present
        name_patterns = [
            r'(?:called|named)\s+["\']?([a-zA-Z0-9\s]+)["\']?',
            r'"([^"]+)"',
            r"'([^']+)'",
        ]
        for pattern in name_patterns:
            match = re.search(pattern, spec, re.IGNORECASE)
            if match:
                parsed["name"] = match.group(1).strip().title()
                break
        
        # Extract keywords
        keywords = ["dashboard", "profile", "settings", "home", "about", "contact", 
                   "pricing", "blog", "list", "detail", "form", "auth", "login", "signup"]
        parsed["keywords"] = [kw for kw in keywords if kw in spec.lower()]
        
        # Extract features mentioned
        feature_patterns = ["chart", "table", "form", "card", "list", "grid", "stats",
                          "navigation", "search", "filter", "pagination"]
        parsed["features"] = [f for f in feature_patterns if f in spec.lower()]
        
        # Extract style hints
        style_hints = ["modern", "minimal", "dark", "light", "colorful", "simple", 
                      "professional", "playful", "elegant"]
        parsed["style_hints"] = [s for s in style_hints if s in spec.lower()]
        
        return parsed
    
    @classmethod
    def _select_template(cls, parsed: Dict[str, Any], blueprint_type: BlueprintType) -> Dict[str, Any]:
        """Select the most appropriate template based on parsed specification."""
        templates = (cls.SCREEN_TEMPLATES if blueprint_type == BlueprintType.SCREEN 
                    else cls.PAGE_TEMPLATES if blueprint_type == BlueprintType.PAGE 
                    else {})
        
        # Find best match from keywords
        for keyword in parsed.get("keywords", []):
            if keyword in templates:
                return templates[keyword]
        
        # Default templates
        if blueprint_type == BlueprintType.SCREEN:
            return cls.SCREEN_TEMPLATES.get("dashboard", {})
        elif blueprint_type == BlueprintType.PAGE:
            return cls.PAGE_TEMPLATES.get("home", {})
        
        return {}
    
    @classmethod
    def _generate_screen_blueprint(
        cls, 
        parsed: Dict[str, Any], 
        template: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Blueprint:
        """Generate a screen blueprint."""
        name = parsed.get("name") or "New Screen"
        
        elements = []
        for i, section in enumerate(template.get("sections", [])):
            component = template.get("components", [])[i] if i < len(template.get("components", [])) else "Container"
            elements.append(BlueprintElement(
                type="section",
                name=section,
                properties={"component": component},
                position={"row": i, "col": 0}
            ))
        
        return Blueprint(
            type=BlueprintType.SCREEN,
            name=name,
            description=parsed.get("description"),
            elements=elements,
            metadata={
                "layout": template.get("layout", "vertical"),
                "template_used": parsed.get("keywords", ["custom"])[0] if parsed.get("keywords") else "custom",
                "features": parsed.get("features", []),
                "style": parsed.get("style_hints", [])
            }
        )
    
    @classmethod
    def _generate_page_blueprint(
        cls,
        parsed: Dict[str, Any],
        template: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Blueprint:
        """Generate a page blueprint."""
        name = parsed.get("name") or "New Page"
        
        elements = []
        for i, section in enumerate(template.get("sections", [])):
            component = template.get("components", [])[i] if i < len(template.get("components", [])) else "Section"
            elements.append(BlueprintElement(
                type="section",
                name=section,
                properties={"component": component},
                position={"row": i, "col": 0}
            ))
        
        return Blueprint(
            type=BlueprintType.PAGE,
            name=name,
            description=parsed.get("description"),
            elements=elements,
            metadata={
                "layout": template.get("layout", "full-width"),
                "template_used": parsed.get("keywords", ["custom"])[0] if parsed.get("keywords") else "custom",
                "features": parsed.get("features", []),
                "style": parsed.get("style_hints", [])
            }
        )
    
    @classmethod
    def _generate_flow_blueprint(cls, parsed: Dict[str, Any], context: Dict[str, Any]) -> Blueprint:
        """Generate a flow blueprint."""
        name = parsed.get("name") or "New Flow"
        
        # Default flow steps
        steps = ["Start", "Process", "Validate", "Complete"]
        elements = [
            BlueprintElement(
                type="flow_step",
                name=step,
                properties={"order": i, "type": "step"},
                position={"row": 0, "col": i}
            )
            for i, step in enumerate(steps)
        ]
        
        return Blueprint(
            type=BlueprintType.FLOW,
            name=name,
            description=parsed.get("description"),
            elements=elements,
            metadata={"flow_type": "sequential"}
        )
    
    @classmethod
    def _generate_data_model_blueprint(cls, parsed: Dict[str, Any], context: Dict[str, Any]) -> Blueprint:
        """Generate a data model blueprint."""
        name = parsed.get("name") or "NewModel"
        
        # Default fields
        fields = [
            {"name": "id", "type": "string", "required": True, "primary": True},
            {"name": "created_at", "type": "datetime", "required": True},
            {"name": "updated_at", "type": "datetime", "required": True}
        ]
        
        elements = [
            BlueprintElement(
                type="field",
                name=f["name"],
                properties=f
            )
            for f in fields
        ]
        
        return Blueprint(
            type=BlueprintType.DATA_MODEL,
            name=name,
            description=parsed.get("description"),
            elements=elements,
            metadata={"collection": name.lower()}
        )
    
    @classmethod
    def _generate_navigation_blueprint(cls, parsed: Dict[str, Any], context: Dict[str, Any]) -> Blueprint:
        """Generate a navigation blueprint."""
        name = parsed.get("name") or "Main Navigation"
        
        # Default navigation items
        nav_items = [
            {"label": "Home", "path": "/", "icon": "home"},
            {"label": "Dashboard", "path": "/dashboard", "icon": "dashboard"},
            {"label": "Settings", "path": "/settings", "icon": "settings"}
        ]
        
        elements = [
            BlueprintElement(
                type="nav_item",
                name=item["label"],
                properties=item
            )
            for item in nav_items
        ]
        
        return Blueprint(
            type=BlueprintType.NAVIGATION,
            name=name,
            description=parsed.get("description"),
            elements=elements,
            metadata={"nav_type": "sidebar"}
        )
    
    @classmethod
    def _generate_full_app_blueprint(cls, parsed: Dict[str, Any], context: Dict[str, Any]) -> Blueprint:
        """Generate a complete app blueprint."""
        name = parsed.get("name") or "New App"
        
        # Generate sub-blueprints
        screens = ["Dashboard", "Profile", "Settings"]
        elements = [
            BlueprintElement(
                type="screen",
                name=screen,
                properties={"blueprint_type": "screen"},
                children=[]
            )
            for screen in screens
        ]
        
        # Add navigation
        elements.append(BlueprintElement(
            type="navigation",
            name="Main Navigation",
            properties={"nav_type": "sidebar"}
        ))
        
        return Blueprint(
            type=BlueprintType.FULL_APP,
            name=name,
            description=parsed.get("description"),
            elements=elements,
            metadata={
                "app_type": "mobile_app",
                "screens": screens,
                "has_auth": True
            }
        )
    
    @classmethod
    def _generate_component_blueprint(cls, parsed: Dict[str, Any], context: Dict[str, Any]) -> Blueprint:
        """Generate a component blueprint."""
        name = parsed.get("name") or "NewComponent"
        
        return Blueprint(
            type=BlueprintType.COMPONENT,
            name=name,
            description=parsed.get("description"),
            elements=[],
            metadata={"component_type": "custom"}
        )
    
    @classmethod
    def validate(cls, blueprint: Blueprint) -> BlueprintValidationResult:
        """Validate a blueprint structure."""
        errors = []
        warnings = []
        suggestions = []
        
        # Check required fields
        if not blueprint.name:
            errors.append("Blueprint name is required")
        
        if not blueprint.type:
            errors.append("Blueprint type is required")
        
        # Check elements
        if not blueprint.elements and blueprint.type not in [BlueprintType.COMPONENT]:
            warnings.append("Blueprint has no elements - consider adding content")
        
        # Type-specific validation
        if blueprint.type == BlueprintType.SCREEN:
            if len(blueprint.elements) < 2:
                suggestions.append("Consider adding more sections for a complete screen")
        
        if blueprint.type == BlueprintType.DATA_MODEL:
            has_id = any(e.name == "id" for e in blueprint.elements)
            if not has_id:
                warnings.append("Data model should have an 'id' field")
        
        return BlueprintValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            suggestions=suggestions
        )
    
    @classmethod
    def get_blueprint(cls, blueprint_id: str) -> Optional[Blueprint]:
        """Retrieve a blueprint by ID."""
        return cls._blueprints.get(blueprint_id)
    
    @classmethod
    def list_blueprints(
        cls, 
        blueprint_type: Optional[BlueprintType] = None,
        status: Optional[BlueprintStatus] = None
    ) -> List[Blueprint]:
        """List all blueprints, optionally filtered."""
        blueprints = list(cls._blueprints.values())
        
        if blueprint_type:
            blueprints = [b for b in blueprints if b.type == blueprint_type]
        
        if status:
            blueprints = [b for b in blueprints if b.status == status]
        
        return sorted(blueprints, key=lambda b: b.created_at, reverse=True)
    
    @classmethod
    def apply_blueprint(cls, blueprint_id: str) -> Tuple[bool, str]:
        """Mark a blueprint as applied to the project."""
        blueprint = cls._blueprints.get(blueprint_id)
        if not blueprint:
            return False, "Blueprint not found"
        
        # Store in history before modification
        if blueprint_id not in cls._blueprint_history:
            cls._blueprint_history[blueprint_id] = []
        cls._blueprint_history[blueprint_id].append(blueprint.model_copy())
        
        # Update status
        blueprint.status = BlueprintStatus.APPLIED
        blueprint.updated_at = datetime.now(timezone.utc)
        
        return True, f"Blueprint '{blueprint.name}' applied successfully"
    
    @classmethod
    def delete_blueprint(cls, blueprint_id: str) -> Tuple[bool, str]:
        """Delete a blueprint."""
        if blueprint_id not in cls._blueprints:
            return False, "Blueprint not found"
        
        blueprint = cls._blueprints.pop(blueprint_id)
        return True, f"Blueprint '{blueprint.name}' deleted"
