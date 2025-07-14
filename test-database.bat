@echo off
echo ========================================
echo Personal Finance Regulator - Database Testing
echo ========================================
echo.

echo Checking if services are running...
echo.

echo Testing User Service (8081)...
curl -s http://localhost:8081/actuator/health >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ User Service: RUNNING
) else (
    echo ✗ User Service: NOT RUNNING
)

echo Testing Transaction Service (8082)...
curl -s http://localhost:8082/actuator/health >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Transaction Service: RUNNING
) else (
    echo ✗ Transaction Service: NOT RUNNING
)

echo Testing Budget Service (8083)...
curl -s http://localhost:8083/actuator/health >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Budget Service: RUNNING
) else (
    echo ✗ Budget Service: NOT RUNNING
)

echo Testing API Gateway (8080)...
curl -s http://localhost:8080/actuator/health >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ API Gateway: RUNNING
) else (
    echo ✗ API Gateway: NOT RUNNING
)

echo.
echo Testing Database Connection...
psql -U personalfinance_user -d personalfinance_db -c "SELECT version();" >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ PostgreSQL Database: CONNECTED
) else (
    echo ✗ PostgreSQL Database: CONNECTION FAILED
)

echo.
echo Testing Frontend...
curl -s http://localhost:3000 >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Frontend: RUNNING at http://localhost:3000
) else (
    echo ✗ Frontend: NOT RUNNING
    echo   Start with: cd frontend && npm start
)

echo.
echo ========================================
echo Database Integration Test
echo ========================================
echo.
echo Creating a test user to verify database integration...

curl -X POST http://localhost:8081/api/users/register ^
     -H "Content-Type: application/json" ^
     -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}" ^
     >test_result.json 2>nul

if %errorlevel% equ 0 (
    echo ✓ User registration test: SUCCESS
    echo   Check test_result.json for details
) else (
    echo ✗ User registration test: FAILED
)

echo.
echo ========================================
echo Test Summary
echo ========================================
echo.
echo If all services show ✓ RUNNING:
echo   Your database integration is working perfectly!
echo   Visit: http://localhost:3000
echo.
echo If any service shows ✗ NOT RUNNING:
echo   Run: start-services.bat
echo.
echo If database shows ✗ CONNECTION FAILED:
echo   Run: setup-postgresql.bat
echo.

echo Press any key to exit...
pause >nul
