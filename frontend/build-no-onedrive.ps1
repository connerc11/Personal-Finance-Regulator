# Build script that temporarily pauses OneDrive sync
# Run this from PowerShell as Administrator

Write-Host "Pausing OneDrive sync..." -ForegroundColor Yellow
# Stop OneDrive process temporarily
Get-Process OneDrive -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment for process to stop
Start-Sleep -Seconds 3

Write-Host "OneDrive paused. Building project..." -ForegroundColor Green

# Change to frontend directory
Set-Location "c:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\frontend"

# Set npm to use temp directories
$env:npm_config_cache = "C:\temp\npm-cache"
$env:npm_config_tmp = "C:\temp\npm-tmp"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Blue
    npm install --no-optional --prefer-offline
}

# Build the project
Write-Host "Building React app..." -ForegroundColor Blue
npm run build

Write-Host "Build complete! Restarting OneDrive..." -ForegroundColor Green

# Restart OneDrive
Start-Process "$env:LOCALAPPDATA\Microsoft\OneDrive\OneDrive.exe" -WindowStyle Hidden

Write-Host "OneDrive sync resumed." -ForegroundColor Green
Write-Host "Build files are in the 'build' directory." -ForegroundColor Cyan
