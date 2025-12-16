from sqlalchemy import Column, Integer, String, Text, JSON
from app.core.database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    eligibility_rules = Column(JSON) # JSON rules
    benefits = Column(Text)
    documents_required = Column(Text)
