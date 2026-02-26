# Dating App Development Setup Guide

This comprehensive guide helps you set up the Dating App development environment on any device (Windows/Linux/macOS) using Docker containers.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Platform-Specific Setup](#platform-specific-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Initialization](#database-initialization)
6. [First Run Verification](#first-run-verification)
7. [Development Workflow](#development-workflow)
8. [Backup and Restore](#backup-and-restore)
9. [Troubleshooting](#troubleshooting)

## Quick Start

For experienced developers who want to get running quickly:

```bash
# 1. Clone the repository
git clone <repository-url>
cd dating_app/backend

# 2. Copy environment file
cp .env.example .env

# 3. Start the application
# PostgreSQL automatically creates database/user from .env
docker-compose up -d --build

# 4. Run Django migrations only
docker-compose exec web python manage.py migrate

# 5. Create superuser (optional)
docker-compose exec web python manage.py createsuperuser

# 6. Access the application
# Web app: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# pgAdmin4: http://localhost:5050
```

## Prerequisites

### Required Software
- **Docker Desktop** (Windows/macOS) or **Docker Engine** (Linux)
- **Git** for version control
- **VS Code** or preferred code editor (optional)

### Docker Installation

#### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer with WSL 2 backend
3. Restart your computer
4. Verify installation: `docker --version`

#### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Restart and verify
newgrp docker
docker --version
```

#### macOS
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install the .dmg file
3. Start Docker Desktop from Applications
4. Verify installation: `docker --version`

## Platform-Specific Setup

### Windows Development

1. **Enable WSL 2** (if not already enabled):
   ```powershell
   wsl --install
   ```

2. **Configure Docker Desktop**:
   - Open Docker Desktop
   - Go to Settings > Resources > WSL Integration
   - Enable your WSL distribution

3. **Clone and Setup**:
   ```powershell
   git clone <repository-url>
   cd dating_app/backend
   copy .env.example .env
   ```

4. **Start Development**:
   ```powershell
   docker-compose up -d --build
   ```

### Linux Development

1. **Install Dependencies**:
   ```bash
   sudo apt-get update
   sudo apt-get install git docker.io docker-compose
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd dating_app/backend
   cp .env.example .env
   ```

3. **Start Development**:
   ```bash
   docker-compose up -d --build
   ```

### macOS Development

1. **Install Docker Desktop** (see Prerequisites)

2. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd dating_app/backend
   cp .env.example .env
   ```

3. **Start Development**:
   ```bash
   docker-compose up -d --build
   ```

## Environment Configuration

### Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Django Settings
SECRET_KEY="your-secret-key-here"

# Database Settings (Docker defaults work out-of-the-box)
DB_NAME=dating_app
DB_USER=hasan
DB_PASSWORD=Welcome
DB_HOST=db
DB_PORT=5432

# pgAdmin4 Settings
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin

# Other Settings
COMPOSE_BAKE=true
```

### Important Notes
- **DB_HOST=db** is required for Docker networking
- Default credentials work for development
- Change SECRET_KEY for production
- Database data persists in Docker volumes
- pgAdmin4 provides web-based database management

### PostgreSQL Auto-Setup

The PostgreSQL Docker container automatically creates the database and user based on your .env file:

- **Database**: Created with name from `DB_NAME` (defaults to "dating_app")
- **User**: Created with name from `DB_USER` (defaults to "hasan") 
- **Password**: Set from `DB_PASSWORD` (defaults to "Welcome")
- **Permissions**: User automatically gets ownership of the database

No manual database creation is required - the Docker container handles everything on first startup.

## Database Initialization

### First Time Setup

1. **Start Containers**:
   ```bash
   docker-compose up -d
   ```
   # PostgreSQL automatically creates database and user from .env

2. **Wait for Database Ready**:
   ```bash
   docker-compose logs db | grep "database system is ready to accept connections"
   ```

3. **Run Migrations**:
   ```bash
   docker-compose exec web python manage.py migrate
   ```

4. **Create Superuser** (optional):
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

5. **Collect Static Files**:
   ```bash
   docker-compose exec web python manage.py collectstatic --noinput
   ```

### Database Reset (if needed)

```bash
# Stop containers
docker-compose down

# Remove database volume (WARNING: deletes all data)
docker volume rm dating_app_postgres_data

# Restart with fresh database
docker-compose up -d --build

# Run migrations
docker-compose exec web python manage.py migrate
```

## First Run Verification

### Health Checks

1. **Check Container Status**:
   ```bash
   docker-compose ps
   ```

2. **Check Application Logs**:
   ```bash
   docker-compose logs web
   ```

3. **Check Database Logs**:
   ```bash
   docker-compose logs db
   ```

### Access Points

- **Web Application**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/docs
- **pgAdmin4**: http://localhost:5050
- **Database**: localhost:5432 (for external tools)

### Test Functionality

1. **Web Interface**:
   - Open http://localhost:8000
   - Verify Persian/English language switching
   - Test navigation and functionality

2. **Admin Panel**:
   - Login with superuser credentials
   - Verify Persian locale support
   - Test model administration

3. **API Endpoints**:
   - Visit http://localhost:8000/api/docs
   - Test API functionality

4. **pgAdmin4 Database Management**:
   - Open http://localhost:5050
   - Login with admin@example.com / admin
   - Add new server connection:
     - Host: `db`
     - Port: `5432`
     - Database: `dating_app`
     - Username: `hasan`
     - Password: `Welcome`

## Development Workflow

### Daily Development Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop environment
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Access Django shell
docker-compose exec web python manage.py shell

# Run tests
docker-compose exec web python manage.py test

# Create new migrations
docker-compose exec web python manage.py makemigrations
```

### Code Hot Reload

The application automatically reloads when you change Python files. For other changes:

```bash
# Restart web container only
docker-compose restart web

# View real-time logs
docker-compose logs -f web
```

### Database Operations

```bash
# Create migrations
docker-compose exec web python manage.py makemigrations

# Apply migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Access database directly
docker-compose exec db psql -U hasan -d dating_app
```

## Backup and Restore

### Automated Backups

Backups are created automatically every minute via cron jobs inside the container.

### Manual Backup

```bash
# Create backup
docker-compose exec web /usr/local/bin/backup_db.sh

# List backups
docker-compose exec web ls -la /backups/

# Copy backup to host
docker cp dating_app_web:/backups/dating_app_20231201_120000.sql.gz ./
```

### Restore from Backup

```bash
# Copy backup to container
docker cp ./backup.sql.gz dating_app_web:/backups/

# Restore database
docker-compose exec web bash -c "gunzip -c /backups/backup.sql.gz | psql -h db -U hasan -d dating_app"
```

### Backup Locations

- **Container Path**: `/backups/`
- **Host Volume**: `dating_app_backups` Docker volume
- **Retention**: Last 24 hours of backups (1440 minutes)

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database container status
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

**Note**: PostgreSQL automatically creates database and user from .env on first startup. If connection fails, verify your .env file contains correct DB_NAME, DB_USER, and DB_PASSWORD values.

#### 2. Application Won't Start
```bash
# Check web container logs
docker-compose logs web

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

#### 3. Volume Permission Issues (Linux)
```bash
# Fix volume permissions
sudo chown -R $USER:$USER .

# Restart containers
docker-compose down
docker-compose up -d
```

#### 4. Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :8000
netstat -tulpn | grep :5432

# Change ports in docker-compose.yml if needed
```

#### 5. Docker Issues
```bash
# Reset Docker (Windows/macOS)
# Use Docker Desktop "Reset to factory settings"

# Reset Docker (Linux)
sudo systemctl stop docker
sudo systemctl start docker
```

### Performance Issues

#### Slow Database Performance
```bash
# Check database connections
docker-compose exec db psql -U hasan -d dating_app -c "SELECT count(*) FROM pg_stat_activity;"

# Restart database container
docker-compose restart db
```

#### Out of Memory Issues
```bash
# Check container resource usage
docker stats

# Increase Docker memory allocation in Docker Desktop settings
```

#### 6. pgAdmin4 Issues

```bash
# Check pgAdmin4 container status
docker-compose ps pgadmin

# Check pgAdmin4 logs
docker-compose logs pgadmin

# Restart pgAdmin4
docker-compose restart pgadmin

# Reset pgAdmin4 data (WARNING: loses all settings)
docker volume rm dating_app_pgadmin_data
```

### Getting Help

1. **Check Logs First**:
   ```bash
   docker-compose logs web
   docker-compose logs db
   docker-compose logs pgadmin
   ```

2. **Verify Environment**:
   ```bash
   docker-compose config
   ```

3. **Clean Restart**:
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

4. **Community Support**:
   - Check GitHub Issues
   - Review Docker documentation
   - Consult Django documentation

## Translation Management

### Compiling Translations

To compile Persian translations after making changes:

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Compile translation files
python manage.py compilemessages

# Restart the application to apply changes
docker-compose restart web
```

### Creating New Translation Files

To create new translation files or update existing ones:

```bash
# Extract translatable strings from Python and templates
python manage.py makemessages -l fa

# For new languages, specify the language code
python manage.py makemessages -l en

# After editing .po files, compile them
python manage.py compilemessages
```

### Translation File Locations

- Translation files are located in: `locale/fa/LC_MESSAGES/django.po`
- Compiled translations: `locale/fa/LC_MESSAGES/django.mo`
- Django admin translations are automatically included

### Common Translation Issues

1. **Missing .mo files**: Run `python manage.py compilemessages`
2. **Partial translations**: Some strings may not be translated in Django admin
3. **RTL layout**: Persian requires proper CSS for right-to-left layout
4. **Font issues**: Ensure fonts support Persian characters

### Docker Translation Updates

When running in Docker, you can compile translations without rebuilding:

```bash
# Execute in the running container
docker exec -it dating_app_web python manage.py compilemessages
docker-compose restart web
```

## Production Deployment

This setup is optimized for development. For production deployment, consider:

1. **Security**: Change default passwords and secrets
2. **Performance**: Use production-grade database settings
3. **Monitoring**: Add health checks and logging
4. **Scaling**: Consider container orchestration
5. **HTTPS**: Configure SSL certificates
6. **pgAdmin4**: Consider disabling or securing pgAdmin4 in production

## Legacy Linux Setup (Reference)

For reference, here's the original Linux setup with local PostgreSQL:

### System Setup (Linux Only)

```bash
# Install required packages
sudo apt-get update
sudo apt-get install -y locales

# Configure Persian locale
sudo locale-gen fa_IR.UTF-8
sudo update-locale LANG=fa_IR.UTF-8
sudo dpkg-reconfigure locales
```

### Using the `super1` Command (Linux Only)

The `super1` command was used for Linux-based service management:

```bash
./super1 start    # Start all services
./super1 stop     # Stop all services
./super1 restart  # Restart all services
./super1 status   # Show status of all services
./super1 logs     # View service logs
```

## Next Steps

After successful setup:

1. Explore the codebase structure
2. Review the Django models in `core/models.py`
3. Check API documentation at `/api/docs`
4. Customize the application for your needs
5. Set up your development workflow

Happy coding! 🚀
