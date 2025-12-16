# GovAssist AI: Security & Compliance Document

## 1. Data Privacy Policy

### PII Handling
- **Aadhaar/PAN**: GovAssist AI does **not** store full Aadhaar or PAN numbers. If a user enters them, they are masked in the logs (e.g., `XXXX-XXXX-1234`).
- **User Profile**: Personal details (Name, Email, Phone) are stored in the `Users` table and are accessible only to the user and authorized admins.

### Data Retention
- **Chat History**: Retained for user convenience. Users can delete specific sessions.
- **Uploaded Files**: Stored in `data/uploads`. Files are processed and then can be deleted via a retention policy (default: 30 days).

## 2. Access Control (RBAC)

### Roles
1.  **Citizen (Default)**:
    - Can chat, upload files, and view schemes.
    - Cannot access `/admin` routes.
2.  **Admin**:
    - Full access to Dashboard, Scheme Updates, and User Management.
    - Protected by `is_admin` flag in database.

### Authentication
- **JWT (JSON Web Tokens)**: Used for stateless session management.
- **Expiration**: Access tokens expire in 30 minutes. Refresh tokens (if implemented) last 7 days.
- **Password Hashing**: All passwords are hashed using **bcrypt** before storage.

## 3. Infrastructure Security

### Network
- **HTTPS**: All production traffic must be encrypted via TLS 1.2+.
- **CORS**: configured to allow requests only from the frontend domain.

### Secrets Management
- **Environment Variables**: API Keys (OpenAI, DB Credentials) are loaded from `.env` and never committed to version control.
- **GitIgnore**: `.env`, `__pycache__`, and `data/` are ignored.

## 4. Compliance
- **IT Act 2000**: Compliant with Indian IT laws regarding data protection.
- **Digital Personal Data Protection (DPDP) Act**: (Preparedness) Implementing consent managers and data erasure mechanisms.
