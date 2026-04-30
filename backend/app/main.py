from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import sentry_sdk

if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

from app.core.database import engine, Base
from app.models import user, chat, document, scheme, scheme_update

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(title=settings.PROJECT_NAME, version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

from app.services.scraper import init_scheduler

@app.on_event("startup")
def startup_db_client():
    init_scheduler()
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: create_all failed (likely tables already exist): {e}")
    
    # Create default admin user
    from sqlalchemy.orm import Session
    from app.core.database import SessionLocal
    from app.models.user import User
    from app.core.security import get_password_hash
    
    db = SessionLocal()
    try:
        # Admin/Owner Credentials List
        system_users = [
            {
                "email": "pattiwarrushikesh5102@gmail.com",
                "password": "Rushikesh@5102",
                "name": "Rushikesh Pattiwar",
                "role": "owner"
            },
            {
                "email": "Gundawarshashank12@gmail.com",
                "password": "Gundawar24@",
                "name": "Shashank Gundawar",
                "role": "owner"
            },
            {
                "email": "kulkarniatharva753@gmail.com",
                "password": "ATK@123",
                "name": "Atharva Kulkarni",
                "role": "admin"
            }
        ]

        for user_data in system_users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                new_sys_user = User(
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    full_name=user_data["name"],
                    role=user_data["role"],
                    is_admin=True,
                    interests="[]",
                    phone_number="0000000000" # Dummy for admin
                )
                db.add(new_sys_user)
                db.commit()
                print(f"System user created: {user_data['email']} as {user_data['role']}")
            else:
                existing_user.is_admin = True
                existing_user.role = user_data["role"]
                db.commit()
                print(f"Updated existing user role to {user_data['role']}: {user_data['email']}")

        # --- Seed Default Schemes ---
        from app.models.scheme import Scheme
        
        default_schemes = [
            {
                "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "description": "Income support of ₹6,000/- per year in three equal installments to all landholding farmer families.",
                "category": "Agriculture",
                "ministry": "Ministry of Agriculture and Farmers Welfare",
                "active": True,
                "eligibility_criteria": {"role": "Farmer", "land": "Yes"},
                "benefits": {"amount": "6000", "period": "Yearly"}
            },
            {
                "name": "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
                "description": "Financial assistance for construction of pucca house for homeless and those living in dilapidated houses in rural areas.",
                "category": "Housing",
                "ministry": "Ministry of Rural Development",
                "active": True,
                "eligibility_criteria": {"income": "low", "housing": "none"},
                "benefits": {"subsidy": "1.2 Lakh"}
            },
            {
                "name": "Ayushman Bharat - PMJAY",
                "description": "Health coverage of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
                "category": "Health",
                "ministry": "Ministry of Health and Family Welfare",
                "active": True,
                "eligibility_criteria": {"category": "SECC 2011"},
                "benefits": {"insurance": "5 Lakh"}
            },
            {
                "name": "National Social Assistance Programme (NSAP)",
                "description": "Pension to elderly, widows, and persons with disabilities.",
                "category": "Pension",
                "ministry": "Ministry of Rural Development",
                "active": True,
                "eligibility_criteria": {"age": "60+"},
                "benefits": {"pension": "monthly"}
            },
             {
                "name": "Skill India Mission",
                "description": "Vocational training and certification to youth for better employability.",
                "category": "Education",
                "ministry": "Ministry of Skill Development",
                "active": True,
                "eligibility_criteria": {"age": "18-35"},
                "benefits": {"training": "free"}
            }
        ]

        for scheme_data in default_schemes:
            if not db.query(Scheme).filter(Scheme.name == scheme_data["name"]).first():
                import json
                new_scheme = Scheme(
                    name=scheme_data["name"],
                    description=scheme_data["description"],
                    category=scheme_data["category"],
                    ministry=scheme_data["ministry"],
                    active=scheme_data["active"],
                    # Storing simple JSONs for now as they are strings in model
                    eligibility_criteria=json.dumps(scheme_data["eligibility_criteria"]),
                    benefits=json.dumps(scheme_data["benefits"]),
                    tags=f"{scheme_data['category']},Central,Welfare"
                )
                db.add(new_scheme)
                db.commit()
                print(f"Seeded Scheme: {scheme_data['name']}")

    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import Request

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )

from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

@app.get("/api/admin/metrics")
def get_metrics(db: Session = Depends(get_db)):
    from app.models.user import User
    from app.models.scheme import Scheme
    from app.models.chat import ChatSession
    
    total_users = db.query(User).count()
    total_schemes = db.query(Scheme).count()
    total_chats = db.query(ChatSession).count()
    
    # Calculate mock uptime and performance based on simple logic
    return {
        "activeUsers": total_users,
        "pageViews": total_chats * 12 + 1050,  # mock logic for realistic display
        "serverUptime": "99.99%",
        "responseTime": "85ms",
        "errorRate": "0.00%",
        "dbConnections": 12,
        "totalSchemes": total_schemes,
        "totalChats": total_chats
    }

from pydantic import BaseModel
class ConfigUpdate(BaseModel):
    ENABLE_SCRAPER: bool | None = None
    ENABLE_SUPABASE: bool | None = None
    ENABLE_LLM: bool | None = None

@app.get("/api/admin/config")
def get_config():
    return {
        "ENABLE_SCRAPER": settings.ENABLE_SCRAPER,
        "ENABLE_SUPABASE": settings.ENABLE_SUPABASE,
        "ENABLE_LLM": settings.ENABLE_LLM
    }

@app.post("/api/admin/config")
def update_config(config: ConfigUpdate):
    from dotenv import set_key
    env_path = os.path.join(BASE_DIR, ".env")
    
    if config.ENABLE_SCRAPER is not None:
        settings.ENABLE_SCRAPER = config.ENABLE_SCRAPER
        set_key(env_path, "ENABLE_SCRAPER", str(config.ENABLE_SCRAPER))
    if config.ENABLE_SUPABASE is not None:
        settings.ENABLE_SUPABASE = config.ENABLE_SUPABASE
        set_key(env_path, "ENABLE_SUPABASE", str(config.ENABLE_SUPABASE))
    if config.ENABLE_LLM is not None:
        settings.ENABLE_LLM = config.ENABLE_LLM
        set_key(env_path, "ENABLE_LLM", str(config.ENABLE_LLM))
        
    return {"status": "success", "message": "Configuration updated globally"}

from app.api.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

# --- PRODUCTION DEPLOYMENT CONFIG ---
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Adjust path to point to frontend/dist relative to this file
# This file is: backend/app/main.py
# Root is: backend/
# Frontend is: ../frontend/dist
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # backend/
FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    # Serve Assets (JS/CSS/Images)
    # Check if assets dir exists to avoid error if build failed
    if os.path.exists(os.path.join(FRONTEND_DIST, "assets")):
        app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    # Serve other static files (favicon, etc.) or fallback to index.html
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Allow API routes to bubble up (already handled by router above if matched)
        if full_path.startswith("api/"):
             # If it reached here, it means api route wasn't found in router
             return {"error": "API interactions endpoint not found"}

        # Check if file exists in dist
        path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(path) and os.path.isfile(path):
            return FileResponse(path)
        
        # Fallback to index.html for React Router
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    print(f"Frontend build not found at {FRONTEND_DIST}. Run 'npm run build' in frontend directory.")
