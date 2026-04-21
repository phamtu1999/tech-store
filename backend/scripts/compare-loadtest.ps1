param(
  [string]$BaselineFile,
  [string]$CurrentFile
)

$ErrorActionPreference = "Stop"

function Read-JsonSafe($path) {
  if (!(Test-Path $path)) { throw "File not found: $path" }
  $raw = Get-Content $path -Raw
  try { return $raw | ConvertFrom-Json } catch { throw "Invalid JSON: $path" }
}

$base = Read-JsonSafe $BaselineFile
$curr = Read-JsonSafe $CurrentFile

function Get-Stat($obj, $key) {
  if ($obj.Summary.$key) { return $obj.Summary.$key }
  if ($obj.$key) { return $obj.$key }
  return $null
}

Write-Host "Baseline: $BaselineFile" -ForegroundColor Cyan
Write-Host "Current : $CurrentFile" -ForegroundColor Cyan
Write-Host ""

$metrics = @(
  @{ Name = 'Req/Sec Avg'; Base = $base.requests.average; Curr = $curr.requests.average },
  @{ Name = 'Latency p50'; Base = $base.latency.p50; Curr = $curr.latency.p50 },
  @{ Name = 'Latency p95'; Base = $base.latency.p95; Curr = $curr.latency.p95 },
  @{ Name = 'Latency p99'; Base = $base.latency.p99; Curr = $curr.latency.p99 },
  @{ Name = '2xx Count'; Base = $base['2xx']; Curr = $curr['2xx'] },
  @{ Name = '4xx Count'; Base = $base['4xx']; Curr = $curr['4xx'] },
  @{ Name = '5xx Count'; Base = $base['5xx']; Curr = $curr['5xx'] }
)

foreach ($m in $metrics) {
  $delta = if ($m.Base -ne $null -and $m.Curr -ne $null) { $m.Curr - $m.Base } else { $null }
  Write-Host ("{0,-15} base={1} current={2} delta={3}" -f $m.Name, $m.Base, $m.Curr, $delta)
}
