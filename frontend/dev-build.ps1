# Development script that builds without OneDrive conflicts
# This script temporarily moves the project outside OneDrive, builds, then moves back

param(
    [switch]$JustBuild = $false
)

Write-Host "Personal Finance App - Development Build Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "For best results, run as Administrator" -ForegroundColor Yellow
}

$originalPath = Get-Location
$frontendPath = "C:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\frontend"
$tempPath = "C:\temp\pf-frontend-build"

try {
    # Create temp directory
    if (Test-Path $tempPath) {
        Remove-Item $tempPath -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempPath -Force | Out-Null

    Write-Host "Copying source files to temp location..." -ForegroundColor Green
    
    # Copy source files (excluding node_modules and build)
    $excludeItems = @("node_modules", "build", ".npm", "npm-debug.log*")
    Get-ChildItem $frontendPath | Where-Object { 
        $_.Name -notin $excludeItems 
    } | Copy-Item -Destination $tempPath -Recurse -Force

    # Set environment variables to avoid OneDrive
    $env:npm_config_cache = "C:\temp\npm-cache"
    $env:npm_config_tmp = "C:\temp\npm-tmp"
    $env:REACT_APP_API_URL = "http://localhost:8080/api"

    Set-Location $tempPath

    Write-Host "Installing dependencies..." -ForegroundColor Green
    npm install --no-optional --silent

    Write-Host "Building React application..." -ForegroundColor Green
    npm run build

    if (Test-Path "$tempPath\build") {
        Write-Host "Build successful! Copying back to original location..." -ForegroundColor Green
        
        # Remove old build
        if (Test-Path "$frontendPath\build") {
            Remove-Item "$frontendPath\build" -Recurse -Force
        }
        
        # Copy new build
        Copy-Item "$tempPath\build" -Destination $frontendPath -Recurse -Force
        
        Write-Host "Build complete! ✅" -ForegroundColor Green
        Write-Host "Files copied back to: $frontendPath\build" -ForegroundColor Cyan
    } else {
        Write-Host "Build failed! ❌" -ForegroundColor Red
        exit 1
    }

} catch {
    Write-Host "Error during build: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Set-Location $originalPath
    
    # Clean up temp directory
    if (Test-Path $tempPath) {
        Remove-Item $tempPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if (-not $JustBuild) {
    Write-Host "`nStarting development server..." -ForegroundColor Green
    Set-Location $frontendPath
    node simple-server.js
}
