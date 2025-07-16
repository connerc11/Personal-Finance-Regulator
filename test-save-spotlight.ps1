# Save Spotlight API Test Script

Write-Host "Testing Save Spotlight API Endpoints..." -ForegroundColor Green

$baseUrl = "http://localhost:8080/api/users/save-spotlight"

# Test endpoints (Note: These will require authentication)
$endpoints = @(
    "$baseUrl/chat/rooms",
    "$baseUrl/goals"
)

Write-Host ""
Write-Host "Available Endpoints:" -ForegroundColor Yellow

foreach ($endpoint in $endpoints) {
    try {
        Write-Host "• $endpoint" -ForegroundColor White
        # Note: Actual API calls would require JWT token
        # $response = Invoke-RestMethod -Uri $endpoint -Method GET -Headers @{"Authorization" = "Bearer $token"}
    }
    catch {
        Write-Host "  - Endpoint ready (authentication required)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Pre-configured Chat Rooms:" -ForegroundColor Yellow
Write-Host "• Goals - Share and discuss your financial goals" -ForegroundColor White
Write-Host "• Budgets - Tips, tricks, and discussions about budgeting" -ForegroundColor White  
Write-Host "• Investing - Investment advice and portfolio sharing" -ForegroundColor White

Write-Host ""
Write-Host "To test the API:" -ForegroundColor Cyan
Write-Host "1. Start the services with start-save-spotlight.ps1" -ForegroundColor White
Write-Host "2. Log in through the frontend at http://localhost:3000" -ForegroundColor White
Write-Host "3. Navigate to the Save Spotlight page" -ForegroundColor White
Write-Host "4. Try joining a chat room or sharing a goal" -ForegroundColor White
