# GovAssist AI: API Reference

## Overview
The GovAssist AI API is built using **FastAPI**. It follows RESTful principles and uses JSON for data exchange.

**Base URL**: `http://localhost:8000/api`

## Authentication
Most endpoints require a Bearer Token.
- **Header**: `Authorization: Bearer <access_token>`

## Endpoints

### 1. Authentication
- **POST** `/auth/register`: Register a new user.
- **POST** `/auth/login`: Login and get access token.
- **GET** `/auth/me`: Get current user profile.

### 2. Chat
- **POST** `/chat`: Send a message to the AI.
    - **Body**: `{ "message": "string", "session_id": int }`
    - **Response**: `{ "answer": "string", "sources": [], "session_id": int }`

### 3. History
- **GET** `/history`: Get all chat sessions for the user.
- **GET** `/history/{session_id}`: Get messages for a specific session.
- **DELETE** `/history/{session_id}`: Delete a session.

### 4. Upload
- **POST** `/upload`: Upload a file for analysis.
    - **Form Data**: `file` (Multipart)
    - **Response**: `{ "filename": "string", "extracted_text": "string" }`

### 5. Voice
- **POST** `/voice/transcribe`: Transcribe audio file.
    - **Form Data**: `file` (Audio blob)
    - **Response**: `{ "text": "string" }`

### 6. Schemes
- **GET** `/schemes`: List all schemes.
- **GET** `/schemes/{id}`: Get scheme details.

### 7. Share
- **POST** `/share/{session_id}`: Generate a share link.
- **GET** `/share/{token}`: View a shared chat (Public).

### 8. Admin
- **POST** `/admin/crawl`: Trigger scheme crawler.
- **GET** `/admin/updates`: Get pending scheme updates.
- **POST** `/admin/updates/{id}/{action}`: Approve or Reject an update.

## Error Handling
- **400 Bad Request**: Invalid input.
- **401 Unauthorized**: Missing or invalid token.
- **403 Forbidden**: Insufficient permissions (e.g., non-admin accessing admin routes).
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server-side processing error.

*(See `openapi.json` for full specification)*
