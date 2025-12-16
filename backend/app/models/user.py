from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    full_name = Column(String)
    role = Column(String, default="citizen") # student, farmer, business, citizen
    interests = Column(String) # JSON string of interests
    phone_number = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
