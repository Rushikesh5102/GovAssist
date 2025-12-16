# GovAssist AI: UML Diagram Pack

## 1. Class Diagram (Simplified)

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string hashed_password
        +string role
        +bool is_admin
        +create_chat()
    }
    class ChatSession {
        +int id
        +int user_id
        +string title
        +datetime created_at
        +add_message()
    }
    class Message {
        +int id
        +int session_id
        +string role
        +string content
        +json sources
    }
    class Document {
        +int id
        +int user_id
        +string filename
        +string file_path
        +string content_hash
    }
    class Scheme {
        +int id
        +string title
        +string description
        +string ministry
        +string url
    }

    User "1" -- "*" ChatSession : owns
    User "1" -- "*" Document : uploads
    ChatSession "1" -- "*" Message : contains
```

## 2. Use Case Diagram: Citizen

```mermaid
usecaseDiagram
    actor Citizen
    actor AI_Assistant

    Citizen --> (Login/Signup)
    Citizen --> (Start New Chat)
    Citizen --> (Upload Document)
    Citizen --> (Search Schemes)
    Citizen --> (View History)
    
    (Start New Chat) --> AI_Assistant : Queries
    AI_Assistant --> (Provide Answer) : Responses
    (Upload Document) --> AI_Assistant : Analysis
```

## 3. Sequence Diagram: Chat Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant RAG_Service
    participant VectorDB
    participant LLM

    User->>Frontend: Sends message "How to apply for PM-KISAN?"
    Frontend->>API: POST /api/chat (msg, session_id)
    API->>RAG_Service: get_rag_response(query, history)
    RAG_Service->>VectorDB: similarity_search(query)
    VectorDB-->>RAG_Service: Returns relevant docs
    RAG_Service->>LLM: Generate answer(prompt + docs)
    LLM-->>RAG_Service: Returns answer
    RAG_Service-->>API: Returns answer + sources
    API-->>Frontend: JSON Response
    Frontend-->>User: Displays answer
```

## 4. Sequence Diagram: Document Upload

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant FileProcessor
    participant OCR_Engine

    User->>Frontend: Uploads "income_cert.jpg"
    Frontend->>API: POST /api/upload (file)
    API->>FileProcessor: save_file(file)
    FileProcessor-->>API: file_path
    API->>FileProcessor: extract_text(file_path)
    FileProcessor->>OCR_Engine: image_to_string(image)
    OCR_Engine-->>FileProcessor: Extracted Text
    FileProcessor-->>API: Text
    API-->>Frontend: Success + Summary
```

## 5. Sequence Diagram: Scheme Crawler (Admin)

```mermaid
sequenceDiagram
    participant Admin
    participant API
    participant CrawlerService
    participant Database

    Admin->>API: POST /api/admin/crawl
    API->>CrawlerService: run_mock_crawl()
    CrawlerService->>CrawlerService: Scrape Websites
    CrawlerService->>Database: Check if scheme exists
    alt New Scheme Found
        CrawlerService->>Database: Insert into SchemeUpdate (pending)
    end
    CrawlerService-->>API: Count of new updates
    API-->>Admin: "Crawl completed. X updates found."
```
