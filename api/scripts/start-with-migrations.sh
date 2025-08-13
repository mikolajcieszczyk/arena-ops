#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Run migrations
echo "Running database migrations..."
yarn migration:run

# Start the application
echo "Starting the application..."
yarn start:dev
