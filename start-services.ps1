############################################################
# Personal Finance Regulator - Start All Services (Clean)
############################################################

# Clean target folders for all services
Write-Host "Cleaning target folders for all services..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\api-gateway\target" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\user-service\target" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\transaction-service\target" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\budget-service\target" -ErrorAction SilentlyContinue

# Set up Java 17 environment
Write-Host "Setting up Java 17 environment..." -ForegroundColor Yellow
& ".\setup-java17.ps1"

Write-Host ""
Write-Host "Building all services..." -ForegroundColor Yellow
mvn clean package -DskipTests

Write-Host ""

# Start API Gateway
Write-Host "Starting API Gateway on port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "cd 'c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\api-gateway'; $env:JAVA_HOME='c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\jdk-17.0.13+11'; $env:PATH=$env:JAVA_HOME+'\\bin;'+$env:PATH; java -jar target/api-gateway-1.0.0.jar")

# Start User Service
Write-Host "Starting User Service on port 8081..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "cd 'c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\user-service'; $env:JAVA_HOME='c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\jdk-17.0.13+11'; $env:PATH=$env:JAVA_HOME+'\\bin;'+$env:PATH; java -jar target/user-service-1.0.0.jar")

# Start Transaction Service
Write-Host "Starting Transaction Service on port 8082..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "cd 'c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\transaction-service'; $env:JAVA_HOME='c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\jdk-17.0.13+11'; $env:PATH=$env:JAVA_HOME+'\\bin;'+$env:PATH; java -jar target/transaction-service-1.0.0.jar")

# Start Budget Service
Write-Host "Starting Budget Service on port 8083..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "cd 'c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\budget-service'; $env:JAVA_HOME='c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\jdk-17.0.13+11'; $env:PATH=$env:JAVA_HOME+'\\bin;'+$env:PATH; java -jar target/budget-service-1.0.0.jar")

# React Frontend startup removed as requested

Write-Host "All services are starting..." -ForegroundColor Green
Write-Host "API Gateway will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
