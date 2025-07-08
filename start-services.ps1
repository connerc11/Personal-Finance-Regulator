# Personal Finance Regulator - Start All Services
Write-Host "Starting Personal Finance Regulator Services..." -ForegroundColor Green

# Start API Gateway
Write-Host "Starting API Gateway on port 8080..." -ForegroundColor Yellow
Start-Job -Name "api-gateway" -ScriptBlock {
    Set-Location "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\api-gateway"
    java -jar target/api-gateway-1.0.0.jar
}

# Start User Service
Write-Host "Starting User Service on port 8081..." -ForegroundColor Yellow
Start-Job -Name "user-service" -ScriptBlock {
    Set-Location "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\user-service"
    java -jar target/user-service-1.0.0.jar
}

# Start Transaction Service
Write-Host "Starting Transaction Service on port 8082..." -ForegroundColor Yellow
Start-Job -Name "transaction-service" -ScriptBlock {
    Set-Location "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\transaction-service"
    java -jar target/transaction-service-1.0.0.jar
}

# Start Budget Service
Write-Host "Starting Budget Service on port 8083..." -ForegroundColor Yellow
Start-Job -Name "budget-service" -ScriptBlock {
    Set-Location "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\budget-service"
    java -jar target/budget-service-1.0.0.jar
}

Write-Host "All services are starting..." -ForegroundColor Green
Write-Host "Use 'Get-Job' to check status and 'Receive-Job -Name <service-name>' to see output" -ForegroundColor Cyan
Write-Host "API Gateway will be available at: http://localhost:8080" -ForegroundColor Cyan
