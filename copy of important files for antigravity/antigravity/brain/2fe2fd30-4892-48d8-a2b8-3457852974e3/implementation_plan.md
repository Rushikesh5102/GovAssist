# Run Project Locally

## Goal Description
Start the full stack application (Frontend + Backend) locally for development.

## User Review Required
- **Method**: Local execution (SQLite for DB) instead of Docker. This avoids Docker dependency issues and allows for faster dev cycles.

## Proposed Changes
No code changes. This plan involves executing terminal commands.

### Execution Steps

1.  **Backend Setup & Run**
    -   Navigate to `backend`
    -   Install dependencies: `pip install -r requirements.txt` (User might want to use a venv, I will try to use the existing `.venv` if valid, or just install)
    -   Start server: `uvicorn app.main:app --reload --port 8000`

2.  **Frontend Setup & Run**
    -   Navigate to `frontend`
    -   Install dependencies: `npm install`
    -   Start server: `npm run dev`

## Verification Plan

### Automated Verification
- Check Backend Health: `curl http://localhost:8000/api/health` should return `{"status": "ok"}`
- Check Frontend: Open `http://localhost:5173` in browser.
