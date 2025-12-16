from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_processor import FileProcessor

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = await FileProcessor.save_file(file)
        extracted_text = FileProcessor.extract_text(file_path, file.content_type)
        
        return {
            "filename": file.filename,
            "filepath": file_path,
            "extracted_text": extracted_text,
            "message": "File uploaded and processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
