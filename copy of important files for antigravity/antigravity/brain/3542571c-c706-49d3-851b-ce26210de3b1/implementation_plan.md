# Run GovAssist Project

The goal is to run the GovAssist project locally on the user's machine.

## User Review Required
> [!NOTE]
> This plan assumes `python` and `npm` are installed and available in the system PATH.

## Proposed Actions

### Backend
- Install Python dependencies from `backend/requirements.txt`.
- Ensure SQLite database is initialized (FastAPI usually handles this on startup if using SQLModel/SQLAlchemy with `create_all`).

### Frontend
- Install Node.js dependencies in `frontend` using `npm install`.

### Execution
- Use `run_local.bat` to start both backend and frontend services.
    - Backend: http://localhost:8000
    - Frontend: http://localhost:5102

## Verification Plan

### Automated Tests
- None for this task.

### Manual Verification
- [ ] Run `run_local.bat`.
- [ ] Verify Backend API docs load at http://localhost:8000/docs.
- [ ] Verify Frontend loads at http://localhost:5102.
