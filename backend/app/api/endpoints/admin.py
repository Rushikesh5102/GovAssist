from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.scheme_update import SchemeUpdate
from app.services.crawler_service import CrawlerService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/crawl")
def trigger_crawl(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    count = CrawlerService.run_mock_crawl(db)
    return {"message": f"Crawl completed. {count} new updates found."}

@router.get("/updates")
def get_updates(
    status: str = "pending",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    updates = db.query(SchemeUpdate).filter(SchemeUpdate.status == status).all()
    return updates

@router.post("/updates/{update_id}/{action}")
def approve_reject_update(
    update_id: int,
    action: str, # approve or reject
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    update = db.query(SchemeUpdate).filter(SchemeUpdate.id == update_id).first()
    if not update:
        raise HTTPException(status_code=404, detail="Update not found")
        
    if action == "approve":
        update.status = "approved"
        # TODO: Move to main Schemes table
    elif action == "reject":
        update.status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    db.commit()
    return {"message": f"Update {action}d successfully"}
