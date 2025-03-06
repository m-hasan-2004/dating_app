#!/bin/bash

# Load environment variables using dotenv
eval $(dotenv -f /app/.env list)

# Set environment variables
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
BACKUP_DIR="/mnt/backup"  # Adjusted to use the Docker volume
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Export PostgreSQL password so pg_dump doesn't ask for it
export PGPASSWORD=$DB_PASSWORD

# Backup the PostgreSQL database
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE

# Log the backup status
echo "Backup completed at $TIMESTAMP"
