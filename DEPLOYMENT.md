# Deployment Guide - Contabo Subhosting BDT

This guide explains how to deploy the platform to a Linux VPS (e.g., Contabo).

## 1. Server Preparation
On your Ubuntu/Debian server:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv nginx nodejs npm git -y
```

## 2. Clone and Setup
```bash
git clone <your-repo-url>
cd deployment
```

## 3. Backend Deployment (Django + Gunicorn)
```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Run migrations
poetry run python backend/manage.py migrate

# Collect static files
poetry run python backend/manage.py collectstatic

# Start Gunicorn
poetry run gunicorn --bind 0.0.0.0:8000 backend.core.wsgi
```

## 4. Frontend Deployment (React + Nginx)
```bash
cd frontend
npm install
npm run build
```
The static files will be in `frontend/dist/`.

## 5. Nginx Configuration
Configure Nginx to serve the frontend and proxy the backend:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/deployment/frontend/dist;
        index index.html;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 6. Environment Variables
Make sure to set these in your production environment:
- `DEBUG=False`
- `ALLOWED_HOSTS`
- `SSL_SETTINGS` (Live credentials)
- `CONTABO_API` credentials
- `SMTP` credentials
