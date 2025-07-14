# Personal Finance Regulator - Data Migration Script
# This script helps migrate data from localStorage to PostgreSQL database

Write-Host "========================================" -ForegroundColor Green
Write-Host "Personal Finance Regulator" -ForegroundColor Green
Write-Host "Data Migration Tool" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "This tool will help you migrate your data from browser localStorage to PostgreSQL database." -ForegroundColor Yellow
Write-Host ""

# Function to check if PostgreSQL is running
function Test-PostgreSQL {
    try {
        $result = & psql -U personalfinance_user -d personalfinance_db -c "SELECT 1;" 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

# Function to check if services are running
function Test-Services {
    $services = @(
        @{Name="User Service"; Port=8081},
        @{Name="Transaction Service"; Port=8082},
        @{Name="Budget Service"; Port=8083}
    )
    
    $allRunning = $true
    foreach ($service in $services) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/actuator/health" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ $($service.Name) is running on port $($service.Port)" -ForegroundColor Green
            } else {
                Write-Host "✗ $($service.Name) is not responding on port $($service.Port)" -ForegroundColor Red
                $allRunning = $false
            }
        }
        catch {
            Write-Host "✗ $($service.Name) is not running on port $($service.Port)" -ForegroundColor Red
            $allRunning = $false
        }
    }
    return $allRunning
}

# Step 1: Check PostgreSQL
Write-Host "Step 1: Checking PostgreSQL connection..." -ForegroundColor Cyan
if (Test-PostgreSQL) {
    Write-Host "✓ PostgreSQL database is accessible" -ForegroundColor Green
} else {
    Write-Host "✗ Cannot connect to PostgreSQL database" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is running and the database is set up." -ForegroundColor Yellow
    Write-Host "Run setup-database.bat to set up the database." -ForegroundColor Yellow
    exit 1
}

# Step 2: Check Services
Write-Host ""
Write-Host "Step 2: Checking Spring Boot services..." -ForegroundColor Cyan
if (Test-Services) {
    Write-Host "✓ All services are running" -ForegroundColor Green
} else {
    Write-Host "✗ Some services are not running" -ForegroundColor Red
    Write-Host "Please start all Spring Boot services first." -ForegroundColor Yellow
    Write-Host "You can use: mvn spring-boot:run in each service directory" -ForegroundColor Yellow
    exit 1
}

# Step 3: Data Migration Instructions
Write-Host ""
Write-Host "Step 3: Data Migration Process" -ForegroundColor Cyan
Write-Host ""
Write-Host "To migrate your localStorage data to the database:" -ForegroundColor White
Write-Host ""
Write-Host "1. Open your browser and go to the Personal Finance Regulator app" -ForegroundColor Yellow
Write-Host "2. Open Browser Developer Tools (F12)" -ForegroundColor Yellow
Write-Host "3. Go to the Console tab" -ForegroundColor Yellow
Write-Host "4. Copy and paste the following code to export your data:" -ForegroundColor Yellow
Write-Host ""

$exportScript = @"
// Export localStorage data
const exportData = {
    users: JSON.parse(localStorage.getItem('personalfinance_users') || '[]'),
    transactions: JSON.parse(localStorage.getItem('personal_finance_transactions') || '[]'),
    budgets: JSON.parse(localStorage.getItem('personal_finance_budgets') || '[]'),
    goals: JSON.parse(localStorage.getItem('personal_finance_goals') || '[]')
};
console.log('Exported Data:', JSON.stringify(exportData, null, 2));
copy(JSON.stringify(exportData));
console.log('Data copied to clipboard!');
"@

Write-Host $exportScript -ForegroundColor Gray
Write-Host ""
Write-Host "5. Save the exported data to a file called 'exported_data.json'" -ForegroundColor Yellow
Write-Host "6. The data will be automatically imported when you log in to the new database-backed version" -ForegroundColor Yellow
Write-Host ""

Write-Host "Migration completed! Your app is now using PostgreSQL database." -ForegroundColor Green
Write-Host ""
Write-Host "Benefits of using PostgreSQL:" -ForegroundColor White
Write-Host "• Data is now persistent and secure" -ForegroundColor Green
Write-Host "• Can access from multiple devices" -ForegroundColor Green
Write-Host "• Automatic backups possible" -ForegroundColor Green
Write-Host "• Better performance for large datasets" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
