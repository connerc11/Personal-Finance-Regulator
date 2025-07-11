# PowerShell script to create sample data for testing the Personal Finance Regulator

Write-Host "Creating sample data for Personal Finance Regulator..." -ForegroundColor Green

$API_BASE = "http://localhost:8080"

# Sample transactions for user ID 1
$sampleTransactions = @(
    @{
        userId = 1
        description = "Salary Payment"
        amount = 5200.00
        type = "INCOME"
        category = "SALARY"
        transactionDate = "2025-07-01T10:00:00"
        merchant = "Employer Inc"
        location = "Online"
        notes = "Monthly salary"
    },
    @{
        userId = 1
        description = "Grocery Shopping"
        amount = 125.50
        type = "EXPENSE"
        category = "GROCERIES"
        transactionDate = "2025-07-02T14:30:00"
        merchant = "SuperMart"
        location = "Downtown"
        notes = "Weekly groceries"
    },
    @{
        userId = 1
        description = "Lunch at Restaurant"
        amount = 45.00
        type = "EXPENSE"
        category = "DINING"
        transactionDate = "2025-07-03T12:15:00"
        merchant = "Pasta Palace"
        location = "City Center"
        notes = "Business lunch"
    },
    @{
        userId = 1
        description = "Gas Station"
        amount = 65.00
        type = "EXPENSE"
        category = "TRANSPORTATION"
        transactionDate = "2025-07-04T08:45:00"
        merchant = "Shell Gas"
        location = "Highway"
        notes = "Fill up tank"
    },
    @{
        userId = 1
        description = "Electric Bill"
        amount = 120.00
        type = "EXPENSE"
        category = "UTILITIES"
        transactionDate = "2025-07-05T16:00:00"
        merchant = "Power Company"
        location = "Online"
        notes = "Monthly electric bill"
    },
    @{
        userId = 1
        description = "Movie Tickets"
        amount = 32.00
        type = "EXPENSE"
        category = "ENTERTAINMENT"
        transactionDate = "2025-07-06T19:30:00"
        merchant = "Cinema Plus"
        location = "Mall"
        notes = "Date night"
    },
    @{
        userId = 1
        description = "Freelance Payment"
        amount = 800.00
        type = "INCOME"
        category = "BUSINESS"
        transactionDate = "2025-07-07T09:00:00"
        merchant = "Client XYZ"
        location = "Online"
        notes = "Web development project"
    }
)

Write-Host "Adding sample transactions..." -ForegroundColor Yellow

foreach ($transaction in $sampleTransactions) {
    try {
        $json = $transaction | ConvertTo-Json -Depth 3
        $response = Invoke-WebRequest -Uri "$API_BASE/api/transactions" -Method POST -Body $json -ContentType "application/json" -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Added: $($transaction.description)" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to add: $($transaction.description)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error adding $($transaction.description): $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500  # Small delay between requests
}

Write-Host ""
Write-Host "Sample data creation complete!" -ForegroundColor Green
Write-Host "You can now view the data in the frontend application:" -ForegroundColor Cyan
Write-Host "  - Dashboard: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  - Transactions: http://localhost:3001/transactions" -ForegroundColor Cyan
Write-Host "  - Analytics: http://localhost:3001/analytics" -ForegroundColor Cyan
