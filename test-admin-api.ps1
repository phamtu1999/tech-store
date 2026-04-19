# ============================================================
#  TechZone Admin API Test Script (Fixed Version)
#  Backend: https://backend-production-86d7.up.railway.app
# ============================================================

$BASE    = "https://backend-production-86d7.up.railway.app/api/v1"
$EMAIL   = "admin@techstore.com"
$PASS    = "admin123"

$pass_count = 0
$fail_count = 0
$warn_count = 0
$results    = @()

function Write-Pass($msg, $detail = "") {
    Write-Host "  [PASS] $msg" -ForegroundColor Green
    if ($detail) { Write-Host "         $detail" -ForegroundColor DarkGray }
    $script:pass_count++
    $script:results += [PSCustomObject]@{ Status="PASS"; Test=$msg; Detail=$detail }
}

function Write-Fail($msg, $detail = "") {
    Write-Host "  [FAIL] $msg" -ForegroundColor Red
    if ($detail) { Write-Host "         $detail" -ForegroundColor DarkGray }
    $script:fail_count++
    $script:results += [PSCustomObject]@{ Status="FAIL"; Test=$msg; Detail=$detail }
}

function Write-Warn($msg, $detail = "") {
    Write-Host "  [WARN] $msg" -ForegroundColor Yellow
    if ($detail) { Write-Host "         $detail" -ForegroundColor DarkGray }
    $script:warn_count++
    $script:results += [PSCustomObject]@{ Status="WARN"; Test=$msg; Detail=$detail }
}

function Invoke-Api($method, $url, $body = $null, $token = $null) {
    $headers = @{ 
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    try {
        $start = Get-Date
        $response = $null
        if ($body) {
            $jsonBody = $body | ConvertTo-Json -Compress
            $response = Invoke-RestMethod -Uri $url -Method $method -Headers $headers -Body $jsonBody -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $method -Headers $headers -ErrorAction Stop
        }
        $ms = [int]((Get-Date) - $start).TotalMilliseconds
        return @{ ok=$true; data=$response; ms=$ms; status=200 }
    } catch {
        $status = 0
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
        }
        $ms = [int]((Get-Date) - $start).TotalMilliseconds
        return @{ ok=$false; data=$null; ms=$ms; status=$status; error=$_.Exception.Message }
    }
}

# -----------------------------------------
Write-Host ""
Write-Host "  TECHZONE ADMIN API TEST" -ForegroundColor Cyan
Write-Host "  Backend : $BASE"
Write-Host ""

# -----------------------------------------
Write-Host "[ 1 ] AUTH" -ForegroundColor Cyan

$loginResult = Invoke-Api "POST" "$BASE/auth/authenticate" @{ email=$EMAIL; password=$PASS }
if ($loginResult.ok -and $loginResult.data.result.token) {
    $TOKEN = $loginResult.data.result.token
    Write-Pass "POST /auth/authenticate" "$($loginResult.ms)ms - Token OK"
} else {
    Write-Warn "Login failed. Attempting to Register new user..."
    $regResult = Invoke-Api "POST" "$BASE/auth/register" @{ fullName="Test User"; email="test-$(Get-Random)@gmail.com"; password="Password123!"; phone="0911223344" }
    if ($regResult.ok) {
        $TOKEN = $regResult.data.result.token
        Write-Pass "POST /auth/register" "Created new user and got token"
    } else {
        Write-Fail "POST /auth/register" "status=$($regResult.status) - $($regResult.error)"
    }
}

# -----------------------------------------
Write-Host ""
Write-Host "[ 2 ] PUBLIC ENDPOINTS" -ForegroundColor Cyan

foreach ($ep in @(
    @{ url="$BASE/products";           name="GET /products" }
    @{ url="$BASE/categories";         name="GET /categories" }
    @{ url="$BASE/brands";             name="GET /brands" }
    @{ url="$BASE/settings";           name="GET /settings" }
)) {
    $r = Invoke-Api "GET" $ep.url
    if ($r.ok) { Write-Pass $ep.name "$($r.ms)ms" }
    else       { Write-Fail $ep.name "status=$($r.status)" }
}

# -----------------------------------------
Write-Host ""
Write-Host "[ 3 ] ADMIN - PRODUCTS" -ForegroundColor Cyan

if ($TOKEN) {
    $r = Invoke-Api "GET" "$BASE/admin/products" $null $TOKEN
    if ($r.ok) { Write-Pass "GET /admin/products" "$($r.ms)ms" }
    else       { Write-Fail "GET /admin/products" "status=$($r.status)" }

    # Create Product
    $newProduct = @{
        name        = "Test Product $(Get-Random)"
        description = "Hardware test"
        categoryId  = 4
        brandId     = 1
        active      = $true
    }
    $r = Invoke-Api "POST" "$BASE/admin/products" $newProduct $TOKEN
    if ($r.ok) {
        $newId = $r.data.result.id
        Write-Pass "POST /admin/products" "$($r.ms)ms - id=$newId"
        # Delete test
        $r3 = Invoke-Api "DELETE" "$BASE/admin/products/$newId" $null $TOKEN
        if ($r3.ok) { Write-Pass "DELETE /admin/products/$newId" "$($r3.ms)ms" }
    }
} else {
    Write-Warn "Skipping Step [ 3 ] - No Token"
}

# -----------------------------------------
Write-Host ""
Write-Host "[ 4 ] ADMIN - CATEGORIES" -ForegroundColor Cyan

if ($TOKEN) {
    $r = Invoke-Api "GET" "$BASE/admin/categories" $null $TOKEN
    if ($r.ok) { Write-Pass "GET /admin/categories" "$($r.ms)ms" }
    else       { Write-Fail "GET /admin/categories" "status=$($r.status)" }
} else {
    Write-Warn "Skipping Step [ 4 ] - No Token"
}

# -----------------------------------------
Write-Host ""
Write-Host "[ 5 ] ADMIN - ORDERS" -ForegroundColor Cyan

if ($TOKEN) {
    $r = Invoke-Api "GET" "$BASE/admin/orders" $null $TOKEN
    if ($r.ok) { Write-Pass "GET /admin/orders" "$($r.ms)ms" }
    else       { Write-Fail "GET /admin/orders" "status=$($r.status)" }
} else {
    Write-Warn "Skipping Step [ 5 ] - No Token"
}

# -----------------------------------------
Write-Host ""
Write-Host "[ 6 ] ADMIN - USERS" -ForegroundColor Cyan

if ($TOKEN) {
    $r = Invoke-Api "GET" "$BASE/admin/users" $null $TOKEN
    if ($r.ok) { Write-Pass "GET /admin/users" "$($r.ms)ms" }
    else       { Write-Fail "GET /admin/users" "status=$($r.status)" }
} else {
    Write-Warn "Skipping Step [ 6 ] - No Token"
}

# -----------------------------------------
Write-Host ""
Write-Host "[ 7 ] SECURITY CHECK" -ForegroundColor Cyan

$r = Invoke-Api "GET" "$BASE/admin/users"  # No token
if (-not $r.ok -and $r.status -eq 401) { Write-Pass "Security: Unauthorized users blocked (401)" }
else { Write-Fail "Security: Unauthorized access not blocked" "status=$($r.status)" }

# -----------------------------------------
Write-Host ""
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "  PASS : $pass_count" -ForegroundColor Green
Write-Host "  FAIL : $fail_count" -ForegroundColor Red
Write-Host ""
