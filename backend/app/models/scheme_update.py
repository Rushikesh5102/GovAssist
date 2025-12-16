from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from app.core.database import Base
from datetime import datetime

class SchemeUpdate(Base):
    __tablename__ = "scheme_updates"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, nullable=True) # If null, it's a new scheme
    title = Column(String, index=True)
    description = Column(Text)
    ministry = Column(String)
    url = Column(String)
    status = Column(String, default="pending") # pending, approved, rejected
    detected_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String) # e.g., "Crawler", "User Submission"
