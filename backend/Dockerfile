FROM docker.arvancloud.ir/python:3.11-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    locales \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Generate the fa_IR.UTF-8 locale
RUN echo "fa_IR.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen

# Set environment variables for locale
ENV LANG fa_IR.UTF-8
ENV LANGUAGE fa_IR:fa
ENV LC_ALL fa_IR.UTF-8

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

COPY .env /app/.env

# Copy the backup script
COPY back_db.sh /app/back_db.sh

# Set up cron job
RUN echo "0 * * * * /app/back_db.sh" > /etc/cron.d/db_backup
RUN chmod 0744 /etc/cron.d/db_backup
RUN crontab /etc/cron.d/db_backup

# Run the cron service and the application
CMD ["sh", "-c", "cron && python manage.py runserver 0.0.0.0:8000"]
