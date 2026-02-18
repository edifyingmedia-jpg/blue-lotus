# Diagnostics Routes - API endpoints for system diagnostics
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.system_diagnostics_engine import (
    SystemDiagnosticsEngine, DiagnosticCategory, DiagnosticLevel
)

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics"])


class ResolveRequest(BaseModel):
    resolution: str


def create_diagnostics_routes(db: AsyncIOMotorDatabase):
    """Create diagnostics routes with database dependency."""
    
    @router.get("/health")
    async def get_system_health(
        authorization: Optional[str] = Header(None)
    ):
        """Get comprehensive system health report."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        report = await SystemDiagnosticsEngine.check_system_health(db)
        
        return {
            "overall_status": report.overall_status.value,
            "timestamp": report.timestamp.isoformat(),
            "components": {k: v.value for k, v in report.components.items()},
            "diagnostics": [d.model_dump() for d in report.diagnostics],
            "metrics": report.metrics,
            "recommendations": report.recommendations
        }
    
    @router.get("/integrity")
    async def check_data_integrity(
        check_type: str = "quick",
        authorization: Optional[str] = Header(None)
    ):
        """Run a data integrity check."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        if check_type not in ["full", "users", "projects", "quick"]:
            raise HTTPException(status_code=400, detail="Invalid check_type")
        
        result = await SystemDiagnosticsEngine.check_data_integrity(db, check_type)
        
        return {
            "passed": result.passed,
            "check_type": result.check_type,
            "details": result.details,
            "issues_found": result.issues_found,
            "auto_fixed": result.auto_fixed,
            "manual_fixes_needed": result.manual_fixes_needed
        }
    
    @router.get("/logs")
    async def get_diagnostic_logs(
        category: Optional[str] = None,
        level: Optional[str] = None,
        limit: int = 100,
        include_resolved: bool = False,
        authorization: Optional[str] = Header(None)
    ):
        """Get diagnostic logs with optional filtering."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        cat = DiagnosticCategory(category) if category else None
        lvl = DiagnosticLevel(level) if level else None
        
        diagnostics = SystemDiagnosticsEngine.get_diagnostics(
            category=cat,
            level=lvl,
            limit=min(limit, 500),
            include_resolved=include_resolved
        )
        
        return {
            "diagnostics": [d.model_dump() for d in diagnostics],
            "count": len(diagnostics)
        }
    
    @router.get("/errors")
    async def get_recent_errors(
        limit: int = 20,
        authorization: Optional[str] = Header(None)
    ):
        """Get recent error-level diagnostics."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        errors = SystemDiagnosticsEngine.get_recent_errors(min(limit, 100))
        
        return {
            "errors": [e.model_dump() for e in errors],
            "count": len(errors)
        }
    
    @router.post("/resolve/{diagnostic_id}")
    async def resolve_diagnostic(
        diagnostic_id: str,
        request: ResolveRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Mark a diagnostic as resolved."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        success, message = SystemDiagnosticsEngine.resolve_diagnostic(
            diagnostic_id, request.resolution
        )
        
        if not success:
            raise HTTPException(status_code=404, detail=message)
        
        return {"success": True, "message": message}
    
    @router.get("/metrics")
    async def get_metrics(
        metric_name: Optional[str] = None,
        limit: int = 100,
        authorization: Optional[str] = Header(None)
    ):
        """Get performance metrics."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        metrics = SystemDiagnosticsEngine.get_metrics(metric_name, min(limit, 500))
        
        return {"metrics": metrics}
    
    @router.post("/cleanup")
    async def cleanup_old_diagnostics(
        days: int = 30,
        authorization: Optional[str] = Header(None)
    ):
        """Clean up old resolved diagnostics."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        if days < 1 or days > 365:
            raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
        
        cleared = SystemDiagnosticsEngine.clear_old_diagnostics(days)
        
        return {
            "success": True,
            "cleared_count": cleared,
            "message": f"Cleared {cleared} old diagnostic entries"
        }
    
    return router
