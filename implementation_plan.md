# GovAssist Implementation Plan

## Architecture

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via SQLAlchemy) for relational data (Users, Schemes, Chat History).
- **Vector Store**: FAISS (Local) for document embeddings.
- **LLM**: Google Gemini (via API) or OpenAI (configurable).
- **OCR**: Tesseract + PyMuPDF.
- **Auth**: JWT (JSON Web Tokens).

### Frontend
- **Framework**: React (Vite) + Tailwind CSS.
- **State Management**: React Context or Zustand.
- **HTTP Client**: Axios or Fetch.
- **UI Components**: Custom components styled with Tailwind.

### Infrastructure
- **Containerization**: Docker + Docker Compose.
- **Services**:
  - `backend`: FastAPI app.
  - `frontend`: Nginx serving React build or Node dev server.
  - `db`: PostgreSQL.
  - `redis`: For caching/session (optional but good for rate limiting).

## Directory Structure

```
/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Config, security, database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic models
│   │   ├── services/     # Business logic (RAG, OCR, Rules)
│   │   └── main.py       # Entry point
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── ingest/
│   ├── ingest_pdfs.py
│   └── ingest_url.py
├── adapters/
│   ├── faiss_adapter.py
│   ├── pinecone_adapter.py
│   └── weaviate_adapter.py
├── data/                 # Local data storage (FAISS index, uploaded files)
├── docker-compose.yml
├── task_plan.json
└── README.md
```

## Key Features Implementation Details

### RAG Pipeline
1.  **Ingest**: Read PDF/URL -> Clean Text -> Chunking -> Embedding (e.g., `sentence-transformers` or OpenAI Embeddings) -> Store in FAISS.
2.  **Retrieve**: Query -> Embedding -> FAISS Search -> Top K Chunks.
3.  **Generate**: System Prompt + Retrieved Chunks + User Query -> LLM -> Answer.

### Eligibility Engine
-   JSON-based rule definition.
-   Example Rule:
    ```json
    {
      "scheme_id": "PM-KISAN",
      "conditions": {
        "age": { "min": 18 },
        "occupation": "farmer",
        "land_holding": { "max": 2.0 }
      }
    }
    ```
-   Logic: Iterate through rules, match against user profile.

### Security
-   **PII Masking**: Regex-based masking for Aadhaar (XXXX-XXXX-1234) and PAN before sending to LLM.
-   **Auth**: Standard Bearer token flow.

## Next Steps
1.  Execute Task 1: Scaffold Repo.
