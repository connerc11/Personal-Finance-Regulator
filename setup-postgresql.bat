@echo off
echo ========================================
echo PostgreSQL Database Setup
echo ========================================
echo.

echo Checking PostgreSQL installation...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL not found. 
    echo.
    echo STEP 1: Install PostgreSQL
    echo ========================
    echo 1. Go to: https://www.postgresql.org/download/windows/
    echo 2. Download PostgreSQL 15 or later
    echo 3. Run the installer
    echo 4. During installation:
    echo    - Remember the postgres user password
    echo    - Check "Add PostgreSQL to PATH"
    echo    - Install pgAdmin (recommended)
    echo 5. After installation, restart this script
    echo.
    echo Press any key to open the download page...
    pause >nul
    start https://www.postgresql.org/download/windows/
    exit /b 1
)

echo PostgreSQL found! Setting up database...
echo.
echo Please enter your PostgreSQL superuser (postgres) password when prompted.
echo.

psql -U postgres -f database-setup.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database setup successful!
    echo ========================================
    echo.
    echo Database Details:
    echo - Host: localhost
    echo - Port: 5432
    echo - Database: personalfinance_db
    echo - Username: personalfinance_user
    echo - Password: personalfinance_pass
    echo.
    echo Your database is ready for the Personal Finance Regulator!
    echo.
) else (
    echo.
    echo ========================================
    echo Database setup failed!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Wrong postgres password
    echo 2. PostgreSQL service not running
    echo 3. Firewall blocking connection
    echo.
    echo Try running: services.msc and start "postgresql" service
)

echo.
echo Press any key to continue...
pause >nul
