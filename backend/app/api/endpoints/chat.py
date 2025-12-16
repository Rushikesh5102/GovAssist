from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.services.rag_service import get_rag_response
from app.core.database import get_db
from app.models.chat import ChatSession, ChatMessage
from app.models.user import User
from app.api.deps import get_current_user_optional
from datetime import datetime
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None

@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    try:
        # Fetch history if session_id exists
        history = []
        if request.session_id:
            # Verify session belongs to user if logged in, or just fetch if we trust the ID (for now let's trust if provided, but ideally verify)
            # Actually, we should only fetch if it belongs to the user OR if we allow anonymous sessions (which we do for now via local storage ID, but backend expects user_id for persistence)
            # If user is logged in, we verify.
            if current_user:
                session = db.query(ChatSession).filter(ChatSession.id == request.session_id, ChatSession.user_id == current_user.id).first()
                if session:
                    # Fetch last 10 messages
                    msgs = db.query(ChatMessage).filter(ChatMessage.session_id == request.session_id).order_by(ChatMessage.timestamp.desc()).limit(10).all()
                    history = [{"role": m.role, "content": m.content} for m in msgs][::-1]

        # Check for garbage input
        from app.utils.sanitizer import is_garbage_input
        is_garbage = is_garbage_input(request.message)
        
        if is_garbage:
            answer = "I didn't understand that. Could you rephrase? Here are some things you can ask me:\n- How do I apply for PM Kisan?\n- What are the eligibility criteria for Awas Yojana?"
            sources = []
            response_data = {"answer": answer, "sources": sources}
        else:
            # Generate response with history
            response_data = get_rag_response(request.message, history=history)
            answer = response_data.get("answer", "")
            sources = response_data.get("sources", [])

        # Save to DB if user is logged in
        if current_user:
            session_id = request.session_id
            if not session_id:
                # Create new session
                new_session = ChatSession(
                    user_id=current_user.id,
                    title=request.message[:50], # Use first 50 chars as title
                    created_at=datetime.utcnow()
                )
                db.add(new_session)
                db.commit()
                db.refresh(new_session)
                session_id = new_session.id
            
            # Verify session belongs to user
            else:
                session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
                if not session:
                    # If session doesn't exist or doesn't belong to user, create new one
                    new_session = ChatSession(
                        user_id=current_user.id,
                        title=request.message[:50],
                        created_at=datetime.utcnow()
                    )
                    db.add(new_session)
                    db.commit()
                    db.refresh(new_session)
                    session_id = new_session.id

            # Save User Message
            user_msg = ChatMessage(
                session_id=session_id,
                role="user",
                content=request.message,
                timestamp=datetime.utcnow(),
                flag="garbage" if is_garbage else None
            )
            db.add(user_msg)

            # Save Assistant Message
            bot_msg = ChatMessage(
                session_id=session_id,
                role="assistant",
                content=answer,
                sources=json.dumps(sources),
                timestamp=datetime.utcnow()
            )
            db.add(bot_msg)
            db.commit()
            
            # Return session_id in response so frontend can continue conversation
            response_data["session_id"] = session_id

        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
