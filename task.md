# GovAssist Comprehensive Task & Roadmap Document

This is the single source of truth for all project planning, tasks, and documentation phases for GovAssist.

---

## Phase 1: MVP Core Development (Completed)
- [x] Scaffold repository, FastAPI backend, React (Vite) frontend.
- [x] Implement database models (Users, Chats, Docs, Schemes).
- [x] Implement RAG Pipeline & LLM Connector (Gemini API integration).
- [x] Integrate FAISS Vector Store and Document Ingestion.
- [x] Implement Eligibility Rule Engine for Schemes.
- [x] Implement Authentication & Session Store (JWT).
- [x] Create Frontend Chat UI and Navigation Layout.
- [x] Implement OCR & PDF Parsing with Tesseract & PyMuPDF.
- [x] Write baseline test suite and Dockerize (Docker-compose) stack.

---

## Phase 2: Production-Readiness & Automation (Current Status)

### Database & State Management
- [x] **Migrate to PostgreSQL**: Replaced local SQLite (`sql_app.db`) with Supabase PostgreSQL.
- [x] **Implement Alembic Migrations**: Replace `Base.metadata.create_all()` with Alembic migrations to safely manage schema changes.
- [x] **Redis Caching**: Implement Redis to cache frequently accessed scheme data.

### Security & Secrets Hardening
- [x] **Enforce Environment Secrets**: Removed hardcoded `"CHANGE_ME_IN_PROD"`. Server fails if secret key is missing.
- [x] **Sanitize `.env` Loading**: Ensure `.env` parser strictly strips trailing spaces from API keys.
- [x] **Rate Limiting**: Implemented rate limiting (`slowapi`) on authentication and chat endpoints (60 req/min).
- [x] **Sentry Error Tracking**: Integrated Sentry SDK for production exception tracking.

### Storage, Automation & Dashboards
- [x] **Supabase Cloud Storage**: Automatically backup user-uploaded documents to `govassist-documents`.
- [x] **Automated Data Scraper**: Built automated scraping pipeline using APScheduler.
- [x] **Owner Dashboard Toggles**: Added live UI switches to toggle Scraper, Supabase, and LLM features.
- [x] **Fix Frontend Navigation**: Corrected "Sign In" and "Sign Up" grouping.

---

## Phase 3: Final Year Evaluation Polish (Pending)
- [x] **Real-time Analytics Dashboard**: Hook up metrics in `OwnerDashboard.jsx` (Active Users, Uptime, etc.) to live database queries.
- [x] **Build Real Web Scraper**: Upgrade the mock background scraper to actually extract HTML from Wikipedia's live scheme data.
- [x] **Export to PDF Feature**: Allow users to download their personalized scheme "Eligibility Report" as a PDF.
- [x] **Advanced Automated Testing**: Write exhaustive Python `pytest` and JS `jest` tests to demonstrate robust engineering.

---

## Phase 4: Full Documentation Suite (Pending)
Generate the complete suite of final-year project documentation inside `docs/complete-suite`:
- [ ] 1_Project_Overview.md
- [ ] 2_Features.md
- [ ] 3_Architecture.md
- [ ] 4_UML_Diagrams.md
- [ ] 5_API_Reference.md
- [ ] 6_Database_Schema.md
- [ ] 7_Developer_Guide.md
- [ ] 8_Admin_Manual.md
- [ ] 9_User_Manual.md
- [ ] 10_Testing_QA.md
- [ ] 11_Performance_Report.md
- [ ] 12_Deployment_Guide.md
- [ ] 13_Security_Compliance.md
- [ ] 14_Changelog.md
- [ ] 15_Executive_Summary.md

---

## Phase 5: Enterprise Production & Security (The "Real World")
These are the enterprise-grade requirements necessary to launch this platform to real citizens on the internet.
- [ ] **Real Authentication (Google/OTP)**: Replace fake JWT login with Firebase/Supabase Auth for 1-click Google OAuth and Mobile OTP verification.
- [ ] **Email Integration**: Integrate SendGrid or AWS SES for real password reset links and welcome emails.
- [ ] **PII Encryption**: Implement AES-256 encryption at rest for sensitive user profile data (Income, Caste, Gender) to comply with the DPDP Act.
- [ ] **Cloud Vector Database**: Migrate from local FAISS to a scalable cloud vector DB like Pinecone, Milvus, or `pgvector` to prevent RAM exhaustion.
- [ ] **Asynchronous Task Queues**: Implement Celery + RabbitMQ/Redis to offload heavy PDF document parsing and LLM generation from the main server thread.
- [ ] **Official API Integration**: Replace the Wikipedia scraper with official API Setu / UMANG API integrations for legally compliant, real-time scheme data.
- [ ] **Strict Security Policies**: Enforce strict CORS policies, CSRF tokens, and helmet headers.
- [ ] **Real-time Telemetry & APM**: Replace the remaining mock charts in the Owner Dashboard (Hourly Traffic, Regional Data, Uptime, Latency) with real Application Performance Monitoring data (e.g., Prometheus/Grafana or Datadog).
