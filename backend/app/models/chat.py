from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String)

    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String) # user, assistant
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sources = Column(Text) # JSON string of sources
    flag = Column(String, nullable=True) # garbage, sensitive, etc.
    feedback = Column(String, nullable=True) # up, down

    session = relationship("ChatSession", back_populates="messages")
