# Stop all Personal Finance Regulator backend services
Write-Host "Stopping all backend services..." -ForegroundColor Red

# Kill all Java processes (Spring Boot services)
Get-Process java | Stop-Process -Force
Write-Host "All backend services have been stopped." -ForegroundColor Red
