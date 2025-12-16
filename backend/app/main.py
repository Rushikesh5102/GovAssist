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
        admin_email = "admin@govassist.ai"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                email=admin_email,
                hashed_password=get_password_hash("admin123"),
                full_name="System Admin",
                role="admin",
                is_admin=True,
                interests="[]"
            )
            db.add(admin_user)
            db.commit()
            print(f"Admin user created: {admin_email} / admin123")
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

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

from app.api.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)
