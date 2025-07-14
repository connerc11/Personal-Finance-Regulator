@echo off
echo ========================================
echo Personal Finance Regulator - Database Setup
echo ========================================
echo.

echo Checking if PostgreSQL is installed...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo After installation, add PostgreSQL bin folder to your PATH
    pause
    exit /b 1
)

echo PostgreSQL found!
echo.

echo Setting up database...
echo Please enter PostgreSQL superuser password when prompted.
echo.

psql -U postgres -f database-setup.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database setup completed successfully!
    echo ========================================
    echo.
    echo Database: personalfinance_db
    echo Username: personalfinance_user
    echo Password: personalfinance_pass
    echo Host: localhost
    echo Port: 5432
    echo.
    echo You can now start your Spring Boot services.
) else (
    echo.
    echo ========================================
    echo Database setup failed!
    echo ========================================
    echo Please check the error messages above.
)

echo.
echo Press any key to continue...
pause >nul
