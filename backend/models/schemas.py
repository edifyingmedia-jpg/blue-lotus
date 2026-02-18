# Blue Lotus Backend Models
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid


# Enums
class PlanType(str, Enum):
    FREE = "free"
    CREATOR = "creator"
    PRO = "pro"
    ELITE = "elite"


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    OWNER = "owner"


class ProjectType(str, Enum):
    APP = "app"
    WEBSITE = "website"
    BOTH = "both"


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    BUILDING = "building"
    STAGED = "staged"
    PUBLISHED = "published"


class GenerationType(str, Enum):
    SCREEN = "screen"
    PAGE = "page"
    FLOW = "flow"
    REFINEMENT = "refinement"


# Plan Configuration
PLAN_CONFIG = {
    PlanType.FREE: {
        "name": "Free",
        "price": 0,
        "monthly_credits": 0,
        "starter_credits": 20,
        "daily_bonus": 0,
        "export_allowed": False,
        "publish_staging": False,
        "publish_production": False,
        "max_projects": 3,
        "max_published": 0,
        "team_seats": 0,
    },
    PlanType.CREATOR: {
        "name": "Creator",
        "price": 9.99,
        "monthly_credits": 150,
        "starter_credits": 0,
        "daily_bonus": 10,
        "export_allowed": True,
        "publish_staging": True,
        "publish_production": False,
        "max_projects": 10,
        "max_published": 2,
        "team_seats": 0,
    },
    PlanType.PRO: {
        "name": "Pro",
        "price": 19.99,
        "monthly_credits": 400,
        "starter_credits": 0,
        "daily_bonus": 10,
        "export_allowed": True,
        "publish_staging": True,
        "publish_production": True,
        "max_projects": 25,
        "max_published": 5,
        "team_seats": 0,
    },
    PlanType.ELITE: {
        "name": "Elite",
        "price": 29.99,
        "monthly_credits": 800,
        "starter_credits": 0,
        "daily_bonus": 10,
        "export_allowed": True,
        "publish_staging": True,
        "publish_production": True,
        "max_projects": 100,
        "max_published": -1,  # Unlimited
        "team_seats": 3,
    },
}


# Generation Credit Costs
GENERATION_COSTS = {
    GenerationType.SCREEN: 3,
    GenerationType.PAGE: 5,
    GenerationType.FLOW: 8,
    GenerationType.REFINEMENT: 1,
}


# User Models
class Credits(BaseModel):
    monthly: int = 0
    monthly_total: int = 0
    bonus: int = 0
    bonus_total: int = 10
    purchased: int = 0
    starter: int = 20
    last_bonus_refresh: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    name: str
    avatar: Optional[str] = None
    role: UserRole = UserRole.USER
    plan: PlanType = PlanType.FREE
    credits: Credits = Field(default_factory=Credits)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Subscription info
    stripe_customer_id: Optional[str] = None
    subscription_id: Optional[str] = None
    subscription_status: Optional[str] = None
    billing_cycle_start: Optional[datetime] = None


class UserCreate(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    plan: PlanType
    credits: Credits
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Project Models
class ProjectStructure(BaseModel):
    screens: List[str] = []
    pages: List[str] = []
    data_models: List[str] = []
    flows: List[str] = []
    sections: List[str] = []
    integrations: List[str] = []


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: Optional[str] = None
    type: ProjectType = ProjectType.APP
    status: ProjectStatus = ProjectStatus.DRAFT
    structure: ProjectStructure = Field(default_factory=ProjectStructure)
    thumbnail: Optional[str] = None
    staging_url: Optional[str] = None
    production_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: ProjectType = ProjectType.APP


class ProjectResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    user_id: str
    name: str
    description: Optional[str]
    type: ProjectType
    status: ProjectStatus
    structure: ProjectStructure
    thumbnail: Optional[str]
    staging_url: Optional[str]
    production_url: Optional[str]
    created_at: datetime
    updated_at: datetime


# Generation Models
class GenerationRequest(BaseModel):
    project_id: str
    type: GenerationType
    prompt: str


class GenerationResponse(BaseModel):
    success: bool
    credits_used: int
    credits_remaining: int
    output: Dict[str, Any]


# Credit Models
class CreditPurchase(BaseModel):
    pack_id: str  # pack100, pack250, pack600, pack1500
    

class CreditBalance(BaseModel):
    total: int
    monthly: int
    monthly_total: int
    bonus: int
    bonus_total: int
    purchased: int
    starter: int
    next_bonus_refresh: datetime


# Publishing Models
class PublishRequest(BaseModel):
    project_id: str
    environment: str  # "staging" or "production"


class PublishResponse(BaseModel):
    success: bool
    url: Optional[str] = None
    message: str


# Export Models
class ExportRequest(BaseModel):
    project_id: str
    export_type: str  # "full_app", "full_website", "code_package", "static_assets"


class ExportResponse(BaseModel):
    success: bool
    download_url: Optional[str] = None
    message: str
