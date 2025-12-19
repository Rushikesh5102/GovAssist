from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False) # Changed default to False (requires verification)
    full_name = Column(String)
    role = Column(String, default="citizen") # student, farmer, business, citizen
    interests = Column(String) # JSON string of interests
    phone_number = Column(String, nullable=True)
    aadhar_number = Column(String, unique=True, nullable=True)
    is_admin = Column(Boolean, default=False)

    # Auth & Onboarding Fields
    is_verified = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)
    preferences = Column(String, default="{}") # JSON: accessibility, notification settings
    location = Column(String, default="{}") # JSON: state, district
    language = Column(String, default="en")
    profile_data = Column(String, default="{}") # JSON: age, income, category, gender, occupation, etc.
    
    # Secure OTP Storage
    otp_hash = Column(String, nullable=True)
    otp_expires_at = Column(String, nullable=True) # ISO format datetime string
