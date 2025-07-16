Write-Host "=== Personal Finance Database Setup ==="

# PostgreSQL connection details
$pgPath = "C:\Program Files\PostgreSQL\17\bin"
$env:PGPASSWORD = "admin"  # Default postgres user password

if (-not (Test-Path $pgPath)) {
    Write-Host "❌ PostgreSQL not found at $pgPath"
    Write-Host "Please ensure PostgreSQL 17 is installed"
    exit 1
}

Write-Host "✅ PostgreSQL found at $pgPath"

try {
    Write-Host "Connecting to PostgreSQL..."
    
    # Test connection
    $testResult = & "$pgPath\psql.exe" -h localhost -U postgres -d postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to connect to PostgreSQL"
        Write-Host $testResult
        exit 1
    }
    
    Write-Host "✅ Connected to PostgreSQL successfully"
    
    # Drop existing database and user if they exist
    Write-Host "Cleaning up existing database..."
    & "$pgPath\psql.exe" -h localhost -U postgres -d postgres -c "DROP DATABASE IF EXISTS personalfinance_db;" 2>$null
    & "$pgPath\psql.exe" -h localhost -U postgres -d postgres -c "DROP USER IF EXISTS personalfinance_user;" 2>$null
    
    # Create user
    Write-Host "Creating database user..."
    $result = & "$pgPath\psql.exe" -h localhost -U postgres -d postgres -c "CREATE USER personalfinance_user WITH PASSWORD 'personalfinance_pass';" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create user: $result"
        exit 1
    }
    
    # Create database
    Write-Host "Creating database..."
    $result = & "$pgPath\psql.exe" -h localhost -U postgres -d postgres -c "CREATE DATABASE personalfinance_db OWNER personalfinance_user;" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create database: $result"
        exit 1
    }
    
    # Grant privileges
    Write-Host "Granting privileges..."
    & "$pgPath\psql.exe" -h localhost -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE personalfinance_db TO personalfinance_user;" 2>$null
    
    # Test the new database connection
    Write-Host "Testing new database connection..."
    $env:PGPASSWORD = "personalfinance_pass"
    $testResult = & "$pgPath\psql.exe" -h localhost -U personalfinance_user -d personalfinance_db -c "SELECT 'Database connection successful!' as message;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database setup completed successfully!"
        Write-Host "Database: personalfinance_db"
        Write-Host "User: personalfinance_user"
        Write-Host "Password: personalfinance_pass"
    } else {
        Write-Host "❌ Database connection test failed: $testResult"
        exit 1
    }
    
} catch {
    Write-Host "❌ Error during database setup: $($_.Exception.Message)"
    exit 1
}

Write-Host "`n=== Database setup complete! ==="
