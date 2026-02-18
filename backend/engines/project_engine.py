# Project Engine - Enhanced project management
from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import copy

from models.schemas import (
    Project, ProjectCreate, ProjectType, ProjectStatus, ProjectStructure,
    PlanType, PLAN_CONFIG
)
from engines.data_model_engine import DataModelEngine, DataModel
from engines.navigation_engine import NavigationEngine, NavigationStructure


class ProjectEngine:
    """
    Project Engine handles all project-related operations.
    
    Responsibilities:
    - Create new projects
    - Store project metadata
    - Track timestamps and status
    - Enforce project limits per plan
    - Manage deletion and restoration
    - Handle project duplication
    - Store project-level settings
    """
    
    @staticmethod
    def get_project_limits(plan: PlanType) -> int:
        """Get the maximum number of projects allowed for a plan."""
        return PLAN_CONFIG.get(plan, PLAN_CONFIG[PlanType.FREE])["max_projects"]
    
    @staticmethod
    def can_create_project(plan: PlanType, current_count: int) -> Tuple[bool, str]:
        """Check if user can create more projects."""
        limit = ProjectEngine.get_project_limits(plan)
        if current_count >= limit:
            return False, f"Project limit reached ({current_count}/{limit}). Upgrade to create more."
        return True, f"Can create project ({current_count}/{limit})"
    
    @staticmethod
    def create_project(
        user_id: str,
        name: str,
        project_type: ProjectType,
        description: Optional[str] = None
    ) -> Project:
        """Create a new project with initial structure."""
        # Generate initial structure based on type
        structure = ProjectEngine._generate_initial_structure(project_type, description or "")
        
        project = Project(
            user_id=user_id,
            name=name,
            description=description,
            type=project_type,
            status=ProjectStatus.DRAFT,
            structure=structure
        )
        
        return project
    
    @staticmethod
    def _generate_initial_structure(project_type: ProjectType, description: str) -> ProjectStructure:
        """Generate initial project structure based on type."""
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
    
    @staticmethod
    def duplicate_project(project: Project, new_name: Optional[str] = None) -> Project:
        """Create a duplicate of a project."""
        # Deep copy the project
        new_project = Project(
            user_id=project.user_id,
            name=new_name or f"{project.name} (Copy)",
            description=project.description,
            type=project.type,
            status=ProjectStatus.DRAFT,  # Always start as draft
            structure=ProjectStructure(
                screens=project.structure.screens.copy(),
                pages=project.structure.pages.copy(),
                data_models=project.structure.data_models.copy(),
                flows=project.structure.flows.copy(),
                sections=project.structure.sections.copy(),
                integrations=project.structure.integrations.copy()
            ),
            thumbnail=project.thumbnail,
            staging_url=None,  # Don't copy URLs
            production_url=None
        )
        
        return new_project
    
    @staticmethod
    def update_project_status(
        project: Project,
        new_status: ProjectStatus
    ) -> Tuple[Project, bool, str]:
        """Update project status with validation."""
        # Validate status transitions
        valid_transitions = {
            ProjectStatus.DRAFT: [ProjectStatus.BUILDING],
            ProjectStatus.BUILDING: [ProjectStatus.DRAFT, ProjectStatus.STAGED],
            ProjectStatus.STAGED: [ProjectStatus.BUILDING, ProjectStatus.PUBLISHED],
            ProjectStatus.PUBLISHED: [ProjectStatus.STAGED, ProjectStatus.BUILDING]
        }
        
        if new_status not in valid_transitions.get(project.status, []):
            return project, False, f"Cannot transition from {project.status.value} to {new_status.value}"
        
        project.status = new_status
        project.updated_at = datetime.now(timezone.utc)
        
        return project, True, f"Status updated to {new_status.value}"
    
    @staticmethod
    def add_screen(project: Project, screen_name: str) -> Tuple[Project, bool, str]:
        """Add a screen to the project."""
        if screen_name in project.structure.screens:
            return project, False, f"Screen '{screen_name}' already exists"
        
        project.structure.screens.append(screen_name)
        project.updated_at = datetime.now(timezone.utc)
        
        return project, True, f"Screen '{screen_name}' added"
    
    @staticmethod
    def remove_screen(project: Project, screen_name: str) -> Tuple[Project, bool, str]:
        """Remove a screen from the project."""
        if screen_name not in project.structure.screens:
            return project, False, f"Screen '{screen_name}' not found"
        
        project.structure.screens.remove(screen_name)
        project.updated_at = datetime.now(timezone.utc)
        
        return project, True, f"Screen '{screen_name}' removed"
    
    @staticmethod
    def add_page(project: Project, page_name: str) -> Tuple[Project, bool, str]:
        """Add a page to the project."""
        if page_name in project.structure.pages:
            return project, False, f"Page '{page_name}' already exists"
        
        project.structure.pages.append(page_name)
        project.updated_at = datetime.now(timezone.utc)
        
        return project, True, f"Page '{page_name}' added"
    
    @staticmethod
    def add_data_model(project: Project, model_name: str) -> Tuple[Project, bool, str]:
        """Add a data model to the project."""
        if model_name in project.structure.data_models:
            return project, False, f"Data model '{model_name}' already exists"
        
        project.structure.data_models.append(model_name)
        project.updated_at = datetime.now(timezone.utc)
        
        return project, True, f"Data model '{model_name}' added"
    
    @staticmethod
    def add_flow(project: Project, flow_name: str) -> Tuple[Project, bool, str]:
        """Add a flow to the project."""
        if flow_name in project.structure.flows:
            return project, False, f"Flow '{flow_name}' already exists"
        
        project.structure.flows.append(flow_name)
        project.updated_at = datetime.now(timezone.utc)
        
        return project, True, f"Flow '{flow_name}' added"
    
    @staticmethod
    def get_project_stats(project: Project) -> Dict[str, Any]:
        """Get statistics for a project."""
        return {
            "id": project.id,
            "name": project.name,
            "type": project.type.value,
            "status": project.status.value,
            "stats": {
                "screens": len(project.structure.screens),
                "pages": len(project.structure.pages),
                "data_models": len(project.structure.data_models),
                "flows": len(project.structure.flows),
                "sections": len(project.structure.sections),
                "integrations": len(project.structure.integrations)
            },
            "is_staged": project.staging_url is not None,
            "is_published": project.production_url is not None,
            "created_at": project.created_at.isoformat(),
            "updated_at": project.updated_at.isoformat()
        }
    
    @staticmethod
    def get_project_summary(project: Project) -> str:
        """Get a human-readable summary of the project."""
        stats = ProjectEngine.get_project_stats(project)
        
        summary = f"**{project.name}** ({project.type.value})\n\n"
        summary += f"Status: {project.status.value.title()}\n\n"
        
        if project.structure.screens:
            summary += f"**Screens ({len(project.structure.screens)}):** {', '.join(project.structure.screens)}\n"
        
        if project.structure.pages:
            summary += f"**Pages ({len(project.structure.pages)}):** {', '.join(project.structure.pages)}\n"
        
        if project.structure.data_models:
            summary += f"**Data Models ({len(project.structure.data_models)}):** {', '.join(project.structure.data_models)}\n"
        
        if project.structure.flows:
            summary += f"**Flows ({len(project.structure.flows)}):** {', '.join(project.structure.flows)}\n"
        
        if project.staging_url:
            summary += f"\n📦 Staging: {project.staging_url}"
        
        if project.production_url:
            summary += f"\n🚀 Production: {project.production_url}"
        
        return summary
