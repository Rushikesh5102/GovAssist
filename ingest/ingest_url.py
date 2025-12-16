import os
import sys
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Add parent directory to path to import adapters
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from adapters.faiss_adapter import faiss_adapter

def ingest_url(url):
    print(f"Ingesting URL: {url}...")
    try:
        loader = WebBaseLoader(url)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        texts = text_splitter.split_documents(documents)
        
        faiss_adapter.ingest_documents(texts)
        print(f"Successfully ingested {len(texts)} chunks from {url}")
    except Exception as e:
        print(f"Error ingesting URL {url}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_url.py <url>")
    else:
        ingest_url(sys.argv[1])
