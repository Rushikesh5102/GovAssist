from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.chat import ChatSession
from app.models.share import SharedChat
from app.api.deps import get_current_user
from app.models.user import User
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/{session_id}")
def share_chat(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify session ownership
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # Check if already shared
    existing_share = db.query(SharedChat).filter(SharedChat.session_id == session_id).first()
    if existing_share:
        return {"share_url": f"/share/{existing_share.share_token}"}

    # Create new share
    new_share = SharedChat(
        session_id=session_id,
        expires_at=datetime.utcnow() + timedelta(days=7) # 7 days expiry
    )
    db.add(new_share)
    db.commit()
    db.refresh(new_share)

    return {"share_url": f"/share/{new_share.share_token}"}

@router.get("/{share_token}")
def get_shared_chat(
    share_token: str,
    db: Session = Depends(get_db)
):
    share = db.query(SharedChat).filter(SharedChat.share_token == share_token).first()
    if not share:
        raise HTTPException(status_code=404, detail="Shared chat not found or expired")
    
    # Fetch session and messages
    session = db.query(ChatSession).filter(ChatSession.id == share.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Original chat session deleted")
        
    return {
        "title": session.title,
        "messages": session.messages,
        "created_at": session.created_at
    }
