# Analytics Engine - Platform analytics and metrics tracking
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel


class AnalyticsEngine:
    """
    Analytics Engine for Owner Dashboard.
    
    Tracks:
    - AI generation volume
    - Voice usage
    - User retention & churn
    - Project creation funnels
    - Error logs
    - Backend latency
    """
    
    @classmethod
    async def get_ai_usage_stats(cls, db, days: int = 30) -> Dict[str, Any]:
        """Get AI generation usage statistics."""
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Daily AI generations
        daily_usage = await db.generation_logs.aggregate([
            {"$match": {"created_at": {"$gte": start_date.isoformat()}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$created_at"}}},
                "count": {"$sum": 1},
                "credits_used": {"$sum": "$credits_used"}
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(days)
        
        # Total stats
        total = await db.generation_logs.count_documents({})
        recent = await db.generation_logs.count_documents({"created_at": {"$gte": start_date.isoformat()}})
        
        # By type breakdown
        by_type = await db.generation_logs.aggregate([
            {"$group": {"_id": "$type", "count": {"$sum": 1}}}
        ]).to_list(10)
        
        return {
            "total_generations": total,
            "recent_generations": recent,
            "daily_usage": daily_usage,
            "by_type": {item["_id"]: item["count"] for item in by_type if item["_id"]},
            "period_days": days
        }
    
    @classmethod
    async def get_voice_usage_stats(cls, db, days: int = 30) -> Dict[str, Any]:
        """Get voice feature usage statistics."""
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Voice sessions
        daily_voice = await db.voice_sessions.aggregate([
            {"$match": {"created_at": {"$gte": start_date.isoformat()}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$created_at"}}},
                "sessions": {"$sum": 1},
                "commands": {"$sum": "$command_count"}
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(days)
        
        total_sessions = await db.voice_sessions.count_documents({})
        
        return {
            "total_sessions": total_sessions,
            "daily_usage": daily_voice,
            "period_days": days
        }
    
    @classmethod
    async def get_user_retention(cls, db, days: int = 30) -> Dict[str, Any]:
        """Calculate user retention and churn metrics."""
        now = datetime.now(timezone.utc)
        
        # Users created in different periods
        day_1 = now - timedelta(days=1)
        day_7 = now - timedelta(days=7)
        day_30 = now - timedelta(days=30)
        
        new_users_30d = await db.users.count_documents({"created_at": {"$gte": day_30.isoformat()}})
        new_users_7d = await db.users.count_documents({"created_at": {"$gte": day_7.isoformat()}})
        new_users_1d = await db.users.count_documents({"created_at": {"$gte": day_1.isoformat()}})
        
        # Active users (users who logged in)
        active_7d = await db.users.count_documents({"last_active": {"$gte": day_7.isoformat()}})
        active_30d = await db.users.count_documents({"last_active": {"$gte": day_30.isoformat()}})
        
        total_users = await db.users.count_documents({})
        
        # Calculate rates
        retention_7d = (active_7d / total_users * 100) if total_users > 0 else 0
        retention_30d = (active_30d / total_users * 100) if total_users > 0 else 0
        
        # Churned = inactive for 30+ days
        churned = total_users - active_30d
        churn_rate = (churned / total_users * 100) if total_users > 0 else 0
        
        return {
            "total_users": total_users,
            "new_users_1d": new_users_1d,
            "new_users_7d": new_users_7d,
            "new_users_30d": new_users_30d,
            "active_users_7d": active_7d,
            "active_users_30d": active_30d,
            "retention_rate_7d": round(retention_7d, 2),
            "retention_rate_30d": round(retention_30d, 2),
            "churned_users": churned,
            "churn_rate": round(churn_rate, 2)
        }
    
    @classmethod
    async def get_project_funnel(cls, db) -> Dict[str, Any]:
        """Get project creation funnel metrics."""
        total_users = await db.users.count_documents({})
        users_with_projects = await db.projects.distinct("user_id")
        
        # Project status breakdown
        status_counts = await db.projects.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]).to_list(10)
        
        total_projects = await db.projects.count_documents({})
        draft = await db.projects.count_documents({"status": "draft"})
        building = await db.projects.count_documents({"status": "building"})
        staged = await db.projects.count_documents({"status": "staged"})
        published = await db.projects.count_documents({"status": "published"})
        
        return {
            "total_users": total_users,
            "users_with_projects": len(users_with_projects),
            "conversion_to_project": round(len(users_with_projects) / total_users * 100, 2) if total_users > 0 else 0,
            "total_projects": total_projects,
            "funnel": {
                "draft": draft,
                "building": building,
                "staged": staged,
                "published": published
            },
            "publish_rate": round(published / total_projects * 100, 2) if total_projects > 0 else 0
        }
    
    @classmethod
    async def get_error_logs(cls, db, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent error logs."""
        errors = await db.error_logs.find(
            {},
            {"_id": 0}
        ).sort("timestamp", -1).limit(limit).to_list(limit)
        
        return errors
    
    @classmethod
    async def log_error(cls, db, error_type: str, message: str, details: Dict = None):
        """Log an error to the database."""
        await db.error_logs.insert_one({
            "type": error_type,
            "message": message,
            "details": details or {},
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    
    @classmethod
    async def get_daily_signups(cls, db, days: int = 30) -> List[Dict[str, Any]]:
        """Get daily signup counts."""
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        signups = await db.users.aggregate([
            {"$match": {"created_at": {"$gte": start_date.isoformat()}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$created_at"}}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]).to_list(days)
        
        return signups
