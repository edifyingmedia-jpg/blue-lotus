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
    
    return router
