# Compliance Engine - Legal documents and consent management
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone
from pydantic import BaseModel
import uuid


class LegalDocument(BaseModel):
    """A legal document."""
    id: str
    type: str  # terms, privacy, cookie, acceptable_use
    title: str
    content: str
    version: str
    effective_date: str
    is_active: bool = True
    created_at: str
    updated_at: str


class ConsentLog(BaseModel):
    """A user consent record."""
    id: str
    user_id: str
    user_email: str
    document_type: str
    document_version: str
    consented: bool
    ip_address: str = ""
    timestamp: str


class ComplianceEngine:
    """
    Compliance Engine for Owner Dashboard.
    
    Manages:
    - Legal documents (Terms, Privacy, Cookie, AUP)
    - Document versioning
    - Consent logs
    - Data handling practices
    - Third-party service documentation
    """
    
    DOCUMENT_TYPES = ["terms", "privacy", "cookie", "acceptable_use"]
    
    @classmethod
    async def get_all_documents(cls, db) -> List[Dict[str, Any]]:
        """Get all legal documents."""
        documents = await db.legal_documents.find(
            {},
            {"_id": 0}
        ).sort("type", 1).to_list(100)
        
        return documents
    
    @classmethod
    async def get_document(cls, db, doc_type: str, version: str = None) -> Optional[Dict[str, Any]]:
        """Get a specific legal document."""
        query = {"type": doc_type}
        if version:
            query["version"] = version
        else:
            query["is_active"] = True
        
        doc = await db.legal_documents.find_one(query, {"_id": 0})
        return doc
    
    @classmethod
    async def get_active_documents(cls, db) -> Dict[str, Dict[str, Any]]:
        """Get all active legal documents."""
        documents = await db.legal_documents.find(
            {"is_active": True},
            {"_id": 0}
        ).to_list(10)
        
        return {doc["type"]: doc for doc in documents}
    
    @classmethod
    async def create_document(
        cls, 
        db, 
        doc_type: str, 
        title: str, 
        content: str, 
        version: str
    ) -> Tuple[bool, str, Optional[str]]:
        """Create a new legal document version."""
        if doc_type not in cls.DOCUMENT_TYPES:
            return False, f"Invalid document type. Must be one of: {cls.DOCUMENT_TYPES}", None
        
        # Deactivate previous versions
        await db.legal_documents.update_many(
            {"type": doc_type, "is_active": True},
            {"$set": {"is_active": False}}
        )
        
        doc_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        document = {
            "id": doc_id,
            "type": doc_type,
            "title": title,
            "content": content,
            "version": version,
            "effective_date": now,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        
        await db.legal_documents.insert_one(document)
        
        return True, "Document created successfully", doc_id
    
    @classmethod
    async def update_document(
        cls,
        db,
        doc_id: str,
        updates: Dict[str, Any]
    ) -> Tuple[bool, str]:
        """Update a legal document."""
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        result = await db.legal_documents.update_one(
            {"id": doc_id},
            {"$set": updates}
        )
        
        if result.modified_count > 0:
            return True, "Document updated successfully"
        return False, "Document not found"
    
    @classmethod
    async def get_document_versions(cls, db, doc_type: str) -> List[Dict[str, Any]]:
        """Get all versions of a document type."""
        versions = await db.legal_documents.find(
            {"type": doc_type},
            {"_id": 0}
        ).sort("created_at", -1).to_list(50)
        
        return versions
    
    @classmethod
    async def log_consent(
        cls,
        db,
        user_id: str,
        user_email: str,
        document_type: str,
        document_version: str,
        consented: bool,
        ip_address: str = ""
    ) -> str:
        """Log a user consent action."""
        consent_id = str(uuid.uuid4())
        
        consent = {
            "id": consent_id,
            "user_id": user_id,
            "user_email": user_email,
            "document_type": document_type,
            "document_version": document_version,
            "consented": consented,
            "ip_address": ip_address,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await db.consent_logs.insert_one(consent)
        
        return consent_id
    
    @classmethod
    async def get_consent_logs(
        cls,
        db,
        user_id: str = None,
        document_type: str = None,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Get consent logs with optional filtering."""
        query = {}
        if user_id:
            query["user_id"] = user_id
        if document_type:
            query["document_type"] = document_type
        
        total = await db.consent_logs.count_documents(query)
        logs = await db.consent_logs.find(
            query,
            {"_id": 0}
        ).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
        
        return logs, total
    
    @classmethod
    async def get_user_consents(cls, db, user_id: str) -> Dict[str, Dict[str, Any]]:
        """Get all consents for a user."""
        # Get latest consent for each document type
        consents = {}
        for doc_type in cls.DOCUMENT_TYPES:
            consent = await db.consent_logs.find_one(
                {"user_id": user_id, "document_type": doc_type},
                {"_id": 0},
                sort=[("timestamp", -1)]
            )
            if consent:
                consents[doc_type] = consent
        
        return consents
    
    @classmethod
    async def get_third_party_services(cls, db) -> List[Dict[str, Any]]:
        """Get documented third-party services."""
        stored = await db.system_settings.find_one({"type": "third_party_services"}, {"_id": 0})
        
        if stored and stored.get("data"):
            return stored["data"]
        
        # Default third-party services
        return [
            {"name": "MongoDB", "purpose": "Database storage", "data_types": ["User data", "Projects"], "location": "US"},
            {"name": "Stripe", "purpose": "Payment processing", "data_types": ["Payment info"], "location": "US"},
            {"name": "OpenAI", "purpose": "AI generation", "data_types": ["Project prompts"], "location": "US"},
        ]
    
    @classmethod
    async def update_third_party_services(cls, db, services: List[Dict[str, Any]]) -> Tuple[bool, str]:
        """Update third-party services documentation."""
        await db.system_settings.update_one(
            {"type": "third_party_services"},
            {"$set": {
                "type": "third_party_services",
                "data": services,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        return True, "Third-party services updated"
