import os
import sys
import pytesseract
from pdf2image import convert_from_path
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Add parent directory to path to import adapters
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from adapters.faiss_adapter import faiss_adapter

def ocr_pdf(file_path):
    print(f"Starting OCR for {file_path}...")
    try:
        images = convert_from_path(file_path)
        full_text = ""
        
        for i, image in enumerate(images):
            text = pytesseract.image_to_string(image)
            full_text += text + "\n"
            print(f"Processed page {i+1}/{len(images)}")
            
        return full_text
    except Exception as e:
        print(f"OCR failed: {e}")
        return None

def ingest_file_with_ocr(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    # Try standard text extraction first (using PyMuPDF from ingest_pdfs logic)
    # For now, let's assume we want to force OCR or fallback.
    # Let's implement a hybrid approach.
    
    from langchain_community.document_loaders import PyMuPDFLoader
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()
    
    text_content = "".join([doc.page_content for doc in documents])
    
    if len(text_content.strip()) < 50: # Heuristic: if very little text, it might be scanned
        print("Text extraction yielded little text. Attempting OCR...")
        ocr_text = ocr_pdf(file_path)
        if ocr_text:
            documents = [Document(page_content=ocr_text, metadata={"source": file_path, "method": "ocr"})]
        else:
            print("OCR failed or returned no text.")
    else:
        print("Text extraction successful.")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    texts = text_splitter.split_documents(documents)
    
    faiss_adapter.ingest_documents(texts)
    print(f"Successfully ingested {len(texts)} chunks from {file_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_file.py <path_to_file>")
    else:
        ingest_file_with_ocr(sys.argv[1])
