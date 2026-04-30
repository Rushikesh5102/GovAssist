import os
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException
import fitz  # PyMuPDF
import docx
import whisper
from PIL import Image
import pytesseract
from app.core.config import settings

# Configure upload directory
UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Initialize Supabase Client
supabase = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    from supabase import create_client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class FileProcessor:
    @staticmethod
    async def save_file(file: UploadFile) -> str:
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Upload to Supabase Storage if configured
        if supabase:
            try:
                import time
                unique_filename = f"{int(time.time())}_{file.filename}"
                with open(file_path, "rb") as f:
                    supabase.storage.from_("govassist-documents").upload(
                        file=f,
                        path=unique_filename,
                        file_options={"content-type": file.content_type}
                    )
                print(f"Successfully backed up {file.filename} to Supabase Cloud.")
            except Exception as e:
                print(f"Warning: Failed to backup to Supabase: {e}")
                
        return str(file_path)

    @staticmethod
    def extract_text(file_path: str, content_type: str) -> str:
        path = Path(file_path)
        ext = path.suffix.lower()

        try:
            if ext == ".pdf":
                return FileProcessor._process_pdf(file_path)
            elif ext in [".docx", ".doc"]:
                return FileProcessor._process_docx(file_path)
            elif ext in [".jpg", ".jpeg", ".png"]:
                return FileProcessor._process_image(file_path)
            elif ext in [".mp3", ".wav", ".m4a"]:
                return FileProcessor._process_audio(file_path)
            elif ext in [".txt", ".md"]:
                with open(file_path, "r", encoding="utf-8") as f:
                    return f.read()
            else:
                return "Unsupported file type for text extraction."
        except Exception as e:
            print(f"Error processing file {file_path}: {e}")
            return f"Error extracting text: {str(e)}"

    @staticmethod
    def _process_pdf(file_path: str) -> str:
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text

    @staticmethod
    def _process_docx(file_path: str) -> str:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])

    @staticmethod
    def _process_image(file_path: str) -> str:
        # Requires Tesseract installed on the system
        try:
            return pytesseract.image_to_string(Image.open(file_path))
        except Exception:
            return "[OCR Failed: Tesseract not found or error]"

    @staticmethod
    def _process_audio(file_path: str) -> str:
        # Requires ffmpeg installed on the system
        try:
            model = whisper.load_model("base")
            result = model.transcribe(file_path)
            return result["text"]
        except Exception as e:
            return f"[Transcription Failed: {str(e)}]"
