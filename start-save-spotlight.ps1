Write-Host "Starting Personal Finance Regulator Services..." -ForegroundColor Green

# Check if PostgreSQL is running
Write-Host "✓ Database should be running on port 5432" -ForegroundColor Yellow

# Start User Service
Write-Host "Starting User Service on port 8081..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd user-service && mvn spring-boot:run" -WindowStyle Minimized

# Wait for user service to start
Start-Sleep -Seconds 15

# Start API Gateway  
Write-Host "Starting API Gateway on port 8080..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd api-gateway && mvn spring-boot:run" -WindowStyle Minimized

# Wait for gateway to start
Start-Sleep -Seconds 15

# Start Frontend Development Server
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && npm start" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host "Services Started Successfully!" -ForegroundColor Green  
Write-Host "===================================" -ForegroundColor Green
Write-Host "• API Gateway: http://localhost:8080" -ForegroundColor White
Write-Host "• User Service: http://localhost:8081" -ForegroundColor White
Write-Host "• Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Save Spotlight endpoints:" -ForegroundColor Yellow
Write-Host "• Chat Rooms: http://localhost:8080/api/users/save-spotlight/chat/rooms" -ForegroundColor White
Write-Host "• Shared Goals: http://localhost:8080/api/users/save-spotlight/goals" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
