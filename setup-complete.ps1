# Complete Environment Setup Script for Personal Finance Regulator
# This script sets up Java 17, Maven, and builds the entire project

Write-Host "=== Personal Finance Regulator Environment Setup ===" -ForegroundColor Green

# Set up Java 17
Write-Host ""
Write-Host "1. Setting up Java 17..." -ForegroundColor Yellow
$JAVA_HOME = "C:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\jdk-17.0.13+11"
$MAVEN_HOME = "C:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\apache-maven-3.9.5"

$env:JAVA_HOME = $JAVA_HOME
$env:MAVEN_HOME = $MAVEN_HOME
$env:PATH = "$JAVA_HOME\bin;$MAVEN_HOME\bin;$env:PATH"

Write-Host "   Java 17 configured!" -ForegroundColor Green
Write-Host "   JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "   MAVEN_HOME: $env:MAVEN_HOME" -ForegroundColor Cyan

# Verify Java and Maven
Write-Host ""
Write-Host "2. Verifying installations..." -ForegroundColor Yellow
Write-Host "   Java version:" -ForegroundColor Cyan
java -version
Write-Host ""
Write-Host "   Maven version:" -ForegroundColor Cyan
mvn -version

# Build the project
Write-Host ""
Write-Host "3. Building the project..." -ForegroundColor Yellow
mvn clean install -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Setup Complete! ===" -ForegroundColor Green
    Write-Host "The Personal Finance Regulator project is ready to use." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run '.\start-services.ps1' to start all services" -ForegroundColor Cyan
    Write-Host "  2. Access the API Gateway at http://localhost:8080" -ForegroundColor Cyan
    Write-Host "  3. Check the frontend folder for React application setup" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "=== Build Failed! ===" -ForegroundColor Red
    Write-Host "Please check the error messages above and resolve any issues." -ForegroundColor Red
}
