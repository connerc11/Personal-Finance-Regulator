@echo off
echo ========================================
echo Starting Personal Finance Regulator with PostgreSQL
echo ========================================
echo.

echo Checking PostgreSQL connection...
psql -U personalfinance_user -d personalfinance_db -c "SELECT 1;" >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Cannot connect to PostgreSQL database!
    echo.
    echo Please run: setup-postgresql.bat first
    echo.
    pause
    exit /b 1
)

echo ✓ PostgreSQL database connected!
echo.

echo Building all services...
mvn clean install -q

if %errorlevel% neq 0 (
    echo ✗ Build failed! Please check the error messages.
    pause
    exit /b 1
)

echo ✓ Build successful!
echo.

echo Starting services with PostgreSQL (production mode)...
echo.

echo Starting User Service on port 8081...
start "User Service" cmd /c "cd user-service && mvn spring-boot:run -Dspring.profiles.active=prod"
timeout /t 10 /nobreak >nul

echo Starting Transaction Service on port 8082...
start "Transaction Service" cmd /c "cd transaction-service && mvn spring-boot:run -Dspring.profiles.active=prod"
timeout /t 5 /nobreak >nul

echo Starting Budget Service on port 8083...
start "Budget Service" cmd /c "cd budget-service && mvn spring-boot:run -Dspring.profiles.active=prod"
timeout /t 5 /nobreak >nul

echo Starting API Gateway on port 8080...
start "API Gateway" cmd /c "cd api-gateway && mvn spring-boot:run -Dspring.profiles.active=prod"

echo.
echo ========================================
echo Services Starting Up!
echo ========================================
echo.
echo Service Status:
echo   User Service:        http://localhost:8081
echo   Transaction Service: http://localhost:8082  
echo   Budget Service:      http://localhost:8083
echo   API Gateway:         http://localhost:8080
echo.
echo Wait 60-90 seconds for all services to start completely.
echo.
echo Then:
echo 1. Start frontend: cd frontend && npm start
echo 2. Visit: http://localhost:3000
echo 3. Test database: test-database.bat
echo.

echo Press any key to continue...
pause >nul
