# Test Save Spotlight API with Authentication
$baseUrl = "http://localhost:8080/api"

# Test data for login
$loginData = @{
    username = "testuser"
    password = "testpassword"
} | ConvertTo-Json

Write-Host "Testing Save Spotlight API..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Step 1: Try to login (this might fail if user doesn't exist)
try {
    Write-Host "1. Attempting login..." -ForegroundColor Yellow
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/users/auth/signin" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.accessToken
    Write-Host "   ✓ Login successful! Token: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Step 2: Test chat rooms endpoint
    Write-Host "2. Testing chat rooms endpoint..." -ForegroundColor Yellow
    $headers = @{"Authorization" = "Bearer $token"}
    $chatRoomsResponse = Invoke-RestMethod -Uri "$baseUrl/users/save-spotlight/chat/rooms" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✓ Chat rooms retrieved successfully!" -ForegroundColor Green
    Write-Host "   Found $($chatRoomsResponse.data.Count) chat rooms" -ForegroundColor White
    
    # Step 3: Test joining a chat room
    if ($chatRoomsResponse.data.Count -gt 0) {
        $firstRoomId = $chatRoomsResponse.data[0].id
        Write-Host "3. Testing join chat room $firstRoomId..." -ForegroundColor Yellow
        $joinResponse = Invoke-RestMethod -Uri "$baseUrl/users/save-spotlight/chat/rooms/$firstRoomId/join" -Method POST -Headers $headers -ErrorAction Stop
        Write-Host "   ✓ Successfully joined chat room!" -ForegroundColor Green
    }
    
    # Step 4: Test goals endpoint
    Write-Host "4. Testing shared goals endpoint..." -ForegroundColor Yellow
    $goalsResponse = Invoke-RestMethod -Uri "$baseUrl/users/save-spotlight/goals" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✓ Shared goals retrieved successfully!" -ForegroundColor Green
    Write-Host "   Found $($goalsResponse.data.Count) shared goals" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎉 All Save Spotlight endpoints are working!" -ForegroundColor Green
    
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*404*") {
        Write-Host "   ❌ Endpoint not found - Save Spotlight routes may not be configured" -ForegroundColor Red
    } elseif ($errorMessage -like "*401*") {
        Write-Host "   ❌ Authentication failed - Check if user exists or credentials are correct" -ForegroundColor Red
        Write-Host "      Try creating a user first through the frontend" -ForegroundColor Yellow
    } elseif ($errorMessage -like "*500*") {
        Write-Host "   ❌ Server error - Check if database tables exist" -ForegroundColor Red
    } else {
        Write-Host "   ❌ Error: $errorMessage" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Alternative test: Try accessing the frontend at http://localhost:3000" -ForegroundColor Cyan
Write-Host "1. Register a new user or login with existing credentials" -ForegroundColor White
Write-Host "2. Navigate to Save Spotlight" -ForegroundColor White
Write-Host "3. Try joining a chat room or sharing a goal" -ForegroundColor White
