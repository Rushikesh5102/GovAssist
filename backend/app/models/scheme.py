from sqlalchemy import Column, Integer, String, Boolean, Text, JSON
from app.core.database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    ministry = Column(String, index=True)
    category = Column(String, index=True)
    tags = Column(String)  # Comma-separated tags
    
    # Storing structured data as JSON
    eligibility_criteria = Column(JSON)
    documents_required = Column(JSON)
    benefits = Column(JSON)
    
    active = Column(Boolean, default=True)
