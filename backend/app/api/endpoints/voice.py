from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_processor import FileProcessor
import shutil
import os
import uuid

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save temp file
        temp_filename = f"temp_{uuid.uuid4()}_{file.filename}"
        temp_path = f"data/uploads/{temp_filename}"
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Transcribe
        text = FileProcessor._process_audio(temp_path)
        
        # Cleanup (optional, maybe keep for debug)
        # os.remove(temp_path) 
        
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
