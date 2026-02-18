# Export Engine - Handles project code export
from models.schemas import PlanType, Project
from engines.plan_enforcement import PlanEnforcementEngine
from typing import Tuple, Optional
import uuid


class ExportEngine:
    """
    Export Engine handles project code and asset exports.
    
    Rules:
    - Free: No export allowed
    - Creator/Pro/Elite: Full export access
    
    Export Types:
    - full_app: Complete app with all code
    - full_website: Complete website with all pages
    - code_package: Source code only
    - static_assets: Images, fonts, styles only
    """
    
    EXPORT_TYPES = ["full_app", "full_website", "code_package", "static_assets"]
    
    @staticmethod
    def can_export(plan: PlanType, export_type: str) -> Tuple[bool, str]:
        """Check if user can export the specified type."""
        if export_type not in ExportEngine.EXPORT_TYPES:
            return False, f"Invalid export type. Choose from: {', '.join(ExportEngine.EXPORT_TYPES)}"
        
        can, message = PlanEnforcementEngine.can_export(plan)
        return can, message
    
    @staticmethod
    async def export_full_app(project: Project) -> Tuple[bool, str, Optional[str]]:
        """
        Export complete app with all code.
        Returns: (success, message, download_url)
        """
        # Mock export - integrate with actual export service
        download_url = f"https://exports.bluelotus.app/{project.id}/app-{project.id[:8]}.zip"
        
        return True, "App export ready for download", download_url
    
    @staticmethod
    async def export_full_website(project: Project) -> Tuple[bool, str, Optional[str]]:
        """
        Export complete website with all pages.
        Returns: (success, message, download_url)
        """
        # Mock export - integrate with actual export service
        download_url = f"https://exports.bluelotus.app/{project.id}/website-{project.id[:8]}.zip"
        
        return True, "Website export ready for download", download_url
    
    @staticmethod
    async def export_code_package(project: Project) -> Tuple[bool, str, Optional[str]]:
        """
        Export source code only.
        Returns: (success, message, download_url)
        """
        # Mock export - integrate with actual export service
        download_url = f"https://exports.bluelotus.app/{project.id}/code-{project.id[:8]}.zip"
        
        return True, "Code package ready for download", download_url
    
    @staticmethod
    async def export_static_assets(project: Project) -> Tuple[bool, str, Optional[str]]:
        """
        Export static assets only (images, fonts, styles).
        Returns: (success, message, download_url)
        """
        # Mock export - integrate with actual export service
        download_url = f"https://exports.bluelotus.app/{project.id}/assets-{project.id[:8]}.zip"
        
        return True, "Static assets ready for download", download_url
    
    @staticmethod
    async def export(project: Project, export_type: str) -> Tuple[bool, str, Optional[str]]:
        """Route export request to appropriate handler."""
        if export_type == "full_app":
            return await ExportEngine.export_full_app(project)
        elif export_type == "full_website":
            return await ExportEngine.export_full_website(project)
        elif export_type == "code_package":
            return await ExportEngine.export_code_package(project)
        elif export_type == "static_assets":
            return await ExportEngine.export_static_assets(project)
        else:
            return False, "Invalid export type", None
