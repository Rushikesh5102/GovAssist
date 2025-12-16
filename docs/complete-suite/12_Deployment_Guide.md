# GovAssist AI: Deployment Guide

## 1. Environment Requirements
- **OS**: Linux (Ubuntu 22.04 LTS recommended)
- **CPU**: 2+ Cores
- **RAM**: 4GB+ (for Vector DB and API)
- **Storage**: 20GB+ SSD

## 2. Environment Variables
Create a `.env` file in the root directory:

```ini
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/govassist

# Security
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# LLM & AI
OPENAI_API_KEY=sk-... (or Gemini Key)
HF_TOKEN=hf_...

# Admin
ADMIN_EMAIL=admin@govassist.in
```

## 3. Docker Deployment (Recommended)

### Dockerfile (Backend)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: govassist
      POSTGRES_PASSWORD: password
```

## 4. Manual Deployment (Linux)

### Backend (Systemd)
1.  Create service file: `/etc/systemd/system/govassist-backend.service`
2.  Command: `/path/to/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000`
3.  Enable & Start: `sudo systemctl enable --now govassist-backend`

### Frontend (Nginx)
1.  Build: `npm run build`
2.  Copy `dist/` to `/var/www/govassist`
3.  Configure Nginx to serve static files and proxy `/api` to localhost:8000.

## 5. SSL/HTTPS
- Use **Certbot** (Let's Encrypt) to secure the Nginx endpoint.
    ```bash
    sudo certbot --nginx -d govassist.in
    ```
