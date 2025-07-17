#!/bin/bash
# install_packages.sh
set -euo pipefail

# Function to install system packages with error handling
install_system_packages() {
    local packages="$@"
    local retries=3
    local delay=5

    echo "[INFO] Starting system package installation..."
    
    for ((i=1; i<=retries; i++)); do
        echo "[INFO] Attempt $i of $retries to install system packages: $packages"
        
        # Update package list with retries
        if ! apt-get update; then
            echo "[ERROR] Failed to update package list. Attempt $i of $retries"
            sleep $delay
            continue
        fi

        # Install packages with retries
        if apt-get install -y --no-install-recommends $packages locales; then
            # Generate Persian locale
            echo "[INFO] Generating Persian locale..."
            echo "fa_IR.UTF-8 UTF-8" > /etc/locale.gen
            locale-gen fa_IR.UTF-8
            update-locale LANG=fa_IR.UTF-8 LC_ALL=fa_IR.UTF-8
            echo "[SUCCESS] Successfully installed system packages: $packages"
            return 0
        else
            echo "[ERROR] Failed to install system packages. Attempt $i of $retries"
            sleep $delay
        fi
    done

    echo "[CRITICAL] Failed to install system packages after $retries attempts"
    return 1
}

# Function to install Python packages from requirements.txt
install_python_packages() {
    local requirements_file="$1"
    local retries=3
    local delay=5

    echo "[INFO] Starting Python package installation from $requirements_file..."
    
    for ((i=1; i<=retries; i++)); do
        echo "[INFO] Attempt $i of $retries to install Python packages"
        
        # Install Python packages
        if pip install --no-cache-dir -r "$requirements_file"; then
            echo "[SUCCESS] Successfully installed Python packages from $requirements_file"
            return 0
        else
            echo "[ERROR] Failed to install Python packages. Attempt $i of $retries"
            sleep $delay
        fi
    done

    echo "[CRITICAL] Failed to install Python packages after $retries attempts"
    return 1
}

# Main execution
main() {
    # Install system dependencies
    if ! install_system_packages \
        build-essential \
        gettext \
        libpq-dev \
        postgresql-client \
        cron \
        tzdata; then
        echo "[CRITICAL] Failed to install system dependencies"
        exit 1
    fi

    # Install Python packages from requirements.txt
    if [ -f "requirements.txt" ]; then
        if ! install_python_packages "requirements.txt"; then
            echo "[CRITICAL] Failed to install Python packages from requirements.txt"
            exit 1
        fi
    else
        echo "[WARNING] requirements.txt not found, skipping Python package installation"
    fi

    # Clean up
    if ! rm -rf /var/lib/apt/lists/*; then
        echo "[WARNING] Failed to clean up apt lists"
    fi
}

# Run main function
main "$@"
