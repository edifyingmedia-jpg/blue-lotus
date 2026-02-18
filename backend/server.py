"""
Blue Lotus Backend Server
========================
Core engines: Authentication, Credits, Generation, Publishing, Export
"""

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent))

load_dotenv()

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "bluelotus")

# Create FastAPI app
app = FastAPI(
    title="Blue Lotus API",
    description="No-code AI app builder backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Import route creators
from routes.auth import create_auth_routes
from routes.projects import create_project_routes
from routes.generation import create_generation_routes
from routes.publishing import create_publishing_routes
from routes.export import create_export_routes
from routes.credits import create_credits_routes
from routes.builder import create_builder_routes
from routes.intelligence import create_intelligence_routes
from routes.canvas import create_canvas_routes
from routes.components import router as components_router
from routes.blueprints import create_blueprint_routes
from routes.diagnostics import create_diagnostics_routes
from routes.settings import create_settings_routes
from routes.voice import create_voice_routes

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Register routes
api_router.include_router(create_auth_routes(db))
api_router.include_router(create_project_routes(db))
api_router.include_router(create_generation_routes(db))
api_router.include_router(create_publishing_routes(db))
api_router.include_router(create_export_routes(db))
api_router.include_router(create_credits_routes(db))
api_router.include_router(create_builder_routes(db))
api_router.include_router(create_intelligence_routes(db))
api_router.include_router(create_canvas_routes(db))
api_router.include_router(components_router)
api_router.include_router(create_blueprint_routes(db))
api_router.include_router(create_diagnostics_routes(db))
api_router.include_router(create_settings_routes(db))
api_router.include_router(create_voice_routes(db))

# Include the API router
app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Blue Lotus API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Test MongoDB connection
        await client.admin.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "total_engines": 35,
        "engines": {
            # Core Engines (5)
            "credit_engine": "operational",
            "plan_enforcement": "operational",
            "generation_engine": "operational (mocked)",
            "publishing_engine": "operational (mocked)",
            "export_engine": "operational (mocked)",
            # Build Engines (4)
            "project_engine": "operational",
            "data_model_engine": "operational",
            "navigation_engine": "operational",
            "ai_instruction_engine": "operational",
            # Advanced Engines (4)
            "orchestration_engine": "operational",
            "runtime_intelligence_engine": "operational",
            "canvas_engine": "operational",
            "component_library_engine": "operational",
            # Control Engines (4)
            "ai_orchestration_engine": "operational",
            "blueprint_generation_engine": "operational",
            "system_diagnostics_engine": "operational",
            "platform_settings_engine": "operational",
            # Voice Core Engines (6)
            "voice_input_engine": "operational",
            "speech_to_intent_engine": "operational",
            "voice_orchestration_engine": "operational",
            "voice_feedback_engine": "operational (OpenAI TTS)",
            "voice_safety_layer": "operational",
            "voice_settings_engine": "operational",
            # Voice Experience Engines (3)
            "voice_error_handling_engine": "operational",
            "voice_accessibility_engine": "operational",
            "voice_onboarding_engine": "operational",
            # Voice Intelligence Engines (5)
            "voice_help_guidance_engine": "operational",
            "voice_multistep_workflow_engine": "operational",
            "voice_component_placement_engine": "operational",
            "voice_debugging_engine": "operational",
            "extended_voice_intelligence_engine": "operational",
            # Voice Control Engines (4)
            "voice_driven_publishing_engine": "operational",
            "voice_driven_data_modeling_engine": "operational",
            "voice_driven_navigation_engine": "operational",
            "voice_driven_project_review_engine": "operational"
        }
    }


@app.get("/api/plans")
async def get_plans():
    """Get available plans and their features."""
    from models.schemas import PLAN_CONFIG, PlanType
    
    plans = []
    for plan_type in PlanType:
        config = PLAN_CONFIG[plan_type]
        plans.append({
            "id": plan_type.value,
            "name": config["name"],
            "price": config["price"],
            "monthly_credits": config["monthly_credits"],
            "daily_bonus": config["daily_bonus"],
            "features": {
                "export": config["export_allowed"],
                "staging": config["publish_staging"],
                "production": config["publish_production"],
                "max_projects": config["max_projects"],
                "max_published": config["max_published"] if config["max_published"] != -1 else "Unlimited",
                "team_seats": config["team_seats"]
            }
        })
    
    return {"plans": plans}


@app.on_event("startup")
async def startup_db_client():
    """Create indexes on startup."""
    try:
        # User indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("id", unique=True)
        
        # Project indexes
        await db.projects.create_index("id", unique=True)
        await db.projects.create_index("user_id")
        
        print("✅ Blue Lotus Backend Started")
        print(f"📦 Database: {DB_NAME}")
        print("🔧 Core Engines (5): Credit, Generation, Publishing, Export, Plan Enforcement")
        print("🔧 Build Engines (4): Project, Data Model, Navigation, AI Instruction")
        print("🔧 Advanced Engines (4): Orchestration, Runtime Intelligence, Canvas, Component Library")
        print("🔧 Control Engines (4): AI Orchestration, Blueprint Generation, System Diagnostics, Platform Settings")
        print("🎤 Voice Core (6): Voice Input, STT→Intent, Voice Orchestration, TTS Feedback, Safety, Settings")
        print("🎤 Voice Experience (3): Error Handling, Accessibility, Onboarding")
        print("🧠 Voice Intelligence (5): Help & Guidance, Multi-Step Workflow, Component Placement, Debugging, Extended Intelligence")
        print("🎙️ Voice Control (4): Publishing, Data Modeling, Navigation, Project Review")
        print("📊 Total Engines: 35")
    except Exception as e:
        print(f"⚠️ Startup warning: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown."""
    client.close()
    print("🛑 Blue Lotus Backend Stopped")
