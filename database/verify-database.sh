#!/bin/bash

# =============================================================================
# Bsissa Database Verification Script
# =============================================================================
# This script verifies the database installation and provides detailed stats
# Usage: ./verify-database.sh [database_name] [mysql_user] [mysql_password]
# =============================================================================

DB_NAME="${1:-bsissa}"
DB_USER="${2:-root}"
DB_PASSWORD="${3:-}"
DB_HOST="${4:-localhost}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

execute_mysql() {
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -u "$DB_USER" "$@" 2>/dev/null
    else
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$@" 2>/dev/null
    fi
}

echo -e "${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Bsissa Database Verification Report          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# Check connection
echo -e "${YELLOW}🔌 Testing MySQL Connection...${NC}"
if ! execute_mysql -e "SELECT 1" > /dev/null; then
    echo -e "${RED}✗ Cannot connect to MySQL${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MySQL connection successful${NC}"
echo ""

# Check if database exists
echo -e "${YELLOW}🗄️  Checking Database '${DB_NAME}'...${NC}"
DB_EXISTS=$(execute_mysql -N -e "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='${DB_NAME}'")
if [ -z "$DB_EXISTS" ]; then
    echo -e "${RED}✗ Database '${DB_NAME}' does not exist${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Database '${DB_NAME}' found${NC}"
echo ""

# Get table count
echo -e "${YELLOW}📊 Database Statistics:${NC}"
TABLE_COUNT=$(execute_mysql -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_NAME}'")
echo -e "   Total Tables: ${GREEN}${TABLE_COUNT}${NC}"

# List all tables
echo ""
echo -e "${YELLOW}📋 Tables Found:${NC}"
execute_mysql -N -e "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema='${DB_NAME}' ORDER BY TABLE_NAME" | while read table; do
    ROW_COUNT=$(execute_mysql -N -e "SELECT COUNT(*) FROM \`${DB_NAME}\`.\`${table}\`")
    echo -e "   ${GREEN}✓${NC} ${table} (${ROW_COUNT} rows)"
done

# Check foreign keys
echo ""
echo -e "${YELLOW}🔗 Foreign Key Constraints:${NC}"
FK_COUNT=$(execute_mysql -N -e "SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA='${DB_NAME}' AND CONSTRAINT_TYPE='FOREIGN KEY'")
echo -e "   Total Foreign Keys: ${GREEN}${FK_COUNT}${NC}"

# Check indexes
echo ""
echo -e "${YELLOW}🔍 Indexes:${NC}"
INDEX_COUNT=$(execute_mysql -N -e "SELECT COUNT(DISTINCT INDEX_NAME) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA='${DB_NAME}' AND INDEX_NAME != 'PRIMARY'")
echo -e "   Total Indexes: ${GREEN}${INDEX_COUNT}${NC}"

# Database size
echo ""
echo -e "${YELLOW}💾 Storage Information:${NC}"
DB_SIZE=$(execute_mysql -N -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) FROM information_schema.tables WHERE table_schema='${DB_NAME}'")
echo -e "   Database Size: ${GREEN}${DB_SIZE} MB${NC}"

# Check Laravel migrations table
echo ""
echo -e "${YELLOW}🔄 Laravel Migration Status:${NC}"
MIGRATION_TABLE=$(execute_mysql -N -e "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema='${DB_NAME}' AND TABLE_NAME='migrations'")
if [ -n "$MIGRATION_TABLE" ]; then
    MIGRATION_COUNT=$(execute_mysql -N -e "SELECT COUNT(*) FROM \`${DB_NAME}\`.migrations")
    echo -e "   Migrations Table: ${GREEN}✓ Found${NC}"
    echo -e "   Migrations Run: ${GREEN}${MIGRATION_COUNT}${NC}"
else
    echo -e "   Migrations Table: ${YELLOW}⚠ Not found${NC}"
    echo -e "   ${BLUE}(Run 'php artisan migrate' to create Laravel migration tracking)${NC}"
fi

# Check for required core tables
echo ""
echo -e "${YELLOW}✅ Core Tables Verification:${NC}"
REQUIRED_TABLES=("users" "products" "categories" "orders" "cart_items" "invoices")
for table in "${REQUIRED_TABLES[@]}"; do
    if execute_mysql -N -e "SELECT 1 FROM information_schema.tables WHERE table_schema='${DB_NAME}' AND TABLE_NAME='${table}'" > /dev/null; then
        echo -e "   ${GREEN}✓${NC} ${table}"
    else
        echo -e "   ${RED}✗${NC} ${table} (missing)"
    fi
done

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Verification Complete!                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# Recommendations
if [ "$TABLE_COUNT" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Warning: Expected 18 tables, found ${TABLE_COUNT}${NC}"
    echo -e "${YELLOW}   Consider re-running the setup script${NC}"
    echo ""
fi

echo -e "${GREEN}Next Steps:${NC}"
echo -e "1. Update your .env file with these credentials"
echo -e "2. Run: ${BLUE}php artisan config:clear${NC}"
echo -e "3. Test connection: ${BLUE}php artisan tinker${NC}"
echo -e "   ${BLUE}>>> DB::connection()->getPdo();${NC}"
echo ""
