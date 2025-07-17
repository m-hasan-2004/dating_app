#!/bin/bash
# entrypoint.sh
set -e

# Function to log messages with timestamps
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${1:-INFO}] $2"
}

# Function to display error messages and exit
error_exit() {
    log "ERROR" "${1}"
    exit 1
}

# Function to check if PostgreSQL is ready
wait_for_db() {
    log "INFO" "Waiting for PostgreSQL to be ready..."
    local attempt=1
    local max_attempts=30
    
    until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' >/dev/null 2>&1; do
        log "INFO" "Waiting for PostgreSQL... (Attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
        if [ $attempt -gt $max_attempts ]; then
            log "ERROR" "PostgreSQL is not ready after $max_attempts attempts. Exiting."
            exit 1
        fi
    done
    log "INFO" "PostgreSQL is ready"
}

# Function to check if database exists
check_database() {
    log "INFO" "Checking if database exists..."
    if ! PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        log "INFO" "Database does not exist, creating..."
        PGPASSWORD=$DB_PASSWORD createdb -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" || {
            log "ERROR" "Failed to create database"
            exit 1
        }
    fi
}

# Main function
main() {
    # Set default Django settings module if not set
    export DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE:-"dating_app.settings"}
    
    # Wait for PostgreSQL
    wait_for_db
    
    # Check and create database if needed
    check_database

    # Apply database migrations
    log "INFO" "Applying database migrations..."
    python manage.py migrate --noinput || error_exit "Failed to apply migrations"

    # Create cache table
    log "INFO" "Creating cache table..."
    python manage.py createcachetable || log "WARNING" "Failed to create cache table"

    # Collect static files
    log "INFO" "Collecting static files..."
    python manage.py collectstatic --noinput --clear || log "WARNING" "Failed to collect static files"

    # Start the application
    log "INFO" "Starting application..."
    exec "$@"
}

# Run the main function
main "$@"
