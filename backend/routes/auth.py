# Authentication Routes
from fastapi import APIRouter, HTTPException, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime, timezone

from models.schemas import (
    User, UserCreate, UserLogin, UserResponse, TokenResponse,
    PlanType, Credits
)
from utils.auth import hash_password, verify_password, create_access_token, decode_access_token
from engines.credit_engine import CreditEngine

router = APIRouter(prefix="/auth", tags=["Authentication"])


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = None
) -> Optional[User]:
    """Get current user from JWT token."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        return None
    
    user_doc = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user_doc:
        return None
    
    # Convert stored dates
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    if isinstance(user_doc.get("updated_at"), str):
        user_doc["updated_at"] = datetime.fromisoformat(user_doc["updated_at"])
    if user_doc.get("credits") and isinstance(user_doc["credits"].get("last_bonus_refresh"), str):
        user_doc["credits"]["last_bonus_refresh"] = datetime.fromisoformat(user_doc["credits"]["last_bonus_refresh"])
    
    return User(**user_doc)


def create_auth_routes(db: AsyncIOMotorDatabase):
    """Create auth routes with database dependency."""
    
    @router.post("/signup", response_model=TokenResponse)
    async def signup(user_data: UserCreate):
        """Register a new user."""
        # Check if email already exists
        existing = await db.users.find_one({"email": user_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user with Free plan and starter credits
        credits = CreditEngine.initialize_credits(PlanType.FREE)
        
        user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            name=user_data.name,
            plan=PlanType.FREE,
            credits=credits
        )
        
        # Prepare document for MongoDB
        user_doc = user.model_dump()
        user_doc["created_at"] = user_doc["created_at"].isoformat()
        user_doc["updated_at"] = user_doc["updated_at"].isoformat()
        user_doc["credits"]["last_bonus_refresh"] = user_doc["credits"]["last_bonus_refresh"].isoformat()
        
        await db.users.insert_one(user_doc)
        
        # Generate token
        token = create_access_token(user.id, user.email)
        
        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                avatar=user.avatar,
                role=user.role,
                plan=user.plan,
                credits=user.credits,
                created_at=user.created_at
            )
        )
    
    @router.post("/login", response_model=TokenResponse)
    async def login(credentials: UserLogin):
        """Login user and return token."""
        user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
        
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(credentials.password, user_doc["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Convert dates
        if isinstance(user_doc.get("created_at"), str):
            user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
        if isinstance(user_doc.get("updated_at"), str):
            user_doc["updated_at"] = datetime.fromisoformat(user_doc["updated_at"])
        if user_doc.get("credits") and isinstance(user_doc["credits"].get("last_bonus_refresh"), str):
            user_doc["credits"]["last_bonus_refresh"] = datetime.fromisoformat(user_doc["credits"]["last_bonus_refresh"])
        
        user = User(**user_doc)
        
        # Check and apply bonus credit refresh
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        
        # Update user in database with refreshed credits
        await db.users.update_one(
            {"id": user.id},
            {"$set": {
                "credits": {
                    **user.credits.model_dump(),
                    "last_bonus_refresh": user.credits.last_bonus_refresh.isoformat()
                }
            }}
        )
        
        # Generate token
        token = create_access_token(user.id, user.email)
        
        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                avatar=user.avatar,
                role=user.role,
                plan=user.plan,
                credits=user.credits,
                created_at=user.created_at
            )
        )
    
    @router.get("/me", response_model=UserResponse)
    async def get_me(authorization: Optional[str] = Header(None)):
        """Get current user profile."""
        user = await get_current_user(authorization, db)
        
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check and apply bonus credit refresh
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        
        # Update in database
        await db.users.update_one(
            {"id": user.id},
            {"$set": {
                "credits": {
                    **user.credits.model_dump(),
                    "last_bonus_refresh": user.credits.last_bonus_refresh.isoformat()
                }
            }}
        )
        
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            avatar=user.avatar,
            role=user.role,
            plan=user.plan,
            credits=user.credits,
            created_at=user.created_at
        )
    
    return router
