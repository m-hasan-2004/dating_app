#!/bin/sh
set -e

echo "Starting Next.js standalone server on port 3000..."
node /app/server.js &

# Wait briefly for Next.js to start listening
while ! nc -z 127.0.0.1 3000; do
  sleep 0.1
done
echo "Next.js standalone server is active and listening on 127.0.0.1:3000."

echo "Starting Nginx frontend gateway..."
exec nginx -g "daemon off;"
