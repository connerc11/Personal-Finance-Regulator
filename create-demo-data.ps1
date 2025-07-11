# PowerShell script to create sample data for demo user (ID 999)

Write-Host "Creating sample data for Demo User (ID 999)..." -ForegroundColor Green

$API_BASE = "http://localhost:8080"

# Sample transactions for demo user ID 999
$sampleTransactions = @(
    @{
        userId = 999
        description = "Grocery Shopping"
        amount = 120.00
        type = "EXPENSE"
        category = "GROCERIES"
        transactionDate = "2025-07-05T14:30:00"
        merchant = "SuperMart"
        location = "Downtown"
        notes = "Weekly groceries"
    },
    @{
        userId = 999
        description = "Restaurant Dinner"
        amount = 75.00
        type = "EXPENSE"
        category = "DINING"
        transactionDate = "2025-07-08T19:15:00"
        merchant = "Fine Dining"
        location = "City Center"
        notes = "Date night"
    },
    @{
        userId = 999
        description = "Gas Station"
        amount = 50.00
        type = "EXPENSE"
        category = "TRANSPORTATION"
        transactionDate = "2025-07-10T08:45:00"
        merchant = "Shell Gas"
        location = "Highway"
        notes = "Fill up tank"
    },
    @{
        userId = 999
        description = "Coffee Shop"
        amount = 15.00
        type = "EXPENSE"
        category = "DINING"
        transactionDate = "2025-07-11T09:00:00"
        merchant = "Local Cafe"
        location = "Office District"
        notes = "Morning coffee"
    },
    @{
        userId = 999
        description = "Supermarket"
        amount = 85.00
        type = "EXPENSE"
        category = "GROCERIES"
        transactionDate = "2025-07-09T16:00:00"
        merchant = "Fresh Market"
        location = "Suburb"
        notes = "Fresh produce"
    }
)

# Function to create a transaction
function Create-Transaction {
    param (
        [hashtable]$Transaction
    )
    
    try {
        $json = $Transaction | ConvertTo-Json -Depth 3
        $response = Invoke-RestMethod -Uri "$API_BASE/api/transactions" -Method POST -Body $json -ContentType "application/json"
        Write-Host "✓ Created transaction: $($Transaction.description)" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "✗ Failed to create transaction: $($Transaction.description)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test API connectivity
try {
    $healthCheck = Invoke-RestMethod -Uri "$API_BASE/api/transactions/user/999" -Method GET
    Write-Host "✓ Transaction service is responding" -ForegroundColor Green
} catch {
    Write-Host "✗ Transaction service not available. Make sure services are running." -ForegroundColor Red
    exit 1
}

# Create transactions
Write-Host "`nCreating sample transactions..." -ForegroundColor Cyan
$createdTransactions = @()
foreach ($transaction in $sampleTransactions) {
    $result = Create-Transaction -Transaction $transaction
    if ($result) {
        $createdTransactions += $result
    }
    Start-Sleep -Milliseconds 500  # Small delay between requests
}

Write-Host "`n✓ Sample data creation completed!" -ForegroundColor Green
Write-Host "Created $($createdTransactions.Count) transactions for demo user (ID 999)" -ForegroundColor Green
Write-Host "`nDemo user now has data for testing budgets and analytics." -ForegroundColor Yellow
