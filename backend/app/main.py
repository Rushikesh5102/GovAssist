from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.core.database import engine, Base
# Import all models to ensure they are registered with Base
from app.models import user, chat, document, scheme

app = FastAPI(title=settings.PROJECT_NAME, version="0.1.0")

@app.on_event("startup")
def startup_db_client():
    Base.metadata.create_all(bind=engine)
    
    # Create default admin user
    from sqlalchemy.orm import Session
    from app.core.database import SessionLocal
    from app.models.user import User
    from app.core.security import get_password_hash
    
    db = SessionLocal()
    try:
        # Admin Credentials List
        admins = [
            {
                "email": "pattiwarrushikesh5102@gmail.com",
                "password": "Rushikesh@5102",
                "name": "Rushikesh Pattiwar"
            },
            {
                "email": "kulkarniatharva753@gmail.com",
                "password": "ATK@123",
                "name": "Atharva Kulkarni"
            },
            # Fallback Demo Admin (Optional, keeping for safety if needed, or removing if strictly real creds preferred)
            # { "email": "admin@govassist.com", "password": "admin", "name": "System Admin" } 
        ]

        for admin_data in admins:
            existing_admin = db.query(User).filter(User.email == admin_data["email"]).first()
            if not existing_admin:
                admin_user = User(
                    email=admin_data["email"],
                    hashed_password=get_password_hash(admin_data["password"]),
                    full_name=admin_data["name"],
                    role="admin",
                    is_admin=True,
                    interests="[]",
                    phone_number="0000000000" # Dummy for admin
                )
                db.add(admin_user)
                db.commit()
                print(f"Admin user created: {admin_data['email']}")
            else:
                if not existing_admin.is_admin:
                    existing_admin.is_admin = True
                    existing_admin.role = "admin"
                    db.commit()
                    print(f"Updated existing user to admin: {admin_data['email']}")

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

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

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
