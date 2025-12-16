import os
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException
import fitz  # PyMuPDF
import docx
import whisper
from PIL import Image
import pytesseract

# Configure upload directory
UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class FileProcessor:
    @staticmethod
    async def save_file(file: UploadFile) -> str:
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
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
