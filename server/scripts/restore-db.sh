#!/bin/bash

# Database Restore Script for Contract Assistant
# This script restores the PostgreSQL database from a backup file

set -e

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Usage: ./restore-db.sh <backup-file>"
  echo "Example: ./restore-db.sh ./backups/contract_assistant_20250101_120000.sql.gz"
  exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Extract database connection details from DATABASE_URL
DB_URL=$DATABASE_URL

# Parse the DATABASE_URL
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "WARNING: This will overwrite the existing database!"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

echo "Starting database restore..."

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
  TEMP_FILE="${BACKUP_FILE%.gz}"
  echo "Decompressing backup..."
  gunzip -c $BACKUP_FILE > $TEMP_FILE
  RESTORE_FILE=$TEMP_FILE
else
  RESTORE_FILE=$BACKUP_FILE
fi

# Drop existing database and recreate (optional, use with caution)
echo "Dropping existing database..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Restore backup using psql
echo "Restoring database..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $RESTORE_FILE

if [ $? -eq 0 ]; then
  echo "✓ Database restored successfully!"
  
  # Clean up temporary file
  if [[ $BACKUP_FILE == *.gz ]]; then
    rm $TEMP_FILE
    echo "✓ Temporary file cleaned up"
  fi
else
  echo "✗ Restore failed!"
  exit 1
fi

echo "✓ Restore completed!"
