#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===========================================${NC}"
echo -e "${YELLOW}   Marketplace Migration Script${NC}"
echo -e "${YELLOW}===========================================${NC}\n"

# Supabase project details
PROJECT_REF="ebpqinieiovvpseneqtl"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
MIGRATION_FILE="supabase/migrations/20251015040748_create_marketplace_tables.sql"

echo -e "${YELLOW}Project:${NC} $PROJECT_REF"
echo -e "${YELLOW}Migration File:${NC} $MIGRATION_FILE\n"

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}Error: Migration file not found at $MIGRATION_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Migration file found\n"

# Read the SQL migration
SQL_CONTENT=$(cat "$MIGRATION_FILE")

echo -e "${YELLOW}Please enter your Supabase database password:${NC}"
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: Database password is required${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Connecting to Supabase database...${NC}\n"

# Connection string
DB_HOST="aws-0-us-east-2.pooler.supabase.com"
DB_PORT="6543"
DB_NAME="postgres"
DB_USER="postgres.${PROJECT_REF}"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql is not installed.${NC}"
    echo -e "${YELLOW}Please install PostgreSQL client:${NC}"
    echo -e "  macOS: brew install postgresql"
    echo -e "  Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# Run the migration
echo -e "${YELLOW}Running migration...${NC}\n"

PGPASSWORD="$DB_PASSWORD" psql \
    "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
    -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Migration completed successfully!${NC}\n"

    # Verify the data
    echo -e "${YELLOW}Verifying marketplace items...${NC}\n"

    VERIFY_SQL="SELECT COUNT(*) as item_count FROM marketplace_items;"

    PGPASSWORD="$DB_PASSWORD" psql \
        "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require" \
        -c "$VERIFY_SQL"

    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ Verification complete!${NC}\n"
    fi
else
    echo -e "\n${RED}✗ Migration failed. Please check the error messages above.${NC}\n"
    exit 1
fi

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}   Migration Complete!${NC}"
echo -e "${GREEN}===========================================${NC}\n"
