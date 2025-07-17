#!/bin/bash
# backup_db.sh
set -euo pipefail

# Configuration
readonly BACKUP_DIR="/backups"
readonly LOG_FILE="/var/log/backup.log"
readonly MAX_BACKUPS=1440  # Keep last 24 hours of backups (1440 minutes)
readonly COMPRESS_LEVEL=6  # 1 (fastest) to 9 (best compression)

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Logging function
log() {
    local level="$1"
    local message="$2"
    local timestamp
    timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}" >&2
}

# Error handling
error_exit() {
    log "ERROR" "$1"
    exit 1
}

# Check if required commands are available
for cmd in pg_dump gzip find xargs; do
    if ! command -v "${cmd}" >/dev/null 2>&1; then
        error_exit "Required command '${cmd}' not found"
    fi
done

# Verify required environment variables
required_vars=("DB_NAME" "DB_USER" "DB_PASSWORD" "DB_HOST")
for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        error_exit "Required environment variable ${var} is not set"
    fi
done

# Generate backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
TEMP_BACKUP="${BACKUP_DIR}/.${DB_NAME}_${TIMESTAMP}.tmp"

log "INFO" "Starting database backup of ${DB_NAME}..."

# Perform the backup with error handling
{
    # Create a temporary file for the backup
    trap 'rm -f "${TEMP_BACKUP}"' EXIT
    
    # Perform the database dump and compress on the fly
    if ! PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -F p \
        --no-owner \
        --no-privileges \
        --no-tablespaces \
        --clean \
        --create \
        --if-exists \
        --verbose 2>&1 | \
        gzip -c -${COMPRESS_LEVEL} > "${TEMP_BACKUP}"
    then
        error_exit "Database dump failed"
    fi
    
    # Verify the backup file
    if [ ! -s "${TEMP_BACKUP}" ]; then
        error_exit "Backup file is empty"
    fi
    
    # Move the temporary file to the final location atomically
    if ! mv -f "${TEMP_BACKUP}" "${BACKUP_FILE}"; then
        error_exit "Failed to move backup file to final location"
    fi
    
    log "INFO" "Backup completed successfully: ${BACKUP_FILE} ($(du -h "${BACKUP_FILE}" | cut -f1))"
    
    # Clean up old backups
    log "INFO" "Cleaning up old backups..."
    if ! cd "${BACKUP_DIR}"; then
        error_exit "Failed to change to backup directory"
    fi
    
    # Find and delete old backups, keeping only the most recent MAX_BACKUPS
    find . -maxdepth 1 -name "${DB_NAME}_*.sql.gz" -type f -printf '%T@ %p\n' | \
        sort -nr | \
        tail -n +$((MAX_BACKUPS + 1)) | \
        while read -r _ file; do
            log "INFO" "Removing old backup: ${file#* }"
            rm -f "${file#* }"
        done
    
    log "INFO" "Backup cleanup completed"
    
} >> "${LOG_FILE}" 2>&1

# Ensure proper permissions on the backup file
chmod 600 "${BACKUP_FILE}" || log "WARNING" "Failed to set permissions on backup file"

# Verify the backup if possible
if command -v gunzip >/dev/null 2>&1 && command -v psql >/dev/null 2>&1; then
    if gunzip -t "${BACKUP_FILE}" >/dev/null 2>&1; then
        log "INFO" "Backup verification: OK"
    else
        log "ERROR" "Backup verification failed: file is corrupted"
        exit 1
    fi
fi

exit 0
