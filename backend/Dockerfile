FROM docker.arvancloud.ir/python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    locales \
    cron \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i fa_IR -c -f UTF-8 -A /usr/share/locale/locale.alias fa_IR.UTF-8

# Set environment variables for locale
ENV LANG=fa_IR.utf8
ENV LC_ALL=fa_IR.utf8

# Set work directory
WORKDIR /app

# Install Python dependencies first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy .env file
COPY .env /app/.env

# Copy the backup script
COPY back_db.sh /app/back_db.sh

# Set up cron job (will be handled differently for Windows)
RUN echo "* * * * * /bin/bash /app/back_db.sh" > /etc/cron.d/db_backup \
    && chmod 0744 /etc/cron.d/db_backup \
    && crontab /etc/cron.d/db_backup

# Run the application
CMD ["sh", "-c", "cron && python manage.py runserver 0.0.0.0:8000"]
