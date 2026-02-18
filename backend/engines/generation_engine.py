# Generation Engine - Handles AI-powered content generation
from models.schemas import (
    GenerationType, ProjectType, ProjectStructure,
    GenerationRequest, GenerationResponse, GENERATION_COSTS
)
from typing import Dict, Any, List
import random


class GenerationEngine:
    """
    Generation Engine handles AI-powered generation of screens, pages, flows.
    Currently uses mock generation - integrate with LLM for real generation.
    """
    
    @staticmethod
    def get_cost(gen_type: GenerationType) -> int:
        """Get credit cost for generation type."""
        return GENERATION_COSTS.get(gen_type, 1)
    
    @staticmethod
    async def generate_screen(prompt: str, project_type: ProjectType) -> Dict[str, Any]:
        """Generate a screen structure based on prompt."""
        # Mock generation - replace with actual LLM integration
        screen_templates = {
            ProjectType.APP: [
                {"name": "Dashboard", "components": ["Header", "StatsGrid", "RecentActivity", "QuickActions"]},
                {"name": "Profile", "components": ["Avatar", "UserInfo", "Settings", "Activity"]},
                {"name": "Settings", "components": ["ProfileSection", "SecuritySection", "PreferencesSection"]},
                {"name": "List View", "components": ["SearchBar", "FilterBar", "ItemList", "Pagination"]},
                {"name": "Detail View", "components": ["Header", "MainContent", "Sidebar", "Actions"]},
            ],
            ProjectType.WEBSITE: [
                {"name": "Home", "components": ["Hero", "Features", "Testimonials", "CTA"]},
                {"name": "About", "components": ["Story", "Team", "Values", "Timeline"]},
                {"name": "Contact", "components": ["ContactForm", "Map", "Info", "FAQ"]},
                {"name": "Services", "components": ["ServiceGrid", "Pricing", "Comparison"]},
            ],
        }
        
        templates = screen_templates.get(project_type, screen_templates[ProjectType.APP])
        template = random.choice(templates)
        
        return {
            "type": "screen",
            "name": template["name"],
            "components": template["components"],
            "prompt_used": prompt,
            "generated": True
        }
    
    @staticmethod
    async def generate_page(prompt: str, project_type: ProjectType) -> Dict[str, Any]:
        """Generate a page structure based on prompt."""
        page_templates = {
            ProjectType.WEBSITE: [
                {"name": "Landing Page", "sections": ["Hero", "Features", "Social Proof", "Pricing", "FAQ", "CTA"]},
                {"name": "Blog Post", "sections": ["Header", "Content", "Author", "Related", "Comments"]},
                {"name": "Product Page", "sections": ["Gallery", "Details", "Specs", "Reviews", "Related"]},
            ],
            ProjectType.APP: [
                {"name": "Onboarding", "sections": ["Welcome", "Features", "Permissions", "GetStarted"]},
                {"name": "Empty State", "sections": ["Illustration", "Message", "PrimaryAction"]},
            ],
        }
        
        templates = page_templates.get(project_type, page_templates[ProjectType.WEBSITE])
        template = random.choice(templates)
        
        return {
            "type": "page",
            "name": template["name"],
            "sections": template["sections"],
            "prompt_used": prompt,
            "generated": True
        }
    
    @staticmethod
    async def generate_flow(prompt: str, project_type: ProjectType) -> Dict[str, Any]:
        """Generate a user flow based on prompt."""
        flow_templates = [
            {"name": "Authentication", "steps": ["Login", "Verify", "Dashboard"]},
            {"name": "Onboarding", "steps": ["Welcome", "Profile Setup", "Preferences", "Complete"]},
            {"name": "Checkout", "steps": ["Cart", "Shipping", "Payment", "Confirmation"]},
            {"name": "Content Creation", "steps": ["New", "Edit", "Preview", "Publish"]},
        ]
        
        template = random.choice(flow_templates)
        
        return {
            "type": "flow",
            "name": template["name"],
            "steps": template["steps"],
            "prompt_used": prompt,
            "generated": True
        }
    
    @staticmethod
    async def refine_content(prompt: str, existing_content: Dict[str, Any]) -> Dict[str, Any]:
        """Refine existing content based on prompt."""
        return {
            "type": "refinement",
            "original": existing_content,
            "refinement_prompt": prompt,
            "refined": True,
            "changes": ["Updated based on prompt"]
        }
    
    @staticmethod
    async def generate(request: GenerationRequest, project_type: ProjectType) -> Dict[str, Any]:
        """Route generation request to appropriate handler."""
        if request.type == GenerationType.SCREEN:
            return await GenerationEngine.generate_screen(request.prompt, project_type)
        elif request.type == GenerationType.PAGE:
            return await GenerationEngine.generate_page(request.prompt, project_type)
        elif request.type == GenerationType.FLOW:
            return await GenerationEngine.generate_flow(request.prompt, project_type)
        elif request.type == GenerationType.REFINEMENT:
            return await GenerationEngine.refine_content(request.prompt, {})
        else:
            return {"error": "Unknown generation type"}
    
    @staticmethod
    def generate_initial_structure(project_type: ProjectType, description: str) -> ProjectStructure:
        """Generate initial project structure based on type and description."""
        structures = {
            ProjectType.APP: ProjectStructure(
                screens=["Home", "Dashboard", "Profile", "Settings", "Login", "Signup"],
                data_models=["User", "Session", "Preferences"],
                flows=["Authentication", "Onboarding", "Main Navigation"]
            ),
            ProjectType.WEBSITE: ProjectStructure(
                pages=["Home", "About", "Services", "Pricing", "Contact", "Blog"],
                sections=["Hero", "Features", "Testimonials", "CTA", "Footer"],
                integrations=["Contact Form", "Newsletter", "Analytics"]
            ),
            ProjectType.BOTH: ProjectStructure(
                screens=["Dashboard", "Profile", "Settings"],
                pages=["Landing", "About", "Pricing", "Blog"],
                data_models=["User", "Session", "Content"],
                flows=["Authentication", "Onboarding", "Content Management"]
            )
        }
        
        return structures.get(project_type, structures[ProjectType.APP])
