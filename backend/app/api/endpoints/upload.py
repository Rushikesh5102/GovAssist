from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.file_processor import FileProcessor
from app.services.document_analyzer import DocumentAnalyzer
from app.core.database import get_db
from app.api.deps import get_current_user_optional
from sqlalchemy.orm import Session
from app.models.user import User
import json

router = APIRouter()

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    analyze: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    try:
        file_path = await FileProcessor.save_file(file)
        extracted_text = FileProcessor.extract_text(file_path, file.content_type)
        
        analysis_results = None
        if analyze and extracted_text and not extracted_text.startswith("Error"):
            analysis_results = DocumentAnalyzer.analyze_text(extracted_text)
            
            # Update user profile if logged in
            if current_user and analysis_results:
                existing_profile = json.loads(current_user.profile_data or "{}")
                merged_profile = DocumentAnalyzer.merge_profiles(existing_profile, analysis_results)
                current_user.profile_data = json.dumps(merged_profile)
                db.commit()
        
        return {
            "filename": file.filename,
            "filepath": file_path,
            "extracted_text": extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
            "analysis": analysis_results,
            "message": "File uploaded and processed successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
