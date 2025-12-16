# GovAssist Walkthrough

The GovAssist project is now running locally.

## Access Points
- **Frontend**: [http://localhost:5102](http://localhost:5102)
- **Backend API Docs**: [http://localhost:8001/docs](http://localhost:8001/docs)

## Steps Taken
1. **Dependencies**: Installed Python dependencies (backend) and Node.js dependencies (frontend).
2. **Execution**:
    - Started Frontend via `npm run dev`.
    - Started Backend manually via `uvicorn` (due to batch script issues).

## Verification
- Verified Frontend loads successfully.
- Verified Backend API docs are accessible.

## Troubleshooting
- **AI Not Responding**: If the AI doesn't respond in the chat, it might be due to IPv6 resolution issues with `localhost`.
    - **Fix**: The frontend proxy in `vite.config.js` has been updated to use `127.0.0.1` instead of `localhost`.
    - **Action**: Restart the frontend server (`npm run dev`) if the issue persists.
- **Infinite Loading / Backend Hanging**: The backend was getting stuck during startup due to heavy model loading blocking the event loop.
    - **Fix 1**: Implemented **lazy loading** for the FAISS vector store adapter.
    - **Fix 2**: Switched backend port to **8001** to avoid conflicts with zombie processes on port 8000.
    - **Action**: The `run_local.bat` and `vite.config.js` have been updated. Please **restart the entire application** using `run_local.bat`.

## Performance Note
The current setup uses SQLite and an in-memory vector store, suitable for development and low traffic. For production/high traffic, migration to PostgreSQL and a managed vector database is recommended.
