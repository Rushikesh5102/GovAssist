# Performance Report

## Frontend Bundle Analysis
- **Tool**: `vite-bundle-visualizer`
- **Output**: `bundle-stats.html` generated in frontend directory.
- **Observations**:
    - React and ReactDOM are the largest chunks (expected).
    - Lucide-react icons are being tree-shaken correctly.
    - `pdfjs-dist` (used for PDF processing) is a significant dependency.

## Backend Performance
- **Health Check**: Endpoint `/api/health` is responsive (after restart).
- **Database**: SQLite is used for development. For production, migration to PostgreSQL is recommended for better concurrency.
- **Vector Store**: FAISS is running in-memory/local file. This is suitable for small datasets but should be moved to a managed vector DB (Pinecone/Weaviate) for scale.

## Recommendations
1. **Frontend**:
    - Implement code splitting for routes (Lazy loading pages).
    - Optimize image assets (WebP format).
2. **Backend**:
    - Use `gunicorn` with multiple workers for production deployment.
    - Implement Redis caching for frequent API calls (e.g., Schemes list).
