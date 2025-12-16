# GovAssist AI: Testing & QA Documentation

## 1. Testing Strategy
We employ a multi-layered testing strategy to ensure stability, security, and performance.

### Levels of Testing
1.  **Unit Tests**: Testing individual functions and components.
2.  **Integration Tests**: Verifying communication between API, Database, and Services.
3.  **End-to-End (E2E) Tests**: Simulating user flows from Frontend to Backend.

## 2. Automated Tests
Located in `backend/tests/`.

### Key Test Cases
- **Auth**:
    - `test_create_user`: Verifies registration flow.
    - `test_login`: Verifies token generation.
- **API Health**:
    - `test_health_check`: Ensures server is running.
    - `test_read_main`: Root endpoint check.
- **Security**:
    - `test_chat_endpoint_unauthorized`: Ensures protected routes reject requests without tokens.

### Running Tests
```bash
cd backend
pytest
```

## 3. Manual Verification Checklist
| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Login/Signup** | ✅ Pass | Validated with new DB schema. |
| **Chat Response** | ✅ Pass | RAG returns sources correctly. |
| **Voice Input** | ✅ Pass | Mic permissions and transcription work. |
| **File Upload** | ✅ Pass | PDF/Image text extraction verified. |
| **Admin Panel** | ✅ Pass | Crawler triggers and updates appear. |
| **Mobile UI** | ✅ Pass | Verified on iPhone 12 / Pixel 5 viewports. |
| **Language Switch** | ✅ Pass | Hindi keyboard toggles correctly. |

## 4. Accessibility Testing
- **Color Contrast**: Compliant with WCAG AA standards (checked via DevTools).
- **Keyboard Navigation**: All interactive elements are focusable.
- **Screen Reader**: Semantic HTML tags (`<main>`, `<nav>`, `<button>`) used throughout.

## 5. Load Testing (Preliminary)
- **Tool**: Apache Benchmark (`ab`)
- **Target**: `/api/health`
- **Result**: 500 req/sec with <50ms latency.
