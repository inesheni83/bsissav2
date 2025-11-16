#!/bin/bash

# =============================================================================
# Bsissa Database Setup Script
# =============================================================================
# This script creates the complete database schema for the Bsissa application
# Usage: ./setup-database.sh [database_name] [mysql_user] [mysql_password] [mysql_host]
# =============================================================================

# Default values
DB_NAME="${1:-bsissa}"
DB_USER="${2:-root}"
DB_PASSWORD="${3:-}"
DB_HOST="${4:-localhost}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Bsissa Database Setup Script                 ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# Function to execute MySQL command
execute_mysql() {
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -u "$DB_USER" "$@"
    else
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$@"
    fi
}

# Check if MySQL is accessible
echo -e "${YELLOW}[1/4]${NC} Checking MySQL connection..."
if ! execute_mysql -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}✗ Error: Cannot connect to MySQL server${NC}"
    echo -e "${YELLOW}Please check your credentials and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MySQL connection successful${NC}"

# Create database if it doesn't exist
echo -e "${YELLOW}[2/4]${NC} Creating database '${DB_NAME}'..."
execute_mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '${DB_NAME}' created or already exists${NC}"
else
    echo -e "${RED}✗ Error creating database${NC}"
    exit 1
fi

# Import schema
echo -e "${YELLOW}[3/4]${NC} Importing database schema..."
if [ ! -f "database/schema.sql" ]; then
    echo -e "${RED}✗ Error: schema.sql not found in database/ directory${NC}"
    exit 1
fi

execute_mysql "$DB_NAME" < database/schema.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Schema imported successfully${NC}"
else
    echo -e "${RED}✗ Error importing schema${NC}"
    exit 1
fi

# Count tables
echo -e "${YELLOW}[4/4]${NC} Verifying installation..."
TABLE_COUNT=$(execute_mysql -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_NAME}'" 2>/dev/null)
echo -e "${GREEN}✓ Installation complete: ${TABLE_COUNT} tables created${NC}"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Database Setup Successful!              ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Database Name: ${GREEN}${DB_NAME}${NC}"
echo -e "Total Tables:  ${GREEN}${TABLE_COUNT}${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Update your ${GREEN}.env${NC} file with database credentials"
echo -e "2. Run ${GREEN}php artisan migrate:status${NC} to verify migrations"
echo -e "3. (Optional) Run ${GREEN}php artisan db:seed${NC} to populate with sample data"
echo ""
