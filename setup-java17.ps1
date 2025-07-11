# PowerShell script to set up Java 17 and Maven environment
# Run this script to configure Java 17 and Maven for your session

$JAVA_HOME = "C:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\jdk-17.0.13+11"
$MAVEN_HOME = "C:\Users\busy_\OneDrive\Desktop\PF\Personal-Finance-Regulator\apache-maven-3.9.5"

$env:JAVA_HOME = $JAVA_HOME
$env:MAVEN_HOME = $MAVEN_HOME
$env:PATH = "$JAVA_HOME\bin;$MAVEN_HOME\bin;$env:PATH"

Write-Host "Java 17 and Maven environment configured!" -ForegroundColor Green
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "MAVEN_HOME: $env:MAVEN_HOME" -ForegroundColor Cyan
Write-Host ""
Write-Host "Java version:" -ForegroundColor Yellow
java -version
Write-Host ""
Write-Host "Maven version:" -ForegroundColor Yellow
mvn -version
