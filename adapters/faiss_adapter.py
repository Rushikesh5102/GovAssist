import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

class FAISSAdapter:
    def __init__(self, index_path="data/faiss_index"):
        self.index_path = index_path
        self.embeddings = None
        self.vector_store = None

    def _initialize(self):
        if self.embeddings is None:
            print("Initializing FAISS adapter (Lazy Load)...")
            self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            self.load_index()

    def load_index(self):
        if os.path.exists(self.index_path):
            try:
                self.vector_store = FAISS.load_local(self.index_path, self.embeddings, allow_dangerous_deserialization=True)
                print(f"Loaded FAISS index from {self.index_path}")
            except Exception as e:
                print(f"Error loading FAISS index: {e}")
                self.vector_store = None
        else:
            print("No existing FAISS index found. A new one will be created upon ingestion.")

    def ingest_documents(self, documents):
        self._initialize()
        if not documents:
            return
        
        if self.vector_store:
            self.vector_store.add_documents(documents)
        else:
            self.vector_store = FAISS.from_documents(documents, self.embeddings)
        
        self.vector_store.save_local(self.index_path)
        print(f"Saved FAISS index to {self.index_path}")

    def similarity_search(self, query, k=4):
        self._initialize()
        if not self.vector_store:
            return []
        return self.vector_store.similarity_search(query, k=k)

faiss_adapter = FAISSAdapter()
