param(
  [string]$Url = "http://localhost:8080/api/v1/products?page=0&size=20",
  [int]$Connections = 50,
  [int]$Duration = 10,
  [string]$OutDir = "./loadtest-results"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $OutDir "products-$timestamp.json"
$textPath = Join-Path $OutDir "products-$timestamp.txt"

Write-Host "Running autocannon against $Url" -ForegroundColor Cyan
Write-Host "Connections: $Connections, Duration: ${Duration}s" -ForegroundColor Cyan

$npxCmd = @(
  "autocannon",
  "-c", $Connections,
  "-d", $Duration,
  "-j",
  $Url
)

$raw = & npx @npxCmd 2>&1
$raw | Out-File -FilePath $textPath -Encoding utf8

try {
  $json = $raw | ConvertFrom-Json
  $json | ConvertTo-Json -Depth 20 | Out-File -FilePath $jsonPath -Encoding utf8
  Write-Host "Saved JSON: $jsonPath" -ForegroundColor Green
} catch {
  Write-Warning "autocannon did not return pure JSON. Saved text output only: $textPath"
}

Write-Host "Saved text: $textPath" -ForegroundColor Green
