# GovAssist AI: Changelog & Migration Notes

## Version History

### v1.0.0 (Initial Release)
- **Core**: Basic Chat UI, RAG Engine, User Auth.
- **Features**: English support, simple file upload.

### v1.1.0 (The "Full Fix" Update)
- **UI Overhaul**: Glassmorphism design, responsive layout.
- **Stability**: Fixed blank page issues, optimized bundle size.
- **Features Added**:
    - **Multi-Language**: Hindi/Marathi UI & Keyboard.
    - **Voice Suite**: STT/TTS integration.
    - **Advanced Upload**: OCR for images/PDFs.
    - **Sharing**: Public chat links.
    - **Admin Panel**: Scheme crawler and approval workflow.

## Migration Guide (v1.0 -> v1.1)

### Database Migrations
1.  **Users Table**: Added `is_admin` column.
    ```sql
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    ```
2.  **Schemes Table**: Created `scheme_updates` table.
3.  **Shared Chats**: Created `shared_chats` table.

### Configuration Changes
- **.env**: Added `OPENAI_API_KEY` (or equivalent) for Voice/RAG.
- **Dependencies**: Added `openai-whisper`, `python-docx`, `pymupdf`.

### Upgrade Steps
1.  Pull latest code.
2.  Run `pip install -r backend/requirements.txt`.
3.  Run database migrations (or `alembic upgrade head`).
4.  Rebuild frontend: `cd frontend && npm install && npm run build`.
