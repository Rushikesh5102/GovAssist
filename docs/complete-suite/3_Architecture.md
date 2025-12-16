# GovAssist AI: Technical Architecture Guide

## 1. High-Level Architecture
GovAssist AI follows a modern, microservices-inspired monolithic architecture.

```mermaid
graph TD
    Client[Frontend (React/Vite)] -->|REST API| LB[Load Balancer / Reverse Proxy]
    LB --> API[Backend API (FastAPI)]
    
    subgraph Backend Services
        API --> Auth[Auth Service]
        API --> Chat[Chat Service]
        API --> RAG[RAG Service]
        API --> Crawler[Crawler Service]
        API --> Voice[Voice Service]
    end
    
    subgraph Data Layer
        Auth --> DB[(PostgreSQL/SQLite)]
        Chat --> DB
        RAG --> VectorDB[(FAISS Vector Store)]
        Crawler --> DB
    end
    
    subgraph External Services
        Voice --> Whisper[OpenAI Whisper]
        RAG --> LLM[LLM Provider (Gemini/OpenAI)]
    end
```

## 2. Component Responsibilities

### Frontend (Client)
- **Tech Stack**: React, Vite, Tailwind CSS, Framer Motion.
- **Responsibilities**:
    - User Interface rendering.
    - State management (Context API).
    - API communication (Fetch/Axios).
    - Audio recording and file handling.

### Backend (Server)
- **Tech Stack**: Python, FastAPI, SQLAlchemy, Pydantic.
- **Responsibilities**:
    - Request validation and routing.
    - Business logic execution.
    - Database orchestration.
    - Integration with AI models.

### RAG Pipeline (Retrieval-Augmented Generation)
- **Components**: LangChain, FAISS, Sentence Transformers.
- **Flow**:
    1.  **Ingestion**: Documents -> Chunks -> Embeddings -> Vector Store.
    2.  **Retrieval**: Query -> Embedding -> Similarity Search -> Context.
    3.  **Generation**: Context + Query -> LLM -> Answer.

### Crawler Service
- **Tech Stack**: Python Requests, BeautifulSoup (Mocked).
- **Responsibilities**:
    - Periodic scanning of target URLs.
    - Change detection.
    - Creating `SchemeUpdate` records.

### Voice Service
- **Tech Stack**: OpenAI Whisper (Local/API).
- **Responsibilities**:
    - Transcribing audio blobs to text.
    - (Future) Generating audio from text.

## 3. Database Schema (Simplified)
- **Users**: `id`, `email`, `hashed_password`, `role`, `is_admin`.
- **ChatSessions**: `id`, `user_id`, `title`, `created_at`.
- **Messages**: `id`, `session_id`, `role`, `content`, `timestamp`.
- **Schemes**: `id`, `title`, `description`, `ministry`, `url`.
- **SchemeUpdates**: `id`, `title`, `status`, `source`.
- **SharedChats**: `id`, `session_id`, `share_token`, `expires_at`.
