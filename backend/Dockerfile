# Base image DockerFile - Updated to fix script issues
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONPATH=/app \
    # Set locale for Persian support
    LANG=fa_IR.UTF-8 \
    LC_ALL=fa_IR.UTF-8 \
    # Set timezone (change to your timezone if needed)
    TZ=Asia/Tehran \
    # Default settings module
    DJANGO_SETTINGS_MODULE=dating_app.settings \
    # Debug mode (can be overridden in docker-compose)
    DEBUG=1

# Install system dependencies with error handling and retry
RUN echo "[INFO] Starting package installation..." && \
    which apt-get && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gettext \
        libpq-dev \
        postgresql-client \
        cron \
        tzdata \
        locales && \
    echo "[INFO] Generating Persian locale..." && \
    echo "fa_IR.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen fa_IR.UTF-8 && \
    update-locale LANG=fa_IR.UTF-8 LC_ALL=fa_IR.UTF-8 && \
    echo "[SUCCESS] System packages installed successfully" && \
    rm -rf /var/lib/apt/lists/*

# Set timezone
RUN echo "[INFO] Setting timezone to $TZ" && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Set work directory
WORKDIR /app

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN echo "[INFO] Installing Python packages from requirements.txt..." && \
    pip install --no-cache-dir -r requirements.txt && \
    echo "[SUCCESS] Python packages installed successfully" || \
    (echo "[ERROR] Failed to install Python packages. Detailed error log:" && \
     pip install --no-cache-dir -r requirements.txt -v 2>&1 | tee pip_error.log && \
     cat pip_error.log && \
     exit 1)

# Copy project files with error handling
COPY . .

# Copy scripts and make them executable
COPY backup_db.sh /usr/local/bin/backup_db.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN echo "[INFO] Making scripts executable..." && \
    ls -la /usr/local/bin/entrypoint.sh && \
    sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && \
    sed -i 's/\r$//' /usr/local/bin/backup_db.sh && \
    chmod +x /usr/local/bin/backup_db.sh /usr/local/bin/entrypoint.sh || \
    (echo "[ERROR] Failed to make scripts executable" && exit 1)

# Set up cron for backups
RUN echo "[INFO] Setting up cron for backups..." && \
    echo "* * * * * root /usr/local/bin/backup_db.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/backup-cron && \
    echo "0 3 * * * root find /backups -type f -mtime +7 -name '*.sql' -delete" >> /etc/cron.d/backup-cron && \
    chmod 0644 /etc/cron.d/backup-cron && \
    touch /var/log/cron.log || \
    (echo "[ERROR] Failed to set up cron" && exit 1)

# Create necessary directories with error handling
RUN echo "[INFO] Creating necessary directories..." && \
    mkdir -p /app/staticfiles /app/media /backups || \
    (echo "[ERROR] Failed to create directories" && exit 1)

# Set the entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
