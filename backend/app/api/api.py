from fastapi import APIRouter
from app.api.endpoints import auth, chat, history, upload, schemes, share, admin, voice

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["schemes"])
api_router.include_router(share.router, prefix="/share", tags=["share"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
