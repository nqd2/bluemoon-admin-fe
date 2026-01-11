# Test API Script for PowerShell
# Usage: .\test-api.ps1 -Token "your_jwt_token_here"
# Example: .\test-api.ps1 -Token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$BaseUrl = "http://localhost:5000"
$Headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $Token"
}

Write-Host "=== Testing Create Apartment ===" -ForegroundColor Cyan
Write-Host ""

$ApartmentBody = @{
    name = "A101"
    apartmentNumber = "101"
    building = "A"
    area = 80.5
} | ConvertTo-Json

try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/api/apartments" -Method Post -Headers $Headers -Body $ApartmentBody
    Write-Host "Success!" -ForegroundColor Green
    $Response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Testing Create Fee ===" -ForegroundColor Cyan
Write-Host ""

$FeeBody = @{
    title = "Phí dịch vụ tháng 12/2025"
    description = "Thu phí dịch vụ chung cư"
    type = "Service"
    amount = 5000
    unit = "m2"
} | ConvertTo-Json

try {
    $Response = Invoke-RestMethod -Uri "$BaseUrl/api/fees" -Method Post -Headers $Headers -Body $FeeBody
    Write-Host "Success!" -ForegroundColor Green
    $Response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
