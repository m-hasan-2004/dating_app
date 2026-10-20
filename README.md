# Dating App - Full-Stack Marriage Matchmaking Platform

A modern, production-grade, bilingual (Persian/English) full-stack marriage matchmaking platform. Built with a **Django 4.2 REST Framework** backend, PostgreSQL database, and a **Next.js 16 (React 19, Tailwind CSS)** frontend, fully containerized with **Docker** and orchestrated using **Docker Compose**.

---

## Table of Contents
1. [Overview & Features](#overview--features)
2. [Quick Start](#quick-start)
3. [Prerequisites](#prerequisites)
4. [Platform-Specific Setup](#platform-specific-setup)
   - [Windows Setup (Docker Desktop & WSL 2)](#windows-setup)
   - [Linux Setup (Ubuntu / Debian / Server)](#linux-setup)
5. [Environment Configuration](#environment-configuration)
6. [Database Initialization](#database-initialization)
7. [First Run Verification](#first-run-verification)
8. [Superuser & Initial Platform Setup](#superuser--initial-platform-setup)
9. [Branding & System Settings Customization](#branding--system-settings-customization)
10. [Development & Update Lifecycle](#development--update-lifecycle)
11. [Offline Image Transfer (Save & Load Docker Tarballs)](#offline-image-transfer-save--load-docker-tarballs)
12. [pgAdmin4 Setup](#pgadmin4-setup)
13. [Translation Management](#translation-management)
14. [Backup and Restore](#backup-and-restore)
15. [Troubleshooting](#troubleshooting)

---

## Overview & Features

- **Public Landing Page & Multi-Page Routes**: Dedicated Home (`/`), About Us (`/about`), Platform Rules & Terms (`/terms`), and Contact Us (`/contact`).
- **Comprehensive Matchmaking Profiles**: Full multi-stage profiling covering Personal, Physical, Intellectual, Faith/Religion, Family, Relatives, and Preferred Spouse Criteria.
- **Access Code Invitation System**: Secure access code validation for invitations, batch code creation, and middle-man tracking.
- **Dynamic Site Branding & Palette System**: Real-time theme customization (Emerald, Purple, Rose, Amber, Indigo, Custom Hex) and logo/favicon management from `/site-settings`.
- **Bilingual & Bidirectional (RTL/LTR)**: Native Persian (RTL) and English (LTR) language support with humanized validation errors.
- **Production-Grade Multi-Stage Docker Setup**:
  - **Backend**: Python 3.11, Django REST Framework, SimpleJWT cookies, PostgreSQL 15, and automated database backups.
  - **Frontend**: Next.js Standalone server with an internal Nginx Alpine reverse proxy for client-side routing, static caching, and direct `/api/` forwarding.

---

## Quick Start

For experienced developers who want to get running quickly from the repository root:

```bash
# 1. Clone repository
git clone <repository-url>
cd dating_app

# 2. Configure Backend Environment
cp backend/.env.example backend/.env

# 3. Launch entire stack via Docker Compose (creates network & volumes automatically)
docker compose up -d --build

# 4. Apply database migrations
docker compose exec web python manage.py migrate

# 5. Create initial administrator (SuperUser)
docker compose exec web python manage.py super1

# 6. Access applications:
# Frontend Portal:   http://localhost:3000
# Backend API:       http://localhost:8000
# Django Admin:      http://localhost:8000/admin
# API Docs (ReDoc):  http://localhost:8000/api/redoc/
# pgAdmin4:          http://localhost:5050
```

---

## Prerequisites

### Required Software
- **Docker Desktop** (Windows) or **Docker Engine & Docker Compose Plugin** (Linux).
- **Git** for version control.
- **Web Browser** (Chrome, Firefox, Edge, etc.).

---

## Platform-Specific Setup

### Windows Setup

1. **Install WSL 2 & Docker Desktop**:
   - Open PowerShell as Administrator and run:
     ```powershell
     wsl --install
     ```
   - Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
   - In Docker Desktop: Navigate to **Settings > General** and verify **Use the WSL 2 based engine** is checked.
   - Go to **Settings > Resources > WSL Integration** and enable your Linux distribution.

2. **Clone & Prepare Project**:
   ```powershell
   git clone <repository-url>
   cd dating_app
   copy backend\.env.example backend\.env
   ```

3. **Run Application**:
   ```powershell
   docker compose up -d --build
   ```

---

### Linux Setup

1. **Install Docker Engine & Compose**:
   ```bash
   # Update apt package index
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg

   # Add Docker official GPG key & repository
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg

   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

   # Grant current user docker permissions
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Clone & Configure**:
   ```bash
   git clone <repository-url>
   cd dating_app
   cp backend/.env.example backend/.env
   ```

3. **Run Application**:
   ```bash
   docker compose up -d --build
   ```

---

## Environment Configuration

The backend reads settings from `backend/.env`. A template is provided at `backend/.env.example`:

```env
# Django Settings
SECRET_KEY="replace-with-a-secure-random-secret-key"
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,web,dating_app_web

# Database Settings (PostgreSQL container defaults)
DB_NAME=dating_app
DB_USER=hasan
DB_PASSWORD=Welcome
DB_HOST=db
DB_PORT=5432

# pgAdmin4 Credentials
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin

# CORS & CSRF Origins (Allow frontend access)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001

# JWT Settings
ACCESS_TOKEN_LIFETIME_MINUTES=15
REFRESH_TOKEN_LIFETIME_DAYS=7
JWT_ALGORITHM=HS256
JWT_AUTH_COOKIE=access_token
JWT_AUTH_REFRESH_COOKIE=refresh_token
JWT_AUTH_COOKIE_SAMESITE=Lax
```

---

## Database Initialization

PostgreSQL initializes automatically from `.env` values on first container boot.

1. **Apply Migrations**:
   ```bash
   docker compose exec web python manage.py migrate
   ```

2. **Collect Static Files**:
   ```bash
   docker compose exec web python manage.py collectstatic --noinput
   ```

3. **Database Reset (Clean Start)**:
   > [!CAUTION]
   > Running these commands deletes all records and volumes.
   ```bash
   docker compose down -v
   docker compose up -d --build
   docker compose exec web python manage.py migrate
   ```

---

## First Run Verification

Check that all containers are healthy and operational:

```bash
docker compose ps
```

You should see 4 active services:
- `dating-app-frontend` (Port `3000:80`)
- `dating_app_web` (Port `8000:8000`)
- `dating_app_db` (Port `5432:5432`)
- `dating_app_pgadmin` (Port `5050:80`)

### Verification Endpoints:
- Frontend Web App: [http://localhost:3000](http://localhost:3000)
- Backend Profile API: [http://localhost:3000/api/users/profile/](http://localhost:3000/api/users/profile/)
- Django Admin: [http://localhost:8000/admin](http://localhost:8000/admin)
- API OpenAPI / Swagger: [http://localhost:8000/api/swagger-ui/](http://localhost:8000/api/swagger-ui/)

---

## Superuser & Initial Platform Setup

To create an administrator account for accessing Django Admin and the Admin Dashboard:

```bash
docker compose exec web python manage.py super1
```
Follow the interactive prompts to define:
- **Username** (e.g., `admin`)
- **Email** (e.g., `admin@example.com`)
- **Password**

Once created:
1. Visit [http://localhost:3000/signin](http://localhost:3000/signin).
2. Log in using your superuser credentials.
3. You will be redirected to the **Admin Dashboard** (`/dashboard`), with full access to User Management, Access Codes generator, and System Settings.

---

## Branding & System Settings Customization

As an administrator, visit [http://localhost:3000/site-settings](http://localhost:3000/site-settings) to configure:
- **Platform Name & Tagline**: Set Persian and English platform titles.
- **Color Palette**: Choose between **Emerald**, **Purple**, **Rose**, **Amber**, **Indigo**, or define a **Custom Hex Color**. The entire UI instantly adapts.
- **Canvas Backgrounds**: Customize light/dark mode canvas colors.
- **Branding Assets**: Upload custom **Logo** and **Favicon** URLs.
- **Registration Rules**: Toggle mandatory access code requirement and email requirements.

---

## Development & Update Lifecycle

When updates are pushed to Git, update any server or local development instance seamlessly with zero state mismatches:

```bash
# 1. Fetch latest changes
git pull origin main

# 2. Stop running containers
docker compose down

# 3. Rebuild and start in background
docker compose up -d --build

# 4. Run any pending database migrations
docker compose exec web python manage.py migrate
```

---

## Frontend Build Modes & Pre-Packaged Offline Artifacts

The frontend Dockerfile supports two flexible compilation workflows:

### Mode 1: Automated In-Docker Build (Default)
Builds the Next.js standalone container inside Docker. It uses Docker BuildKit's persistent npm cache (`/root/.npm`), a Cloudflare edge mirror (`https://registry.yarnpkg.com/`), and tuned network timeouts (10 min) with limited socket concurrency (`maxsockets 3`) to ensure high reliability even on throttled internet connections:
```bash
docker compose up -d --build frontend
```

### Mode 2: Instant Pre-Packaged Artifacts (Zero-Download / Offline)
If your development machine has slow or unstable access to npm registries during Docker builds, compile the Next.js assets on your host machine first:
```powershell
cd frontend

# Step 1: Compile Next.js locally & package standalone assets into build_artifacts.tar.gz
npm run build:docker

# Step 2: Return to root and build the Docker container
cd ..
docker compose up -d --build frontend
```
When Docker detects `build_artifacts.tar.gz`, it bypasses `npm ci` and `next build` entirely, unpacking your pre-packaged standalone server and static assets in **1–2 seconds**.

---

## Offline Image Transfer (Save & Load Docker Tarballs)

If you need to deploy the project onto an air-gapped machine or transfer prebuilt images to another device via USB/local network without pulling from Docker Hub or compiling:

### On Source Machine (Exporting Images):
```bash
# Save frontend, backend, database, and pgAdmin images into tar files
docker save -o dating_app_frontend.tar dating_app_frontend:latest
docker save -o dating_app_backend.tar dating_app_backend:latest
docker save -o postgres_15.tar postgres:15-alpine
docker save -o pgadmin.tar dpage/pgadmin4:latest
```

### On Target Machine (Importing Images):
```bash
# 1. Copy the tar files along with the project repository (or docker-compose.yml and .env) to the target machine

# 2. Import all saved Docker images:
docker load -i dating_app_frontend.tar
docker load -i dating_app_backend.tar
docker load -i postgres_15.tar
docker load -i pgadmin.tar

# 3. Start the entire platform (Docker Compose manages the network automatically):
cd dating_app
docker compose up -d --no-build

# 4. Apply database migrations:
docker compose exec web python manage.py migrate
```

---

## pgAdmin4 Setup

Web-based database administration is available via pgAdmin4:

1. Navigate to [http://localhost:5050](http://localhost:5050).
2. Log in with:
   - **Email**: `admin@example.com` (from `backend/.env`)
   - **Password**: `admin`
3. Add new server connection:
   - Right-click **Servers** > **Register** > **Server...**
   - **General** tab -> Name: `Dating App DB`
   - **Connection** tab:
     - **Host name / address**: `db`
     - **Port**: `5432`
     - **Maintenance database**: `dating_app`
     - **Username**: `hasan`
     - **Password**: `Welcome`
4. Click **Save** to view schemas, tables, and records.

---

## Translation Management

### Compiling Backend Translations (Django)
```bash
docker compose exec web python manage.py compilemessages
docker compose restart web
```

### Updating Backend Messages
```bash
docker compose exec web python manage.py makemessages -l fa
docker compose exec web python manage.py makemessages -l en
docker compose exec web python manage.py compilemessages
```

### Frontend Translations
Frontend translations are managed in JSON dictionaries under `frontend/src/locales/`:
- `fa.json`: Persian translations
- `en.json`: English translations

---

## Backup and Restore

### 1. Web Portal Export & Import (GUI)
Superusers can manage database dumps directly from the Admin Dashboard (**تنظیمات سامانه** / **Site Settings** at `/site-settings`):
- **Export Database**: Download an immediate live dump as `backup.sql`.
- **Import Database**: Upload and restore `backup.sql` or `backup.sql.gz` directly into PostgreSQL with confirmation dialogs.
- **Server Backups Explorer**: Inspect and download automated backup files stored in `/backups/`.

---

### 2. Manual Backup (Using `pg_dump`)

#### Option A: Dump directly via Docker (Recommended)
This runs `pg_dump` directly inside the PostgreSQL container (`dating_app_db`) without needing PostgreSQL client tools installed on your host machine:

- **Linux / macOS / Git Bash:**
  ```bash
  # Plain SQL dump
  docker exec -t dating_app_db pg_dump -U hasan -d dating_app > backup.sql

  # Compressed custom format dump (.dump)
  docker exec -t dating_app_db pg_dump -U hasan -F c -d dating_app > backup.dump

  # Gzip-compressed SQL dump
  docker exec -t dating_app_db pg_dump -U hasan -d dating_app | gzip > backup.sql.gz
  ```

- **Windows PowerShell:**
  ```powershell
  # Plain SQL dump (UTF-8 encoded)
  docker exec -i dating_app_db pg_dump -U hasan -d dating_app | Out-File -Encoding utf8 backup.sql

  # Or dump inside the container volume and copy to host:
  docker exec -it dating_app_db sh -c "pg_dump -U hasan -d dating_app > /backups/backup.sql"
  docker cp dating_app_db:/backups/backup.sql ./backup.sql
  ```

#### Option B: Dump from Host (Direct Connection)
If PostgreSQL client tools are installed locally on your host machine (port `5432` is mapped to host):

- **Linux / macOS:**
  ```bash
  PGPASSWORD=Welcome pg_dump -h localhost -p 5432 -U hasan -d dating_app -f backup.sql
  ```

- **Windows PowerShell:**
  ```powershell
  $env:PGPASSWORD="Welcome"; pg_dump -h localhost -p 5432 -U hasan -d dating_app -f backup.sql
  ```

---

### 3. Restore from Backup (Using `psql` / `pg_restore`)

#### Step 1: Clean Reset / Recreate Database (Recommended before full restore)
To avoid duplicate key errors, foreign key constraints, or leftover table conflicts, cleanly recreate the database before restoring:

```bash
# Terminate existing connections to dating_app
docker exec -i dating_app_db psql -U hasan -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'dating_app' AND pid <> pg_backend_pid();"

# Drop and recreate dating_app database
docker exec -i dating_app_db psql -U hasan -d postgres -c "DROP DATABASE IF EXISTS dating_app;"
docker exec -i dating_app_db psql -U hasan -d postgres -c "CREATE DATABASE dating_app OWNER hasan ENCODING 'UTF8';"
```

#### Step 2: Restore the Dump

##### Method A: Stream directly into Docker container

- **Linux / macOS / Git Bash:**
  ```bash
  # Plain SQL file
  docker exec -i dating_app_db psql -U hasan -d dating_app < backup.sql

  # Gzip-compressed SQL file (.sql.gz)
  gunzip -c backup.sql.gz | docker exec -i dating_app_db psql -U hasan -d dating_app
  ```

- **Windows PowerShell:**
  ```powershell
  # Plain SQL file
  Get-Content backup.sql | docker exec -i dating_app_db psql -U hasan -d dating_app
  ```

##### Method B: Copy into container and execute

```bash
# 1. Copy the backup file into the container
docker cp ./backup.sql dating_app_db:/tmp/backup.sql

# 2. Execute restore with psql
docker exec -it dating_app_db psql -U hasan -d dating_app -f /tmp/backup.sql

# 3. Clean up temporary file
docker exec -it dating_app_db rm /tmp/backup.sql
```

##### Method C: Custom Binary Format (`.dump`) using `pg_restore`

```bash
docker cp ./backup.dump dating_app_db:/tmp/backup.dump
docker exec -it dating_app_db pg_restore -U hasan -d dating_app --clean --if-exists /tmp/backup.dump
docker exec -it dating_app_db rm /tmp/backup.dump
```

##### Method D: From Host via local `psql`

- **Linux / macOS:**
  ```bash
  PGPASSWORD=Welcome psql -h localhost -p 5432 -U hasan -d dating_app -f backup.sql
  ```

- **Windows PowerShell:**
  ```powershell
  $env:PGPASSWORD="Welcome"; psql -h localhost -p 5432 -U hasan -d dating_app -f backup.sql
  ```

---

### 4. Database Connection Details

| Parameter | Value | Description |
|---|---|---|
| **Host (from Host OS)** | `localhost` / `127.0.0.1` | Port `5432` mapped to host |
| **Host (inside Docker)** | `db` | Docker internal network service name |
| **Port** | `5432` | Standard PostgreSQL port |
| **Database Name** | `dating_app` | Default database |
| **Username** | `hasan` | Default database user |
| **Password** | `Welcome` | Defined in `docker-compose.yml` / `.env` |
| **Container Name** | `dating_app_db` | PostgreSQL 15 container |
| **Shared Backups Volume** | `/backups/` | Volume `dating_app_backups` |

---

## Troubleshooting

### 1. Port 3000 or 8000 Already in Use
Check which process is using the port:
- **Windows (PowerShell)**:
  ```powershell
  Get-NetTCPConnection -LocalPort 3000
  ```
- **Linux**:
  ```bash
  sudo lsof -i :3000
  ```
To map the frontend to another port (e.g., 3002), specify `FRONTEND_PORT` when running:
```bash
FRONTEND_PORT=3002 docker compose up -d
```

### 2. Container Name or Network Conflict
If you encounter `container name conflict` or want a clean restart:
```bash
docker compose down
docker compose up -d
```

### 3. Inspect Container Logs
```bash
# Frontend logs
docker logs -f dating-app-frontend

# Backend web logs
docker logs -f dating_app_web

# Database logs
docker logs -f dating_app_db
```
