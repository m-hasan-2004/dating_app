# Deployment Guide

This document provides instructions for setting up and deploying the application with proper locale support.

## Prerequisites
- Ubuntu/Debian-based system
- sudo privileges
- Internet access (for initial setup)

## 1. System Setup

### Install Required Packages
```bash
# Update package lists
sudo apt-get update

# Install locales package
sudo apt-get install -y locales
```

### Configure Locale
```bash
# Generate Persian UTF-8 locale
sudo locale-gen fa_IR.UTF-8

# Set the system locale
sudo update-locale LANG=fa_IR.UTF-8

# Apply the new locale configuration
sudo dpkg-reconfigure locales
```

## 2. Using the `super1` Command

The `super1` command is a custom script that helps manage the application. Here's how to use it:

### Basic Usage
```bash
./super1 [command]
```

### Available Commands
- `start`: Start all services
- `stop`: Stop all services
- `restart`: Restart all services
- `status`: Show status of all services
- `logs`: View service logs

### Examples
```bash
# Start all services
./super1 start

# View logs
./super1 logs

# Stop services
./super1 stop
```

## 3. Docker Setup

### Build and Start Containers
```bash
docker-compose up -d --build
```

### Stop and Remove Containers
```bash
docker-compose down
```

## 4. Verifying the Setup

Check if the locale is properly set:
```bash
locale
```

You should see output similar to:
```
LANG=fa_IR.UTF-8
LANGUAGE=
LC_CTYPE="fa_IR.UTF-8"
LC_NUMERIC="fa_IR.UTF-8"
LC_TIME="fa_IR.UTF-8"
...
```

## 5. Troubleshooting

### If locale generation fails:
1. Ensure the `locales` package is installed
2. Verify internet connectivity
3. Check for typos in the locale name
4. Try regenerating the locales:
   ```bash
   sudo locale-gen --purge
   sudo dpkg-reconfigure locales
   ```

### If Docker containers fail to start:
1. Check logs: `docker-compose logs`
2. Verify Docker is running: `sudo systemctl status docker`
3. Check for port conflicts

## 6. Maintenance

### Backing Up Data
```bash
# Backup database
docker exec -t dating_app_db pg_dump -U hasan dating_app > backup_$(date +%Y%m%d).sql

# Backup media files
sudo tar -czvf media_backup_$(date +%Y%m%d).tar.gz /path/to/media
```

### Restoring from Backup
```bash
# Restore database
cat backup_20230718.sql | docker exec -i dating_app_db psql -U hasan dating_app

# Restore media files
sudo tar -xzvf media_backup_20230718.tar.gz -C /
```