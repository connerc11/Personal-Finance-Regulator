@echo off
echo ========================================
echo Personal Finance - Quick Database Setup
echo ========================================

echo Setting up PostgreSQL database...

REM Set PostgreSQL password
set PGPASSWORD=admin

REM Check if psql is available
"C:\Program Files\PostgreSQL\17\bin\psql.exe" --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: PostgreSQL not found in C:\Program Files\PostgreSQL\17\bin\
    echo Please check your PostgreSQL installation
    pause
    exit /b 1
)

echo Creating database and user...

REM Create database and user
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -U postgres -d postgres -c "DROP DATABASE IF EXISTS personalfinance_db;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -U postgres -d postgres -c "DROP USER IF EXISTS personalfinance_user;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -U postgres -d postgres -c "CREATE USER personalfinance_user WITH PASSWORD 'personalfinance_pass';"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -U postgres -d postgres -c "CREATE DATABASE personalfinance_db OWNER personalfinance_user;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE personalfinance_db TO personalfinance_user;"

echo ========================================
echo Database setup complete!
echo Database: personalfinance_db  
echo User: personalfinance_user
echo Password: personalfinance_pass
echo ========================================
pause
