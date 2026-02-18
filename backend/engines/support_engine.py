# Support Engine - Support tickets and help articles management
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone
from pydantic import BaseModel
from enum import Enum
import uuid


class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class SupportEngine:
    """
    Support Engine for Owner Dashboard.
    
    Manages:
    - Support tickets
    - Ticket responses
    - Help articles
    - User feedback
    - Issue tracking
    """
    
    @classmethod
    async def get_tickets(
        cls,
        db,
        status: str = None,
        priority: str = None,
        user_id: str = None,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Get support tickets with filtering."""
        query = {}
        if status:
            query["status"] = status
        if priority:
            query["priority"] = priority
        if user_id:
            query["user_id"] = user_id
        
        total = await db.support_tickets.count_documents(query)
        tickets = await db.support_tickets.find(
            query,
            {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return tickets, total
    
    @classmethod
    async def get_ticket(cls, db, ticket_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific ticket with responses."""
        ticket = await db.support_tickets.find_one({"id": ticket_id}, {"_id": 0})
        if not ticket:
            return None
        
        # Get responses
        responses = await db.ticket_responses.find(
            {"ticket_id": ticket_id},
            {"_id": 0}
        ).sort("created_at", 1).to_list(100)
        
        ticket["responses"] = responses
        return ticket
    
    @classmethod
    async def create_ticket(
        cls,
        db,
        user_id: str,
        user_email: str,
        subject: str,
        message: str,
        category: str = "general",
        priority: str = "medium"
    ) -> Tuple[bool, str, Optional[str]]:
        """Create a new support ticket."""
        ticket_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        ticket = {
            "id": ticket_id,
            "user_id": user_id,
            "user_email": user_email,
            "subject": subject,
            "message": message,
            "category": category,
            "priority": priority,
            "status": TicketStatus.OPEN.value,
            "tags": [],
            "created_at": now,
            "updated_at": now,
            "resolved_at": None
        }
        
        await db.support_tickets.insert_one(ticket)
        
        return True, "Ticket created successfully", ticket_id
    
    @classmethod
    async def reply_to_ticket(
        cls,
        db,
        ticket_id: str,
        responder_email: str,
        message: str,
        is_owner: bool = True
    ) -> Tuple[bool, str]:
        """Add a response to a ticket."""
        # Check ticket exists
        ticket = await db.support_tickets.find_one({"id": ticket_id})
        if not ticket:
            return False, "Ticket not found"
        
        response_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        response = {
            "id": response_id,
            "ticket_id": ticket_id,
            "responder_email": responder_email,
            "message": message,
            "is_owner_response": is_owner,
            "created_at": now
        }
        
        await db.ticket_responses.insert_one(response)
        
        # Update ticket status to in_progress if open
        if ticket["status"] == TicketStatus.OPEN.value:
            await db.support_tickets.update_one(
                {"id": ticket_id},
                {"$set": {"status": TicketStatus.IN_PROGRESS.value, "updated_at": now}}
            )
        
        return True, "Response added"
    
    @classmethod
    async def update_ticket_status(
        cls,
        db,
        ticket_id: str,
        status: str
    ) -> Tuple[bool, str]:
        """Update ticket status."""
        now = datetime.now(timezone.utc).isoformat()
        
        update = {"status": status, "updated_at": now}
        if status in [TicketStatus.RESOLVED.value, TicketStatus.CLOSED.value]:
            update["resolved_at"] = now
        
        result = await db.support_tickets.update_one(
            {"id": ticket_id},
            {"$set": update}
        )
        
        if result.modified_count > 0:
            return True, f"Ticket marked as {status}"
        return False, "Ticket not found"
    
    @classmethod
    async def add_ticket_tags(cls, db, ticket_id: str, tags: List[str]) -> Tuple[bool, str]:
        """Add tags to a ticket."""
        result = await db.support_tickets.update_one(
            {"id": ticket_id},
            {"$addToSet": {"tags": {"$each": tags}}}
        )
        
        if result.modified_count > 0:
            return True, "Tags added"
        return False, "Ticket not found or tags already exist"
    
    # Help Articles
    
    @classmethod
    async def get_help_articles(
        cls,
        db,
        category: str = None,
        published_only: bool = True
    ) -> List[Dict[str, Any]]:
        """Get help articles."""
        query = {}
        if category:
            query["category"] = category
        if published_only:
            query["published"] = True
        
        articles = await db.help_articles.find(
            query,
            {"_id": 0}
        ).sort("order", 1).to_list(100)
        
        return articles
    
    @classmethod
    async def get_help_article(cls, db, article_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific help article."""
        return await db.help_articles.find_one({"id": article_id}, {"_id": 0})
    
    @classmethod
    async def create_help_article(
        cls,
        db,
        title: str,
        content: str,
        category: str,
        order: int = 0
    ) -> Tuple[bool, str, Optional[str]]:
        """Create a new help article."""
        article_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        article = {
            "id": article_id,
            "title": title,
            "content": content,
            "category": category,
            "order": order,
            "published": False,
            "views": 0,
            "helpful_count": 0,
            "created_at": now,
            "updated_at": now
        }
        
        await db.help_articles.insert_one(article)
        
        return True, "Article created", article_id
    
    @classmethod
    async def update_help_article(
        cls,
        db,
        article_id: str,
        updates: Dict[str, Any]
    ) -> Tuple[bool, str]:
        """Update a help article."""
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        result = await db.help_articles.update_one(
            {"id": article_id},
            {"$set": updates}
        )
        
        if result.modified_count > 0:
            return True, "Article updated"
        return False, "Article not found"
    
    @classmethod
    async def delete_help_article(cls, db, article_id: str) -> Tuple[bool, str]:
        """Delete a help article."""
        result = await db.help_articles.delete_one({"id": article_id})
        
        if result.deleted_count > 0:
            return True, "Article deleted"
        return False, "Article not found"
    
    # Feedback
    
    @classmethod
    async def get_feedback(
        cls,
        db,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Get user feedback submissions."""
        total = await db.feedback.count_documents({})
        feedback = await db.feedback.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return feedback, total
    
    @classmethod
    async def submit_feedback(
        cls,
        db,
        user_id: str,
        user_email: str,
        feedback_type: str,
        message: str,
        rating: int = None
    ) -> Tuple[bool, str]:
        """Submit user feedback."""
        feedback_id = str(uuid.uuid4())
        
        feedback = {
            "id": feedback_id,
            "user_id": user_id,
            "user_email": user_email,
            "type": feedback_type,
            "message": message,
            "rating": rating,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.feedback.insert_one(feedback)
        
        return True, "Feedback submitted"
    
    @classmethod
    async def get_ticket_stats(cls, db) -> Dict[str, Any]:
        """Get ticket statistics."""
        total = await db.support_tickets.count_documents({})
        open_count = await db.support_tickets.count_documents({"status": "open"})
        in_progress = await db.support_tickets.count_documents({"status": "in_progress"})
        resolved = await db.support_tickets.count_documents({"status": "resolved"})
        
        # By priority
        urgent = await db.support_tickets.count_documents({"priority": "urgent", "status": {"$nin": ["resolved", "closed"]}})
        high = await db.support_tickets.count_documents({"priority": "high", "status": {"$nin": ["resolved", "closed"]}})
        
        return {
            "total": total,
            "open": open_count,
            "in_progress": in_progress,
            "resolved": resolved,
            "urgent_active": urgent,
            "high_priority_active": high
        }
