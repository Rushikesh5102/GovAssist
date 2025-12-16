from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.eligibility_engine import eligibility_engine

router = APIRouter()

class EligibilityRequest(BaseModel):
    profile: Dict[str, Any]

@router.post("/")
def check_eligibility(request: EligibilityRequest):
    try:
        results = eligibility_engine.check_eligibility(request.profile)
        return {"eligible_schemes": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
