from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.chat import ChatSession, ChatMessage
from app.models.user import User
from app.api.deps import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class MessageResponse(BaseModel):
    role: str
    content: str
    timestamp: datetime
    sources: str | None = None

class SessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    # messages: List[MessageResponse] # Optional: include last message or all

@router.get("/", response_model=List[SessionResponse])
def get_history(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.created_at.desc()).offset(skip).limit(limit).all()
    return sessions

@router.get("/{session_id}", response_model=List[MessageResponse])
def get_session_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session.messages
