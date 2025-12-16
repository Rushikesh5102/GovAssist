# Acceptance Checklist

- [x] **Backend**: FastAPI app running with all routes (chat, upload, eligibility, schemes, auth).
- [x] **Frontend**: React app running with Chat, Admin, and Navigation.
- [x] **RAG Pipeline**: Ingestion scripts (PDF/URL) and FAISS adapter implemented.
- [x] **LLM Connector**: Gemini/OpenAI connector implemented.
- [x] **OCR**: OCR logic with fallback implemented.
- [x] **Eligibility**: Rule engine and endpoint implemented.
- [x] **Auth**: JWT login/register implemented.
- [x] **Docker**: Dockerfiles and compose file created.
- [x] **Tests**: Unit tests and CI workflow created.

## Demo Video Script (90s)

1.  **0:00 - 0:10**: Intro & Login. Show landing page, register a new user, and login.
2.  **0:10 - 0:30**: Chat & RAG. Ask "What is PM-KISAN?". Show the bot answering with sources.
3.  **0:30 - 0:50**: Document Upload. Upload a PDF (e.g., a scheme guideline). Show success message. Ask a question about the new doc.
4.  **0:50 - 0:70**: Eligibility Check. Go to Eligibility page (or use chat). Enter profile details (farmer, 1.5 hectares). Show "Eligible for PM-KISAN".
5.  **0:70 - 0:80**: Admin UI. Show the Admin dashboard with list of schemes and docs.
6.  **0:80 - 0:90**: Outro. Show GitHub repo and Docker compose up command.

## Artifacts
- Source Code: GitHub Repo
- Docker Image: `govassist:latest`
