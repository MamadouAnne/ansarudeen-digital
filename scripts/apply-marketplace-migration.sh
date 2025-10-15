#!/bin/bash

# Supabase project details
PROJECT_REF="ebpqinieiovvpseneqtl"
ACCESS_TOKEN="sbp_648a39247b21157dcd1ccfb8b956aab22f992e6a"
MIGRATION_FILE="../supabase/migrations/20251015040748_create_marketplace_tables.sql"

echo "Applying marketplace migration to Supabase..."
echo "Project: $PROJECT_REF"

# Read the migration file
MIGRATION_SQL=$(cat "$MIGRATION_FILE")

# Use Supabase Management API to execute SQL
curl -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(jq -Rs . <<< "$MIGRATION_SQL")}"

echo ""
echo "Migration applied!"
