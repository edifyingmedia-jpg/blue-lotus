# Admin Routes - Owner Dashboard API endpoints
from fastapi import APIRouter, HTTPException, Header, Query
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime, timezone
import os

from routes.auth import get_current_user
from engines.admin_engine import AdminEngine, AdminStats, AdminUserView, AdminProjectView


class UpdateRoleRequest(BaseModel):
    role: str


class SuspendUserRequest(BaseModel):
    reason: str = ""


class UpdateUserPlanRequest(BaseModel):
    plan: str


# Owner emails that have access to admin dashboard
OWNER_EMAILS = os.getenv("OWNER_EMAILS", "admin@bluelotus.ai").split(",")


def create_admin_routes(db):
    """Create admin API routes for Owner Dashboard."""
    router = APIRouter(prefix="/admin", tags=["Admin"])
    
    async def verify_owner_access(authorization: str):
        """Verify user has owner-only access (admins cannot access)."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check if user is owner ONLY (admins cannot access)
        user_doc = await db.users.find_one({"id": user.id}, {"role": 1, "email": 1, "_id": 0})
        user_role = user_doc.get("role", "user") if user_doc else "user"
        user_email = user_doc.get("email", "") if user_doc else ""
        
        # Only allow owner role OR email in OWNER_EMAILS list
        if user_role != "owner" and user_email not in OWNER_EMAILS:
            raise HTTPException(status_code=403, detail="Access denied. Owner privileges required.")
        
        return user
    
    # ============ Dashboard Overview ============
    
    @router.get("/stats")
    async def get_platform_stats(authorization: Optional[str] = Header(None)):
        """Get platform-wide statistics for dashboard overview."""
        await verify_owner_access(authorization)
        stats = await AdminEngine.get_platform_stats(db)
        return stats.model_dump()
    
    @router.get("/health")
    async def get_system_health(authorization: Optional[str] = Header(None)):
        """Get system health status."""
        await verify_owner_access(authorization)
        
        # Check database
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            await db.command("ping")
            db_status = "healthy"
        except Exception as e:
            db_status = f"error: {str(e)}"
        
        return {
            "database": db_status,
            "api": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    # ============ User Management ============
    
    @router.get("/users")
    async def list_users(
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=100),
        search: Optional[str] = None,
        role: Optional[str] = None,
        plan: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """List all users with pagination and filtering."""
        await verify_owner_access(authorization)
        
        users, total = await AdminEngine.get_all_users(
            db, skip=skip, limit=limit, 
            search=search, role_filter=role, plan_filter=plan
        )
        
        return {
            "users": [u.model_dump() for u in users],
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    @router.get("/users/{user_id}")
    async def get_user_details(
        user_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get detailed information about a specific user."""
        await verify_owner_access(authorization)
        
        details = await AdminEngine.get_user_details(db, user_id)
        if not details:
            raise HTTPException(status_code=404, detail="User not found")
        
        return details
    
    @router.put("/users/{user_id}/role")
    async def update_user_role(
        user_id: str,
        request: UpdateRoleRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update a user's role."""
        await verify_owner_access(authorization)
        
        success, message = await AdminEngine.update_user_role(db, user_id, request.role)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    @router.put("/users/{user_id}/plan")
    async def update_user_plan(
        user_id: str,
        request: UpdateUserPlanRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update a user's plan (admin override)."""
        await verify_owner_access(authorization)
        
        valid_plans = ["free", "creator", "pro", "elite"]
        if request.plan not in valid_plans:
            raise HTTPException(status_code=400, detail=f"Invalid plan. Must be one of: {valid_plans}")
        
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": {"plan": request.plan, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        if result.modified_count > 0:
            return {"success": True, "message": f"User plan updated to {request.plan}"}
        raise HTTPException(status_code=404, detail="User not found")
    
    @router.post("/users/{user_id}/suspend")
    async def suspend_user(
        user_id: str,
        request: SuspendUserRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Suspend a user account."""
        await verify_owner_access(authorization)
        
        success, message = await AdminEngine.suspend_user(db, user_id, request.reason)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    @router.post("/users/{user_id}/reactivate")
    async def reactivate_user(
        user_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Reactivate a suspended user."""
        await verify_owner_access(authorization)
        
        success, message = await AdminEngine.reactivate_user(db, user_id)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    @router.delete("/users/{user_id}")
    async def delete_user(
        user_id: str,
        hard_delete: bool = False,
        authorization: Optional[str] = Header(None)
    ):
        """Delete a user account."""
        await verify_owner_access(authorization)
        
        success, message = await AdminEngine.delete_user(db, user_id, soft_delete=not hard_delete)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    # ============ Project Management ============
    
    @router.get("/projects")
    async def list_projects(
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=100),
        search: Optional[str] = None,
        status: Optional[str] = None,
        user_id: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """List all projects with pagination and filtering."""
        await verify_owner_access(authorization)
        
        projects, total = await AdminEngine.get_all_projects(
            db, skip=skip, limit=limit,
            search=search, status_filter=status, user_id=user_id
        )
        
        return {
            "projects": [p.model_dump() for p in projects],
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    @router.post("/projects/{project_id}/archive")
    async def archive_project(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Archive a project."""
        await verify_owner_access(authorization)
        
        success, message = await AdminEngine.archive_project(db, project_id)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    @router.delete("/projects/{project_id}")
    async def delete_project(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Delete a project."""
        await verify_owner_access(authorization)
        
        success, message = await AdminEngine.delete_project(db, project_id)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    # ============ Billing & Analytics ============
    
    @router.get("/billing/overview")
    async def get_billing_overview(authorization: Optional[str] = Header(None)):
        """Get billing overview including revenue and subscriptions."""
        await verify_owner_access(authorization)
        
        overview = await AdminEngine.get_billing_overview(db)
        return overview
    
    @router.get("/analytics")
    async def get_analytics(
        days: int = Query(30, ge=1, le=365),
        authorization: Optional[str] = Header(None)
    ):
        """Get platform analytics for the specified period."""
        await verify_owner_access(authorization)
        
        analytics = await AdminEngine.get_analytics(db, days=days)
        return analytics
    
    # ============ Transactions ============
    
    @router.get("/transactions")
    async def list_transactions(
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=100),
        status: Optional[str] = None,
        user_id: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """List all payment transactions."""
        await verify_owner_access(authorization)
        
        query = {}
        if status:
            query["status"] = status
        if user_id:
            query["user_id"] = user_id
        
        total = await db.payment_transactions.count_documents(query)
        transactions = await db.payment_transactions.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return {
            "transactions": transactions,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    @router.post("/transactions/{transaction_id}/refund")
    async def refund_transaction(
        transaction_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Process a refund for a transaction."""
        await verify_owner_access(authorization)
        
        # Update transaction status
        result = await db.payment_transactions.update_one(
            {"transaction_id": transaction_id},
            {"$set": {
                "status": "refunded",
                "refunded_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        if result.modified_count > 0:
            return {"success": True, "message": "Transaction refunded"}
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # ============ Analytics ============
    
    @router.get("/analytics/ai-usage")
    async def get_ai_usage(
        days: int = Query(30, ge=1, le=365),
        authorization: Optional[str] = Header(None)
    ):
        """Get AI generation usage statistics."""
        await verify_owner_access(authorization)
        from engines.analytics_engine import AnalyticsEngine
        return await AnalyticsEngine.get_ai_usage_stats(db, days=days)
    
    @router.get("/analytics/voice-usage")
    async def get_voice_usage(
        days: int = Query(30, ge=1, le=365),
        authorization: Optional[str] = Header(None)
    ):
        """Get voice feature usage statistics."""
        await verify_owner_access(authorization)
        from engines.analytics_engine import AnalyticsEngine
        return await AnalyticsEngine.get_voice_usage_stats(db, days=days)
    
    @router.get("/analytics/retention")
    async def get_retention(authorization: Optional[str] = Header(None)):
        """Get user retention and churn metrics."""
        await verify_owner_access(authorization)
        from engines.analytics_engine import AnalyticsEngine
        return await AnalyticsEngine.get_user_retention(db)
    
    @router.get("/analytics/project-funnel")
    async def get_project_funnel(authorization: Optional[str] = Header(None)):
        """Get project creation funnel metrics."""
        await verify_owner_access(authorization)
        from engines.analytics_engine import AnalyticsEngine
        return await AnalyticsEngine.get_project_funnel(db)
    
    @router.get("/analytics/errors")
    async def get_error_logs(
        limit: int = Query(50, ge=1, le=200),
        authorization: Optional[str] = Header(None)
    ):
        """Get recent error logs."""
        await verify_owner_access(authorization)
        from engines.analytics_engine import AnalyticsEngine
        return {"errors": await AnalyticsEngine.get_error_logs(db, limit=limit)}
    
    @router.get("/analytics/signups")
    async def get_daily_signups(
        days: int = Query(30, ge=1, le=365),
        authorization: Optional[str] = Header(None)
    ):
        """Get daily signup counts."""
        await verify_owner_access(authorization)
        from engines.analytics_engine import AnalyticsEngine
        return {"signups": await AnalyticsEngine.get_daily_signups(db, days=days)}
    
    # ============ System Settings ============
    
    @router.get("/settings/branding")
    async def get_branding(authorization: Optional[str] = Header(None)):
        """Get branding settings."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        return await SystemSettingsEngine.get_branding(db)
    
    @router.put("/settings/branding")
    async def update_branding(
        branding: Dict[str, Any],
        authorization: Optional[str] = Header(None)
    ):
        """Update branding settings."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        success, message = await SystemSettingsEngine.update_branding(db, branding)
        return {"success": success, "message": message}
    
    @router.get("/settings/features")
    async def get_feature_flags(authorization: Optional[str] = Header(None)):
        """Get feature flags."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        return {"features": await SystemSettingsEngine.get_feature_flags(db)}
    
    @router.put("/settings/features/{feature_key}")
    async def toggle_feature(
        feature_key: str,
        enabled: bool,
        authorization: Optional[str] = Header(None)
    ):
        """Toggle a feature flag."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        success, message = await SystemSettingsEngine.toggle_feature(db, feature_key, enabled)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message}
    
    @router.get("/settings/limits")
    async def get_global_limits(authorization: Optional[str] = Header(None)):
        """Get global limits."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        return {"limits": await SystemSettingsEngine.get_global_limits(db)}
    
    @router.put("/settings/limits/{limit_key}")
    async def set_global_limit(
        limit_key: str,
        value: int,
        authorization: Optional[str] = Header(None)
    ):
        """Set a global limit value."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        success, message = await SystemSettingsEngine.set_global_limit(db, limit_key, value)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message}
    
    @router.get("/settings/email-templates")
    async def get_email_templates(authorization: Optional[str] = Header(None)):
        """Get email templates."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        return {"templates": await SystemSettingsEngine.get_email_templates(db)}
    
    @router.put("/settings/email-templates/{template_key}")
    async def update_email_template(
        template_key: str,
        updates: Dict[str, Any],
        authorization: Optional[str] = Header(None)
    ):
        """Update an email template."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        success, message = await SystemSettingsEngine.update_email_template(db, template_key, updates)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message}
    
    @router.get("/settings/notifications")
    async def get_notification_settings(authorization: Optional[str] = Header(None)):
        """Get notification settings."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        return await SystemSettingsEngine.get_notification_settings(db)
    
    @router.put("/settings/notifications")
    async def update_notification_settings(
        settings: Dict[str, Any],
        authorization: Optional[str] = Header(None)
    ):
        """Update notification settings."""
        await verify_owner_access(authorization)
        from engines.system_settings_engine import SystemSettingsEngine
        success, message = await SystemSettingsEngine.update_notification_settings(db, settings)
        return {"success": success, "message": message}
    
    # ============ Compliance ============
    
    @router.get("/compliance/documents")
    async def get_legal_documents(authorization: Optional[str] = Header(None)):
        """Get all legal documents."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        return {"documents": await ComplianceEngine.get_all_documents(db)}
    
    @router.get("/compliance/documents/{doc_type}")
    async def get_legal_document(
        doc_type: str,
        version: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """Get a specific legal document."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        doc = await ComplianceEngine.get_document(db, doc_type, version)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        return doc
    
    @router.post("/compliance/documents")
    async def create_legal_document(
        doc_type: str,
        title: str,
        content: str,
        version: str,
        authorization: Optional[str] = Header(None)
    ):
        """Create a new legal document version."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        success, message, doc_id = await ComplianceEngine.create_document(db, doc_type, title, content, version)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message, "id": doc_id}
    
    @router.get("/compliance/documents/{doc_type}/versions")
    async def get_document_versions(
        doc_type: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get all versions of a document type."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        return {"versions": await ComplianceEngine.get_document_versions(db, doc_type)}
    
    @router.get("/compliance/consents")
    async def get_consent_logs(
        user_id: Optional[str] = None,
        document_type: Optional[str] = None,
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=200),
        authorization: Optional[str] = Header(None)
    ):
        """Get consent logs."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        logs, total = await ComplianceEngine.get_consent_logs(db, user_id, document_type, skip, limit)
        return {"logs": logs, "total": total}
    
    @router.get("/compliance/third-party")
    async def get_third_party_services(authorization: Optional[str] = Header(None)):
        """Get third-party services documentation."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        return {"services": await ComplianceEngine.get_third_party_services(db)}
    
    @router.put("/compliance/third-party")
    async def update_third_party_services(
        services: List[Dict[str, Any]],
        authorization: Optional[str] = Header(None)
    ):
        """Update third-party services documentation."""
        await verify_owner_access(authorization)
        from engines.compliance_engine import ComplianceEngine
        success, message = await ComplianceEngine.update_third_party_services(db, services)
        return {"success": success, "message": message}
    
    # ============ Support ============
    
    @router.get("/support/tickets")
    async def get_support_tickets(
        status: Optional[str] = None,
        priority: Optional[str] = None,
        user_id: Optional[str] = None,
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=100),
        authorization: Optional[str] = Header(None)
    ):
        """Get support tickets."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        tickets, total = await SupportEngine.get_tickets(db, status, priority, user_id, skip, limit)
        return {"tickets": tickets, "total": total, "skip": skip, "limit": limit}
    
    @router.get("/support/tickets/stats")
    async def get_ticket_stats(authorization: Optional[str] = Header(None)):
        """Get ticket statistics."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        return await SupportEngine.get_ticket_stats(db)
    
    @router.get("/support/tickets/{ticket_id}")
    async def get_support_ticket(
        ticket_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get a specific ticket with responses."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        ticket = await SupportEngine.get_ticket(db, ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return ticket
    
    @router.post("/support/tickets/{ticket_id}/reply")
    async def reply_to_ticket(
        ticket_id: str,
        message: str,
        authorization: Optional[str] = Header(None)
    ):
        """Reply to a support ticket."""
        owner = await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        user_doc = await db.users.find_one({"id": owner.id}, {"email": 1, "_id": 0})
        success, msg = await SupportEngine.reply_to_ticket(db, ticket_id, user_doc["email"], message, is_owner=True)
        if not success:
            raise HTTPException(status_code=400, detail=msg)
        return {"success": success, "message": msg}
    
    @router.put("/support/tickets/{ticket_id}/status")
    async def update_ticket_status(
        ticket_id: str,
        status: str,
        authorization: Optional[str] = Header(None)
    ):
        """Update ticket status."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        success, message = await SupportEngine.update_ticket_status(db, ticket_id, status)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message}
    
    @router.get("/support/articles")
    async def get_help_articles(
        category: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """Get help articles."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        return {"articles": await SupportEngine.get_help_articles(db, category, published_only=False)}
    
    @router.post("/support/articles")
    async def create_help_article(
        title: str,
        content: str,
        category: str,
        order: int = 0,
        authorization: Optional[str] = Header(None)
    ):
        """Create a help article."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        success, message, article_id = await SupportEngine.create_help_article(db, title, content, category, order)
        return {"success": success, "message": message, "id": article_id}
    
    @router.put("/support/articles/{article_id}")
    async def update_help_article(
        article_id: str,
        updates: Dict[str, Any],
        authorization: Optional[str] = Header(None)
    ):
        """Update a help article."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        success, message = await SupportEngine.update_help_article(db, article_id, updates)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message}
    
    @router.delete("/support/articles/{article_id}")
    async def delete_help_article(
        article_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Delete a help article."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        success, message = await SupportEngine.delete_help_article(db, article_id)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"success": success, "message": message}
    
    @router.get("/support/feedback")
    async def get_feedback(
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=200),
        authorization: Optional[str] = Header(None)
    ):
        """Get user feedback."""
        await verify_owner_access(authorization)
        from engines.support_engine import SupportEngine
        feedback, total = await SupportEngine.get_feedback(db, skip, limit)
        return {"feedback": feedback, "total": total}
    
    return router
