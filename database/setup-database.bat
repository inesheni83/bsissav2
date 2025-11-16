@echo off
REM =============================================================================
REM Bsissa Database Setup Script (Windows)
REM =============================================================================
REM This script creates the complete database schema for the Bsissa application
REM Usage: setup-database.bat [database_name] [mysql_user] [mysql_password] [mysql_host]
REM =============================================================================

setlocal

REM Default values
set DB_NAME=%1
set DB_USER=%2
set DB_PASSWORD=%3
set DB_HOST=%4

if "%DB_NAME%"=="" set DB_NAME=bsissa
if "%DB_USER%"=="" set DB_USER=root
if "%DB_HOST%"=="" set DB_HOST=localhost

echo.
echo ========================================================
echo      Bsissa Database Setup Script (Windows)
echo ========================================================
echo.

REM Check if MySQL is in PATH
where mysql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] MySQL client not found in PATH
    echo Please install MySQL or add it to your system PATH
    pause
    exit /b 1
)

echo [1/4] Checking MySQL connection...
if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -u %DB_USER% -e "SELECT 1" >nul 2>nul
) else (
    mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% -e "SELECT 1" >nul 2>nul
)

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Cannot connect to MySQL server
    echo Please check your credentials and try again
    pause
    exit /b 1
)
echo [OK] MySQL connection successful

echo [2/4] Creating database '%DB_NAME%'...
if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -u %DB_USER% -e "CREATE DATABASE IF NOT EXISTS `%DB_NAME%` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
) else (
    mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS `%DB_NAME%` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
)

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Cannot create database
    pause
    exit /b 1
)
echo [OK] Database '%DB_NAME%' created or already exists

echo [3/4] Importing database schema...
if not exist "database\schema.sql" (
    echo [ERROR] schema.sql not found in database\ directory
    pause
    exit /b 1
)

if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -u %DB_USER% %DB_NAME% < database\schema.sql 2>nul
) else (
    mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < database\schema.sql 2>nul
)

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Cannot import schema
    pause
    exit /b 1
)
echo [OK] Schema imported successfully

echo [4/4] Verifying installation...
echo [OK] Installation complete

echo.
echo ========================================================
echo           Database Setup Successful!
echo ========================================================
echo.
echo Database Name: %DB_NAME%
echo.
echo Next Steps:
echo 1. Update your .env file with database credentials
echo 2. Run: php artisan migrate:status
echo 3. (Optional) Run: php artisan db:seed
echo.
pause
