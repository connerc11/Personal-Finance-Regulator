# Robust service startup script with proper error handling
Write-Host "========================================"
Write-Host "Personal Finance - Service Startup"
Write-Host "========================================"

# Function to start a service and wait for it to be ready
function Start-Service-WithWait {
    param(
        [string]$ServiceName,
        [string]$JarPath,
        [int]$Port,
        [int]$TimeoutSeconds = 60
    )
    
    Write-Host "`nStarting $ServiceName..."
    
    # Start the service in background
    $job = Start-Job -ScriptBlock {
        param($jar, $name)
        Set-Location (Split-Path $jar)
        java -jar (Split-Path $jar -Leaf) 2>&1
    } -ArgumentList $JarPath, $ServiceName -Name $ServiceName
    
    Write-Host "Waiting for $ServiceName to start on port $Port..."
    
    # Wait for service to start listening on port
    $timeout = $TimeoutSeconds
    $started = $false
    
    while ($timeout -gt 0 -and -not $started) {
        Start-Sleep -Seconds 2
        $timeout -= 2
        
        try {
            $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                Write-Host "✅ $ServiceName started successfully on port $Port"
                $started = $true
            }
        } catch {
            # Continue waiting
        }
        
        # Check for errors in job output
        $output = Receive-Job -Job $job -ErrorAction SilentlyContinue
        if ($output) {
            $errors = $output | Where-Object { $_ -match "ERROR|Exception|Failed" }
            if ($errors) {
                Write-Host "❌ $ServiceName startup errors detected:"
                $errors | ForEach-Object { Write-Host "   $_" }
            }
        }
    }
    
    if (-not $started) {
        Write-Host "❌ $ServiceName failed to start within $TimeoutSeconds seconds"
        # Show recent output
        $output = Receive-Job -Job $job -ErrorAction SilentlyContinue
        if ($output) {
            Write-Host "Recent output:"
            $output | Select-Object -Last 10 | ForEach-Object { Write-Host "   $_" }
        }
        return $false
    }
    
    return $true
}

# Wait for build to complete
Write-Host "Waiting for Maven build to complete..."
Start-Sleep -Seconds 10

# Start services in order
$services = @(
    @{ Name = "API Gateway"; Jar = "api-gateway\target\api-gateway-1.0.0.jar"; Port = 8080 },
    @{ Name = "User Service"; Jar = "user-service\target\user-service-1.0.0.jar"; Port = 8081 },
    @{ Name = "Transaction Service"; Jar = "transaction-service\target\transaction-service-1.0.0.jar"; Port = 8082 },
    @{ Name = "Budget Service"; Jar = "budget-service\target\budget-service-1.0.0.jar"; Port = 8083 }
)

$allStarted = $true

foreach ($service in $services) {
    $jarPath = Join-Path $PWD $service.Jar
    if (Test-Path $jarPath) {
        $result = Start-Service-WithWait -ServiceName $service.Name -JarPath $jarPath -Port $service.Port
        if (-not $result) {
            $allStarted = $false
        }
    } else {
        Write-Host "❌ JAR file not found: $jarPath"
        $allStarted = $false
    }
}

if ($allStarted) {
    Write-Host "`n✅ All services started successfully!"
    Write-Host "Frontend: http://localhost:3000"
    Write-Host "API Gateway: http://localhost:8080"
} else {
    Write-Host "`n❌ Some services failed to start. Check the output above for errors."
}

Write-Host "`nService jobs running:"
Get-Job | Format-Table Name, State -AutoSize
