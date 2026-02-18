# Voice-Driven Project Review Engine - Project summaries and walkthroughs via voice
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone


class ReviewMode(str, Enum):
    HIGH_LEVEL = "high_level_summary"
    DETAILED = "detailed_summary"
    SCREEN_BY_SCREEN = "screen_by_screen_review"
    DATA_MODEL_REVIEW = "data_model_review"
    NAVIGATION_REVIEW = "navigation_review"
    FLOW_REVIEW = "flow_review"


class ReviewSection(BaseModel):
    """Section of a project review."""
    title: str
    text_content: str
    voice_content: str
    items: List[Dict[str, Any]] = []


class ProjectReview(BaseModel):
    """Complete project review."""
    project_name: str
    mode: ReviewMode
    sections: List[ReviewSection] = []
    summary_text: str
    summary_voice: str
    statistics: Dict[str, int] = {}
    health_score: int = 100
    suggestions: List[str] = []


class VoiceDrivenProjectReviewEngine:
    """
    Voice-Driven Project Review & Summary Engine.
    
    Responsibilities:
    - Provide spoken summaries of the entire project
    - Explain screens, flows, data models, and navigation
    - Generate high-level or detailed reviews
    - Support hands-free project walkthroughs
    
    Review Modes:
    - high_level_summary
    - detailed_summary
    - screen_by_screen_review
    - data_model_review
    - navigation_review
    - flow_review
    
    Supported Commands:
    - "Summarize my project"
    - "Walk me through all screens"
    - "Explain my data models"
    - "Review the navigation structure"
    - "Give me a detailed project overview"
    
    Rules:
    - Must provide text equivalent
    - Must not modify project during review
    - Must support voice or text output
    """
    
    @classmethod
    def parse_review_command(cls, command: str) -> ReviewMode:
        """Parse voice command to determine review mode."""
        command_lower = command.lower()
        
        if any(kw in command_lower for kw in ["screens", "screen by screen", "all screens", "each screen"]):
            return ReviewMode.SCREEN_BY_SCREEN
        elif any(kw in command_lower for kw in ["data model", "models", "database", "fields"]):
            return ReviewMode.DATA_MODEL_REVIEW
        elif any(kw in command_lower for kw in ["navigation", "nav", "routes", "links", "menu"]):
            return ReviewMode.NAVIGATION_REVIEW
        elif any(kw in command_lower for kw in ["flow", "flows", "process", "workflow"]):
            return ReviewMode.FLOW_REVIEW
        elif any(kw in command_lower for kw in ["detailed", "everything", "complete", "full"]):
            return ReviewMode.DETAILED
        else:
            return ReviewMode.HIGH_LEVEL
    
    @classmethod
    async def generate_review(
        cls,
        project: Dict[str, Any],
        mode: ReviewMode = ReviewMode.HIGH_LEVEL
    ) -> ProjectReview:
        """Generate a project review based on mode."""
        project_name = project.get("name", "Your Project")
        screens = project.get("screens", [])
        pages = project.get("pages", [])
        data_models = project.get("data_models", [])
        flows = project.get("flows", [])
        navigation = project.get("navigation", {})
        
        # Calculate statistics
        stats = {
            "screens": len(screens),
            "pages": len(pages),
            "data_models": len(data_models),
            "flows": len(flows),
            "total_components": sum(len(s.get("components", [])) for s in screens)
        }
        
        # Calculate health score
        health = cls._calculate_health(project)
        
        # Generate review based on mode
        if mode == ReviewMode.HIGH_LEVEL:
            return cls._generate_high_level_review(project_name, stats, health, project)
        elif mode == ReviewMode.DETAILED:
            return cls._generate_detailed_review(project_name, stats, health, project)
        elif mode == ReviewMode.SCREEN_BY_SCREEN:
            return cls._generate_screen_review(project_name, screens, health)
        elif mode == ReviewMode.DATA_MODEL_REVIEW:
            return cls._generate_data_model_review(project_name, data_models, health)
        elif mode == ReviewMode.NAVIGATION_REVIEW:
            return cls._generate_navigation_review(project_name, navigation, screens, health)
        elif mode == ReviewMode.FLOW_REVIEW:
            return cls._generate_flow_review(project_name, flows, health)
        
        return cls._generate_high_level_review(project_name, stats, health, project)
    
    @classmethod
    def _calculate_health(cls, project: Dict[str, Any]) -> int:
        """Calculate project health score (0-100)."""
        score = 100
        
        screens = project.get("screens", [])
        pages = project.get("pages", [])
        data_models = project.get("data_models", [])
        
        # Deduct for empty project
        if not screens and not pages:
            score -= 30
        
        # Deduct for screens without components
        empty_screens = sum(1 for s in screens if not s.get("components"))
        if empty_screens > 0:
            score -= min(20, empty_screens * 5)
        
        # Deduct for data models without fields
        empty_models = sum(1 for m in data_models if not m.get("fields"))
        if empty_models > 0:
            score -= min(15, empty_models * 5)
        
        # Deduct for no navigation
        if not project.get("navigation"):
            score -= 10
        
        return max(0, score)
    
    @classmethod
    def _generate_high_level_review(
        cls,
        project_name: str,
        stats: Dict[str, int],
        health: int,
        project: Dict[str, Any]
    ) -> ProjectReview:
        """Generate high-level project summary."""
        sections = []
        suggestions = []
        
        # Overview section
        overview_items = []
        if stats["screens"] > 0:
            overview_items.append(f"{stats['screens']} screens")
        if stats["pages"] > 0:
            overview_items.append(f"{stats['pages']} pages")
        if stats["data_models"] > 0:
            overview_items.append(f"{stats['data_models']} data models")
        if stats["flows"] > 0:
            overview_items.append(f"{stats['flows']} flows")
        
        overview_text = ", ".join(overview_items) if overview_items else "empty"
        
        sections.append(ReviewSection(
            title="Project Overview",
            text_content=f"**{project_name}** contains: {overview_text}",
            voice_content=f"{project_name} has {overview_text}.",
            items=[{"stat": k, "count": v} for k, v in stats.items() if v > 0]
        ))
        
        # Health section
        health_status = "excellent" if health >= 90 else "good" if health >= 70 else "needs attention" if health >= 50 else "needs work"
        sections.append(ReviewSection(
            title="Project Health",
            text_content=f"Health Score: **{health}/100** ({health_status})",
            voice_content=f"Your project health score is {health} out of 100, which is {health_status}."
        ))
        
        # Suggestions
        if stats["screens"] == 0 and stats["pages"] == 0:
            suggestions.append("Add your first screen or page to get started")
        if stats["data_models"] == 0:
            suggestions.append("Consider adding data models for dynamic content")
        if health < 70:
            suggestions.append("Review the detailed report for improvement suggestions")
        
        summary_text = f"**{project_name}** is {health}% complete with {overview_text}."
        summary_voice = f"{project_name} is {health} percent complete with {overview_text}."
        
        if suggestions:
            summary_voice += f" I have {len(suggestions)} suggestions to improve it."
        
        return ProjectReview(
            project_name=project_name,
            mode=ReviewMode.HIGH_LEVEL,
            sections=sections,
            summary_text=summary_text,
            summary_voice=summary_voice,
            statistics=stats,
            health_score=health,
            suggestions=suggestions
        )
    
    @classmethod
    def _generate_detailed_review(
        cls,
        project_name: str,
        stats: Dict[str, int],
        health: int,
        project: Dict[str, Any]
    ) -> ProjectReview:
        """Generate detailed project review."""
        sections = []
        
        # Start with high-level
        high_level = cls._generate_high_level_review(project_name, stats, health, project)
        sections.extend(high_level.sections)
        
        # Add screen details
        screens = project.get("screens", [])
        if screens:
            screen_items = []
            for s in screens:
                components = s.get("components", [])
                screen_items.append({
                    "name": s.get("name", "Unnamed"),
                    "components": len(components)
                })
            
            screen_list = ", ".join([f"{s['name']} ({s['components']} components)" for s in screen_items[:5]])
            sections.append(ReviewSection(
                title="Screens",
                text_content=f"**{len(screens)} Screens**: {screen_list}",
                voice_content=f"You have {len(screens)} screens: {screen_list}.",
                items=screen_items
            ))
        
        # Add data model details
        data_models = project.get("data_models", [])
        if data_models:
            model_items = []
            for m in data_models:
                fields = m.get("fields", [])
                model_items.append({
                    "name": m.get("name", "Unnamed"),
                    "fields": len(fields)
                })
            
            model_list = ", ".join([f"{m['name']} ({m['fields']} fields)" for m in model_items[:5]])
            sections.append(ReviewSection(
                title="Data Models",
                text_content=f"**{len(data_models)} Data Models**: {model_list}",
                voice_content=f"You have {len(data_models)} data models: {model_list}.",
                items=model_items
            ))
        
        summary_voice = f"Here's a detailed overview of {project_name}. " + high_level.summary_voice
        
        return ProjectReview(
            project_name=project_name,
            mode=ReviewMode.DETAILED,
            sections=sections,
            summary_text=high_level.summary_text,
            summary_voice=summary_voice,
            statistics=stats,
            health_score=health,
            suggestions=high_level.suggestions
        )
    
    @classmethod
    def _generate_screen_review(
        cls,
        project_name: str,
        screens: List[Dict[str, Any]],
        health: int
    ) -> ProjectReview:
        """Generate screen-by-screen review."""
        sections = []
        
        if not screens:
            return ProjectReview(
                project_name=project_name,
                mode=ReviewMode.SCREEN_BY_SCREEN,
                sections=[],
                summary_text="No screens in this project yet.",
                summary_voice="Your project doesn't have any screens yet. Would you like to create one?",
                health_score=health
            )
        
        for i, screen in enumerate(screens):
            name = screen.get("name", f"Screen {i+1}")
            components = screen.get("components", [])
            description = screen.get("description", "No description")
            
            component_types = {}
            for c in components:
                ctype = c.get("type", "unknown")
                component_types[ctype] = component_types.get(ctype, 0) + 1
            
            comp_summary = ", ".join([f"{v} {k}s" if v > 1 else f"1 {k}" for k, v in component_types.items()])
            
            sections.append(ReviewSection(
                title=name,
                text_content=f"**{name}**: {len(components)} components\n{comp_summary or 'Empty screen'}",
                voice_content=f"{name} has {len(components)} components. {comp_summary or 'It is currently empty.'}",
                items=[{"component_type": k, "count": v} for k, v in component_types.items()]
            ))
        
        return ProjectReview(
            project_name=project_name,
            mode=ReviewMode.SCREEN_BY_SCREEN,
            sections=sections,
            summary_text=f"**{len(screens)} Screens** in {project_name}",
            summary_voice=f"Let me walk you through your {len(screens)} screens.",
            statistics={"screens": len(screens)},
            health_score=health
        )
    
    @classmethod
    def _generate_data_model_review(
        cls,
        project_name: str,
        data_models: List[Dict[str, Any]],
        health: int
    ) -> ProjectReview:
        """Generate data model review."""
        sections = []
        
        if not data_models:
            return ProjectReview(
                project_name=project_name,
                mode=ReviewMode.DATA_MODEL_REVIEW,
                sections=[],
                summary_text="No data models in this project yet.",
                summary_voice="Your project doesn't have any data models. Would you like to create one?",
                health_score=health
            )
        
        for model in data_models:
            name = model.get("name", "Unnamed Model")
            fields = model.get("fields", [])
            
            field_list = ", ".join([f.get("name", "unnamed") for f in fields[:5]])
            if len(fields) > 5:
                field_list += f", and {len(fields) - 5} more"
            
            sections.append(ReviewSection(
                title=name,
                text_content=f"**{name}**: {len(fields)} fields\nFields: {field_list or 'None'}",
                voice_content=f"The {name} model has {len(fields)} fields: {field_list or 'none yet'}.",
                items=[{"field": f.get("name"), "type": f.get("type", "text")} for f in fields]
            ))
        
        return ProjectReview(
            project_name=project_name,
            mode=ReviewMode.DATA_MODEL_REVIEW,
            sections=sections,
            summary_text=f"**{len(data_models)} Data Models** in {project_name}",
            summary_voice=f"Your project has {len(data_models)} data models. Let me explain each one.",
            statistics={"data_models": len(data_models)},
            health_score=health
        )
    
    @classmethod
    def _generate_navigation_review(
        cls,
        project_name: str,
        navigation: Dict[str, Any],
        screens: List[Dict[str, Any]],
        health: int
    ) -> ProjectReview:
        """Generate navigation structure review."""
        sections = []
        
        root = navigation.get("root_screen", "Not set")
        links = navigation.get("links", [])
        menu_items = navigation.get("menu_items", [])
        
        sections.append(ReviewSection(
            title="Home Screen",
            text_content=f"**Home Screen**: {root}",
            voice_content=f"Your home screen is {root}."
        ))
        
        if menu_items:
            menu_text = ", ".join(menu_items[:5])
            sections.append(ReviewSection(
                title="Menu Items",
                text_content=f"**Menu**: {menu_text}",
                voice_content=f"Your menu contains: {menu_text}."
            ))
        
        if links:
            sections.append(ReviewSection(
                title="Navigation Links",
                text_content=f"**{len(links)} links** between screens",
                voice_content=f"You have {len(links)} navigation links between screens."
            ))
        
        # Check for orphan screens
        screen_names = [s.get("name", "").lower() for s in screens]
        linked_screens = set([l.get("target", "").lower() for l in links])
        linked_screens.add(root.lower() if root else "")
        
        orphans = [s.get("name") for s in screens if s.get("name", "").lower() not in linked_screens]
        if orphans:
            sections.append(ReviewSection(
                title="⚠️ Orphan Screens",
                text_content=f"Screens without navigation: {', '.join(orphans)}",
                voice_content=f"Warning: these screens are not linked: {', '.join(orphans)}."
            ))
        
        return ProjectReview(
            project_name=project_name,
            mode=ReviewMode.NAVIGATION_REVIEW,
            sections=sections,
            summary_text=f"Navigation review for {project_name}",
            summary_voice=f"Here's your navigation structure for {project_name}.",
            health_score=health,
            suggestions=["Add navigation links to orphan screens"] if orphans else []
        )
    
    @classmethod
    def _generate_flow_review(
        cls,
        project_name: str,
        flows: List[Dict[str, Any]],
        health: int
    ) -> ProjectReview:
        """Generate flow review."""
        sections = []
        
        if not flows:
            return ProjectReview(
                project_name=project_name,
                mode=ReviewMode.FLOW_REVIEW,
                sections=[],
                summary_text="No flows in this project yet.",
                summary_voice="Your project doesn't have any flows yet. Flows are multi-step processes like checkout or onboarding.",
                health_score=health,
                suggestions=["Create a flow for multi-step processes"]
            )
        
        for flow in flows:
            name = flow.get("name", "Unnamed Flow")
            steps = flow.get("steps", [])
            
            step_names = [s.get("name", f"Step {i+1}") for i, s in enumerate(steps)]
            
            sections.append(ReviewSection(
                title=name,
                text_content=f"**{name}**: {len(steps)} steps\n{' → '.join(step_names)}",
                voice_content=f"The {name} flow has {len(steps)} steps: {', then '.join(step_names)}."
            ))
        
        return ProjectReview(
            project_name=project_name,
            mode=ReviewMode.FLOW_REVIEW,
            sections=sections,
            summary_text=f"**{len(flows)} Flows** in {project_name}",
            summary_voice=f"Your project has {len(flows)} flows. Let me walk you through them.",
            statistics={"flows": len(flows)},
            health_score=health
        )
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get list of supported review commands."""
        return [
            {
                "mode": "high_level",
                "examples": ["Summarize my project", "Give me an overview", "Project summary"],
                "description": "Get a quick high-level summary of your project"
            },
            {
                "mode": "detailed",
                "examples": ["Detailed overview", "Tell me everything", "Complete review"],
                "description": "Get a comprehensive review of all project components"
            },
            {
                "mode": "screen_by_screen",
                "examples": ["Walk me through the screens", "Explain each screen", "Screen review"],
                "description": "Go through each screen one by one"
            },
            {
                "mode": "data_model_review",
                "examples": ["Explain my data models", "Review the database", "What data models do I have?"],
                "description": "Review all data models and their fields"
            },
            {
                "mode": "navigation_review",
                "examples": ["Review navigation", "How do users navigate?", "Show navigation flow"],
                "description": "Understand the navigation structure"
            },
            {
                "mode": "flow_review",
                "examples": ["Review my flows", "Explain the workflows", "What flows do I have?"],
                "description": "Review multi-step flows and processes"
            }
        ]
