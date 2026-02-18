# Admin Engine - Owner Dashboard operations
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta
from enum import Enum
import uuid


class AdminStats(BaseModel):
    """Platform-wide statistics."""
    total_users: int = 0
    active_users_today: int = 0
    total_projects: int = 0
    active_sessions: int = 0
    total_credits_used: int = 0
    total_revenue: float = 0.0
    ai_generations_today: int = 0
    system_status: str = "healthy"


class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"


class AdminUserView(BaseModel):
    """Admin view of a user."""
    id: str
    email: str
    name: str
    role: str = "user"
    plan: str = "free"
    status: UserStatus = UserStatus.ACTIVE
    credits_used: int = 0
    projects_count: int = 0
    created_at: datetime
    last_active: Optional[datetime] = None


class AdminProjectView(BaseModel):
    """Admin view of a project."""
    id: str
    user_id: str
    user_email: str
    name: str
    status: str = "draft"
    type: str = "app"
    created_at: datetime
    updated_at: datetime


class AdminEngine:
    """
    Admin Engine for Owner Dashboard.
    
    Responsibilities:
    - Platform-wide statistics
    - User management (view, suspend, delete)
    - Project management (view, archive, delete)
    - System health monitoring
    - Analytics and reporting
    """
    
    @classmethod
    async def get_platform_stats(cls, db) -> AdminStats:
        """Get platform-wide statistics."""
        # Count users
        total_users = await db.users.count_documents({})
        
        # Active users today (users who logged in today)
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        active_today = await db.users.count_documents({
            "last_active": {"$gte": today_start.isoformat()}
        })
        
        # Count projects
        total_projects = await db.projects.count_documents({})
        
        # Count active sessions (users with tokens in last hour)
        hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
        active_sessions = await db.users.count_documents({
            "last_active": {"$gte": hour_ago.isoformat()}
        })
        
        # Calculate total credits used (sum from all users)
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$credits_used_total"}}}
        ]
        credits_result = await db.users.aggregate(pipeline).to_list(1)
        total_credits = credits_result[0]["total"] if credits_result else 0
        
        # Total revenue from transactions
        revenue_pipeline = [
            {"$match": {"status": "paid"}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        revenue_result = await db.payment_transactions.aggregate(revenue_pipeline).to_list(1)
        total_revenue = revenue_result[0]["total"] if revenue_result else 0.0
        
        # AI generations today
        ai_generations = await db.generation_logs.count_documents({
            "created_at": {"$gte": today_start.isoformat()}
        })
        
        return AdminStats(
            total_users=total_users,
            active_users_today=active_today,
            total_projects=total_projects,
            active_sessions=active_sessions,
            total_credits_used=total_credits,
            total_revenue=total_revenue,
            ai_generations_today=ai_generations,
            system_status="healthy"
        )
    
    @classmethod
    async def get_all_users(
        cls, 
        db, 
        skip: int = 0, 
        limit: int = 50,
        search: Optional[str] = None,
        role_filter: Optional[str] = None,
        plan_filter: Optional[str] = None
    ) -> Tuple[List[AdminUserView], int]:
        """Get all users with pagination and filtering."""
        query = {}
        
        if search:
            query["$or"] = [
                {"email": {"$regex": search, "$options": "i"}},
                {"name": {"$regex": search, "$options": "i"}}
            ]
        
        if role_filter:
            query["role"] = role_filter
        
        if plan_filter:
            query["plan"] = plan_filter
        
        # Get total count
        total = await db.users.count_documents(query)
        
        # Get users with project counts
        cursor = db.users.find(query, {"_id": 0, "password_hash": 0}).skip(skip).limit(limit)
        users = await cursor.to_list(limit)
        
        user_views = []
        for user in users:
            # Count projects for this user
            project_count = await db.projects.count_documents({"user_id": user["id"]})
            
            user_views.append(AdminUserView(
                id=user["id"],
                email=user["email"],
                name=user["name"],
                role=user.get("role", "user"),
                plan=user.get("plan", "free"),
                status=UserStatus(user.get("status", "active")),
                credits_used=user.get("credits_used_total", 0),
                projects_count=project_count,
                created_at=user.get("created_at", datetime.now(timezone.utc)),
                last_active=user.get("last_active")
            ))
        
        return user_views, total
    
    @classmethod
    async def get_user_details(cls, db, user_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed user information for admin."""
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
        if not user:
            return None
        
        # Get user's projects
        projects = await db.projects.find(
            {"user_id": user_id}, 
            {"_id": 0}
        ).to_list(100)
        
        # Get user's transactions
        transactions = await db.payment_transactions.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("created_at", -1).limit(20).to_list(20)
        
        # Get activity logs
        activity = await db.activity_logs.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("timestamp", -1).limit(50).to_list(50)
        
        return {
            "user": user,
            "projects": projects,
            "transactions": transactions,
            "activity": activity
        }
    
    @classmethod
    async def update_user_role(cls, db, user_id: str, new_role: str) -> Tuple[bool, str]:
        """Update a user's role."""
        valid_roles = ["user", "admin", "owner"]
        if new_role not in valid_roles:
            return False, f"Invalid role. Must be one of: {valid_roles}"
        
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": {"role": new_role, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        if result.modified_count > 0:
            return True, f"User role updated to {new_role}"
        return False, "User not found or role unchanged"
    
    @classmethod
    async def suspend_user(cls, db, user_id: str, reason: str = "") -> Tuple[bool, str]:
        """Suspend a user account."""
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": {
                "status": "suspended",
                "suspended_at": datetime.now(timezone.utc).isoformat(),
                "suspension_reason": reason,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        if result.modified_count > 0:
            return True, "User suspended successfully"
        return False, "User not found"
    
    @classmethod
    async def reactivate_user(cls, db, user_id: str) -> Tuple[bool, str]:
        """Reactivate a suspended user."""
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": {
                "status": "active",
                "suspended_at": None,
                "suspension_reason": None,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        if result.modified_count > 0:
            return True, "User reactivated successfully"
        return False, "User not found"
    
    @classmethod
    async def delete_user(cls, db, user_id: str, soft_delete: bool = True) -> Tuple[bool, str]:
        """Delete a user account."""
        if soft_delete:
            result = await db.users.update_one(
                {"id": user_id},
                {"$set": {
                    "status": "deleted",
                    "deleted_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        else:
            # Hard delete - also remove projects
            await db.projects.delete_many({"user_id": user_id})
            result = await db.users.delete_one({"id": user_id})
        
        if result.modified_count > 0 or result.deleted_count > 0:
            return True, "User deleted successfully"
        return False, "User not found"
    
    @classmethod
    async def get_all_projects(
        cls,
        db,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Tuple[List[AdminProjectView], int]:
        """Get all projects with pagination and filtering."""
        query = {}
        
        if search:
            query["name"] = {"$regex": search, "$options": "i"}
        
        if status_filter:
            query["status"] = status_filter
        
        if user_id:
            query["user_id"] = user_id
        
        total = await db.projects.count_documents(query)
        
        # Get projects with user info
        cursor = db.projects.find(query, {"_id": 0}).skip(skip).limit(limit).sort("updated_at", -1)
        projects = await cursor.to_list(limit)
        
        project_views = []
        for project in projects:
            # Get user email
            user = await db.users.find_one({"id": project["user_id"]}, {"email": 1})
            user_email = user["email"] if user else "Unknown"
            
            project_views.append(AdminProjectView(
                id=project["id"],
                user_id=project["user_id"],
                user_email=user_email,
                name=project["name"],
                status=project.get("status", "draft"),
                type=project.get("type", "app"),
                created_at=project.get("created_at", datetime.now(timezone.utc)),
                updated_at=project.get("updated_at", datetime.now(timezone.utc))
            ))
        
        return project_views, total
    
    @classmethod
    async def archive_project(cls, db, project_id: str) -> Tuple[bool, str]:
        """Archive a project."""
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": {
                "status": "archived",
                "archived_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        if result.modified_count > 0:
            return True, "Project archived successfully"
        return False, "Project not found"
    
    @classmethod
    async def delete_project(cls, db, project_id: str) -> Tuple[bool, str]:
        """Delete a project."""
        result = await db.projects.delete_one({"id": project_id})
        
        if result.deleted_count > 0:
            return True, "Project deleted successfully"
        return False, "Project not found"
    
    @classmethod
    async def get_billing_overview(cls, db) -> Dict[str, Any]:
        """Get billing overview for admin dashboard."""
        # Revenue by plan
        plan_revenue = await db.payment_transactions.aggregate([
            {"$match": {"status": "paid", "payment_type": "subscription"}},
            {"$group": {"_id": "$plan", "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}
        ]).to_list(10)
        
        # Credit purchases
        credit_revenue = await db.payment_transactions.aggregate([
            {"$match": {"status": "paid", "payment_type": "credit_purchase"}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}
        ]).to_list(1)
        
        # Users by plan
        users_by_plan = await db.users.aggregate([
            {"$group": {"_id": "$plan", "count": {"$sum": 1}}}
        ]).to_list(10)
        
        # Recent transactions
        recent_transactions = await db.payment_transactions.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1).limit(10).to_list(10)
        
        return {
            "revenue_by_plan": {item["_id"]: {"revenue": item["total"], "count": item["count"]} for item in plan_revenue},
            "credit_purchases": credit_revenue[0] if credit_revenue else {"total": 0, "count": 0},
            "users_by_plan": {item["_id"]: item["count"] for item in users_by_plan},
            "recent_transactions": recent_transactions
        }
    
    @classmethod
    async def get_analytics(cls, db, days: int = 30) -> Dict[str, Any]:
        """Get platform analytics."""
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Daily signups
        signups = await db.users.aggregate([
            {"$match": {"created_at": {"$gte": start_date.isoformat()}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$created_at"}}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(days)
        
        # Daily projects created
        projects_created = await db.projects.aggregate([
            {"$match": {"created_at": {"$gte": start_date.isoformat()}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$created_at"}}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(days)
        
        # AI generations
        ai_usage = await db.generation_logs.aggregate([
            {"$match": {"created_at": {"$gte": start_date.isoformat()}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$created_at"}}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(days)
        
        return {
            "period_days": days,
            "daily_signups": signups,
            "daily_projects": projects_created,
            "daily_ai_usage": ai_usage
        }
