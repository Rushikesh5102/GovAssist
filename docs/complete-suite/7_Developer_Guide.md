# GovAssist AI: Developer Guide

## 1. Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **PostgreSQL** (or SQLite for dev)
- **Git**

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/govassist/phantom-quasar.git
    cd phantom-quasar
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    ```

## 2. Running the Application

### Development Mode
1.  **Start Backend**:
    ```bash
    # In backend/ directory
    uvicorn app.main:app --reload --port 8000
    ```
    API will be available at `http://localhost:8000`.

2.  **Start Frontend**:
    ```bash
    # In frontend/ directory
    npm run dev
    ```
    App will be running at `http://localhost:5102`.

### Production Build
1.  **Build Frontend**:
    ```bash
    npm run build
    ```
    Output is in `dist/`.

2.  **Run Backend**:
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000
    ```

## 3. Project Structure
```
/backend
  /app
    /api        # API Endpoints (Routers)
    /core       # Config, Security, Database
    /models     # SQLAlchemy Models
    /services   # Business Logic (RAG, Crawler, Voice)
  /data         # Uploads & Vector Store
/frontend
  /src
    /components # Reusable UI Components
    /pages      # Route Pages
    /context    # Global State
    /styles     # Tailwind & Global CSS
```

## 4. Adding New Features

### Adding a New API Endpoint
1.  Create a new file in `backend/app/api/endpoints/`.
2.  Define your `APIRouter` and endpoints.
3.  Include the router in `backend/app/api/api.py`.

### Adding a New Frontend Page
1.  Create a component in `frontend/src/pages/`.
2.  Add a route in `frontend/src/App.jsx` (use lazy loading).
3.  Add navigation links if necessary.

## 5. Coding Standards
- **Python**: Follow PEP 8. Use type hints.
- **JavaScript/React**: Functional components with Hooks. Use `const` and arrow functions.
- **Commits**: Use conventional commits (e.g., `feat: add voice support`, `fix: resolve login bug`).
