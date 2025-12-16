# GovAssist AI: Database Schema Manual

## Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ ChatSession : has
    User ||--o{ Document : uploads
    ChatSession ||--o{ Message : contains
    ChatSession ||--o| SharedChat : shares
    
    User {
        int id PK
        string email
        string hashed_password
        string full_name
        string role
        boolean is_admin
    }

    ChatSession {
        int id PK
        int user_id FK
        string title
        datetime created_at
    }

    Message {
        int id PK
        int session_id FK
        string role
        string content
        datetime timestamp
        json sources
    }

    Document {
        int id PK
        int user_id FK
        string filename
        string file_path
        datetime uploaded_at
    }

    Scheme {
        int id PK
        string title
        string description
        string ministry
        string url
    }

    SchemeUpdate {
        int id PK
        string title
        string status
        string source
        datetime detected_at
    }

    SharedChat {
        int id PK
        int session_id FK
        string share_token
        datetime expires_at
    }
```

## Table Definitions

### 1. Users
Stores user credentials and profile information.
- **Indexes**: `email` (Unique)

### 2. ChatSessions
Groups messages into conversations.
- **Foreign Key**: `user_id` -> `Users.id`

### 3. Messages
Individual chat messages.
- **Foreign Key**: `session_id` -> `ChatSessions.id`
- **Fields**: `role` (user/assistant), `content` (text), `sources` (JSON array of citations).

### 4. Documents
Metadata for uploaded files.
- **Foreign Key**: `user_id` -> `Users.id`

### 5. Schemes
Official government schemes database.
- **Indexes**: `title`, `ministry`

### 6. SchemeUpdates
Temporary holding table for crawler results awaiting admin approval.
- **Status Enum**: `pending`, `approved`, `rejected`

### 7. SharedChats
Manages public links for chat sessions.
- **Foreign Key**: `session_id` -> `ChatSessions.id`
- **Indexes**: `share_token` (Unique)
