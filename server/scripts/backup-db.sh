#!/bin/bash

# Database Backup Script for Contract Assistant
# This script creates a backup of the PostgreSQL database

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Extract database connection details from DATABASE_URL
# Format: postgresql://username:password@host:port/database
DB_URL=$DATABASE_URL

# Parse the DATABASE_URL
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Create backup directory if it doesn't exist
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/contract_assistant_$TIMESTAMP.sql"

echo "Starting database backup..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"

# Create backup using pg_dump
PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "✓ Backup completed successfully!"
  echo "Backup saved to: $BACKUP_FILE"
  
  # Compress the backup
  gzip $BACKUP_FILE
  echo "✓ Backup compressed: ${BACKUP_FILE}.gz"
  
  # Optional: Delete backups older than 30 days
  find $BACKUP_DIR -name "*.sql.gz" -type f -mtime +30 -delete
  echo "✓ Old backups (>30 days) cleaned up"
else
  echo "✗ Backup failed!"
  exit 1
fi
