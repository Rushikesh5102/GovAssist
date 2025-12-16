import os
import sys
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Add parent directory to path to import adapters
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from adapters.faiss_adapter import faiss_adapter

def ingest_pdf(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Ingesting {file_path}...")
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    texts = text_splitter.split_documents(documents)
    
    faiss_adapter.ingest_documents(texts)
    print(f"Successfully ingested {len(texts)} chunks from {file_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_pdfs.py <path_to_pdf>")
    else:
        ingest_pdf(sys.argv[1])
