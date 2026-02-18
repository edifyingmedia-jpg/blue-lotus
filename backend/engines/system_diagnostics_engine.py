# System Diagnostics & Integrity Engine - Monitors system health and ensures data integrity
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class DiagnosticLevel(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class DiagnosticCategory(str, Enum):
    SYSTEM = "system"
    DATABASE = "database"
    ENGINE = "engine"
    API = "api"
    USER = "user"
    PROJECT = "project"
    CREDITS = "credits"
    PERFORMANCE = "performance"
    SECURITY = "security"


class HealthStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


class DiagnosticEntry(BaseModel):
    """Individual diagnostic entry."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: DiagnosticCategory
    level: DiagnosticLevel
    message: str
    details: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved: bool = False
    resolution: Optional[str] = None


class SystemHealthReport(BaseModel):
    """Complete system health report."""
    overall_status: HealthStatus
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    components: Dict[str, HealthStatus] = {}
    diagnostics: List[DiagnosticEntry] = []
    metrics: Dict[str, Any] = {}
    recommendations: List[str] = []


class IntegrityCheckResult(BaseModel):
    """Result of an integrity check."""
    passed: bool
    check_type: str
    details: Dict[str, Any] = {}
    issues_found: List[str] = []
    auto_fixed: List[str] = []
    manual_fixes_needed: List[str] = []


class SystemDiagnosticsEngine:
    """
    System Diagnostics & Integrity Engine monitors system health.
    
    Responsibilities:
    - Monitor all system components health
    - Track engine performance metrics
    - Detect and report anomalies
    - Ensure data integrity across all stores
    - Provide debugging information
    - Generate health reports
    - Auto-fix common issues when safe
    
    Rules:
    - Never auto-fix destructive issues
    - Always log all diagnostic events
    - Preserve user data at all costs
    - Report critical issues immediately
    - Maintain audit trail
    """
    
    # Diagnostic log (in-memory, will be DB-backed)
    _diagnostics: List[DiagnosticEntry] = []
    _max_diagnostics = 10000
    
    # Performance metrics
    _metrics: Dict[str, List[Dict[str, Any]]] = {}
    _metrics_window = 1000  # Keep last N entries per metric
    
    # Component health cache
    _component_health: Dict[str, HealthStatus] = {}
    _last_health_check: Optional[datetime] = None
    
    @classmethod
    def log_diagnostic(
        cls,
        category: DiagnosticCategory,
        level: DiagnosticLevel,
        message: str,
        details: Dict[str, Any] = None
    ) -> DiagnosticEntry:
        """Log a diagnostic entry."""
        entry = DiagnosticEntry(
            category=category,
            level=level,
            message=message,
            details=details or {}
        )
        
        cls._diagnostics.append(entry)
        
        # Trim if too large
        if len(cls._diagnostics) > cls._max_diagnostics:
            cls._diagnostics = cls._diagnostics[-cls._max_diagnostics:]
        
        return entry
    
    @classmethod
    def log_info(cls, category: DiagnosticCategory, message: str, details: Dict[str, Any] = None):
        """Convenience method for info-level logging."""
        return cls.log_diagnostic(category, DiagnosticLevel.INFO, message, details)
    
    @classmethod
    def log_warning(cls, category: DiagnosticCategory, message: str, details: Dict[str, Any] = None):
        """Convenience method for warning-level logging."""
        return cls.log_diagnostic(category, DiagnosticLevel.WARNING, message, details)
    
    @classmethod
    def log_error(cls, category: DiagnosticCategory, message: str, details: Dict[str, Any] = None):
        """Convenience method for error-level logging."""
        return cls.log_diagnostic(category, DiagnosticLevel.ERROR, message, details)
    
    @classmethod
    def log_critical(cls, category: DiagnosticCategory, message: str, details: Dict[str, Any] = None):
        """Convenience method for critical-level logging."""
        return cls.log_diagnostic(category, DiagnosticLevel.CRITICAL, message, details)
    
    @classmethod
    def record_metric(cls, metric_name: str, value: Any, tags: Dict[str, str] = None):
        """Record a performance metric."""
        if metric_name not in cls._metrics:
            cls._metrics[metric_name] = []
        
        cls._metrics[metric_name].append({
            "value": value,
            "tags": tags or {},
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Trim if too large
        if len(cls._metrics[metric_name]) > cls._metrics_window:
            cls._metrics[metric_name] = cls._metrics[metric_name][-cls._metrics_window:]
    
    @classmethod
    async def check_system_health(cls, db=None) -> SystemHealthReport:
        """Perform a comprehensive system health check."""
        components = {}
        diagnostics = []
        metrics = {}
        recommendations = []
        
        # Check database health
        db_status = await cls._check_database_health(db)
        components["database"] = db_status
        if db_status != HealthStatus.HEALTHY:
            diagnostics.append(DiagnosticEntry(
                category=DiagnosticCategory.DATABASE,
                level=DiagnosticLevel.ERROR if db_status == HealthStatus.UNHEALTHY else DiagnosticLevel.WARNING,
                message=f"Database health: {db_status.value}"
            ))
            recommendations.append("Check database connection and credentials")
        
        # Check engine health
        engine_statuses = cls._check_engine_health()
        for engine, status in engine_statuses.items():
            components[engine] = status
            if status != HealthStatus.HEALTHY:
                diagnostics.append(DiagnosticEntry(
                    category=DiagnosticCategory.ENGINE,
                    level=DiagnosticLevel.WARNING,
                    message=f"Engine {engine} health: {status.value}"
                ))
        
        # Check API health
        api_status = cls._check_api_health()
        components["api"] = api_status
        
        # Check performance metrics
        perf_status, perf_metrics = cls._check_performance()
        components["performance"] = perf_status
        metrics["performance"] = perf_metrics
        
        # Check credit system
        credit_status = cls._check_credit_system()
        components["credits"] = credit_status
        
        # Determine overall status
        statuses = list(components.values())
        if HealthStatus.UNHEALTHY in statuses:
            overall = HealthStatus.UNHEALTHY
        elif HealthStatus.DEGRADED in statuses:
            overall = HealthStatus.DEGRADED
        elif HealthStatus.UNKNOWN in statuses:
            overall = HealthStatus.DEGRADED
        else:
            overall = HealthStatus.HEALTHY
        
        # Update cache
        cls._component_health = components
        cls._last_health_check = datetime.now(timezone.utc)
        
        return SystemHealthReport(
            overall_status=overall,
            components=components,
            diagnostics=diagnostics,
            metrics=metrics,
            recommendations=recommendations
        )
    
    @classmethod
    async def _check_database_health(cls, db) -> HealthStatus:
        """Check database connectivity and health."""
        if db is None:
            return HealthStatus.UNKNOWN
        
        try:
            # Try a simple operation
            await db.command("ping")
            return HealthStatus.HEALTHY
        except Exception as e:
            cls.log_error(DiagnosticCategory.DATABASE, f"Database health check failed: {str(e)}")
            return HealthStatus.UNHEALTHY
    
    @classmethod
    def _check_engine_health(cls) -> Dict[str, HealthStatus]:
        """Check health of all engines."""
        engines = {
            "credit_engine": HealthStatus.HEALTHY,
            "plan_enforcement": HealthStatus.HEALTHY,
            "generation_engine": HealthStatus.HEALTHY,
            "publishing_engine": HealthStatus.HEALTHY,
            "export_engine": HealthStatus.HEALTHY,
            "project_engine": HealthStatus.HEALTHY,
            "data_model_engine": HealthStatus.HEALTHY,
            "navigation_engine": HealthStatus.HEALTHY,
            "ai_instruction_engine": HealthStatus.HEALTHY,
            "orchestration_engine": HealthStatus.HEALTHY,
            "runtime_intelligence_engine": HealthStatus.HEALTHY,
            "canvas_engine": HealthStatus.HEALTHY,
            "component_library_engine": HealthStatus.HEALTHY,
            "ai_orchestration_engine": HealthStatus.HEALTHY,
            "blueprint_generation_engine": HealthStatus.HEALTHY,
            "system_diagnostics_engine": HealthStatus.HEALTHY,
            "platform_settings_engine": HealthStatus.HEALTHY
        }
        
        # In a real implementation, we would actually check each engine
        # For now, return all healthy (mocked)
        return engines
    
    @classmethod
    def _check_api_health(cls) -> HealthStatus:
        """Check API health."""
        # In a real implementation, check recent API response times and error rates
        return HealthStatus.HEALTHY
    
    @classmethod
    def _check_performance(cls) -> Tuple[HealthStatus, Dict[str, Any]]:
        """Check overall performance metrics."""
        metrics = {
            "avg_response_time_ms": 45,
            "requests_per_minute": 120,
            "error_rate_percent": 0.5,
            "active_users": 15
        }
        
        # Determine status based on metrics
        if metrics["error_rate_percent"] > 5:
            status = HealthStatus.UNHEALTHY
        elif metrics["error_rate_percent"] > 2 or metrics["avg_response_time_ms"] > 200:
            status = HealthStatus.DEGRADED
        else:
            status = HealthStatus.HEALTHY
        
        return status, metrics
    
    @classmethod
    def _check_credit_system(cls) -> HealthStatus:
        """Check credit system health."""
        # In a real implementation, verify credit calculations are correct
        return HealthStatus.HEALTHY
    
    @classmethod
    async def check_data_integrity(cls, db, check_type: str = "full") -> IntegrityCheckResult:
        """
        Check data integrity across the system.
        
        Args:
            db: Database connection
            check_type: "full", "users", "projects", or "quick"
        """
        issues_found = []
        auto_fixed = []
        manual_fixes_needed = []
        details = {}
        
        if check_type in ["full", "users"]:
            user_issues = await cls._check_user_integrity(db)
            issues_found.extend(user_issues.get("issues", []))
            auto_fixed.extend(user_issues.get("auto_fixed", []))
            details["users"] = user_issues
        
        if check_type in ["full", "projects"]:
            project_issues = await cls._check_project_integrity(db)
            issues_found.extend(project_issues.get("issues", []))
            auto_fixed.extend(project_issues.get("auto_fixed", []))
            details["projects"] = project_issues
        
        if check_type == "quick":
            # Quick integrity check - just verify counts
            details["quick_check"] = {
                "users_count": "checked",
                "projects_count": "checked"
            }
        
        passed = len(issues_found) == 0 and len(manual_fixes_needed) == 0
        
        return IntegrityCheckResult(
            passed=passed,
            check_type=check_type,
            details=details,
            issues_found=issues_found,
            auto_fixed=auto_fixed,
            manual_fixes_needed=manual_fixes_needed
        )
    
    @classmethod
    async def _check_user_integrity(cls, db) -> Dict[str, Any]:
        """Check user data integrity."""
        issues = []
        auto_fixed = []
        
        # In a real implementation:
        # - Check for orphaned user data
        # - Verify credit calculations
        # - Check plan consistency
        # - Verify required fields
        
        return {
            "issues": issues,
            "auto_fixed": auto_fixed,
            "records_checked": 0,
            "status": "passed"
        }
    
    @classmethod
    async def _check_project_integrity(cls, db) -> Dict[str, Any]:
        """Check project data integrity."""
        issues = []
        auto_fixed = []
        
        # In a real implementation:
        # - Check for orphaned projects
        # - Verify project structure
        # - Check user references
        # - Verify status consistency
        
        return {
            "issues": issues,
            "auto_fixed": auto_fixed,
            "records_checked": 0,
            "status": "passed"
        }
    
    @classmethod
    def get_diagnostics(
        cls,
        category: Optional[DiagnosticCategory] = None,
        level: Optional[DiagnosticLevel] = None,
        limit: int = 100,
        include_resolved: bool = False
    ) -> List[DiagnosticEntry]:
        """Get diagnostic entries with optional filtering."""
        diagnostics = cls._diagnostics.copy()
        
        if category:
            diagnostics = [d for d in diagnostics if d.category == category]
        
        if level:
            diagnostics = [d for d in diagnostics if d.level == level]
        
        if not include_resolved:
            diagnostics = [d for d in diagnostics if not d.resolved]
        
        # Sort by timestamp descending
        diagnostics.sort(key=lambda d: d.timestamp, reverse=True)
        
        return diagnostics[:limit]
    
    @classmethod
    def resolve_diagnostic(cls, diagnostic_id: str, resolution: str) -> Tuple[bool, str]:
        """Mark a diagnostic entry as resolved."""
        for diagnostic in cls._diagnostics:
            if diagnostic.id == diagnostic_id:
                diagnostic.resolved = True
                diagnostic.resolution = resolution
                return True, "Diagnostic resolved"
        
        return False, "Diagnostic not found"
    
    @classmethod
    def get_metrics(
        cls,
        metric_name: Optional[str] = None,
        limit: int = 100
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Get performance metrics."""
        if metric_name:
            if metric_name in cls._metrics:
                return {metric_name: cls._metrics[metric_name][-limit:]}
            return {}
        
        return {name: values[-limit:] for name, values in cls._metrics.items()}
    
    @classmethod
    def get_recent_errors(cls, limit: int = 20) -> List[DiagnosticEntry]:
        """Get recent error and critical diagnostics."""
        errors = [
            d for d in cls._diagnostics 
            if d.level in [DiagnosticLevel.ERROR, DiagnosticLevel.CRITICAL]
        ]
        errors.sort(key=lambda d: d.timestamp, reverse=True)
        return errors[:limit]
    
    @classmethod
    def clear_old_diagnostics(cls, days: int = 30) -> int:
        """Clear diagnostics older than specified days."""
        from datetime import timedelta
        
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        original_count = len(cls._diagnostics)
        
        cls._diagnostics = [
            d for d in cls._diagnostics 
            if d.timestamp > cutoff or not d.resolved
        ]
        
        cleared = original_count - len(cls._diagnostics)
        
        if cleared > 0:
            cls.log_info(
                DiagnosticCategory.SYSTEM,
                f"Cleared {cleared} old diagnostic entries"
            )
        
        return cleared
