# ==============================================================================
# Brainova Robotics - One-Click Cloud Auto-Update Publisher
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   🚀 Brainova Robotics - Auto-Update Publisher" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$pkgPath = Join-Path $PSScriptRoot "package.json"
if (-not (Test-Path $pkgPath)) {
    Write-Host "❌ Error: package.json not found!" -ForegroundColor Red
    exit 1
}

$pkg = Get-Content $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
$currentVer = $pkg.version
Write-Host "📌 Current Installed Version: v$currentVer" -ForegroundColor Yellow

$parts = $currentVer.Split('.')
if ($parts.Length -eq 3) {
    $nextPatch = [int]$parts[2] + 1
    $suggestedVer = "$($parts[0]).$($parts[1]).$nextPatch"
} else {
    $suggestedVer = "$currentVer.1"
}

$newVer = $suggestedVer
Write-Host "🎯 Target Version to Deploy: v$newVer" -ForegroundColor Green

$pkg.version = $newVer
$newJson = $pkg | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($pkgPath, $newJson, [System.Text.Encoding]::UTF8)
Write-Host "✅ Updated package.json to v$newVer" -ForegroundColor Green

Stop-Process -Name "Brainova Robotics" -Force -ErrorAction SilentlyContinue

# Safely extract GitHub token from git remote or environment
if (-not $env:GH_TOKEN) {
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl -match 'ghp_[a-zA-Z0-9]+') {
        $env:GH_TOKEN = $matches[0]
    }
}

Write-Host "📦 Committing and pushing source code to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "chore: release v$newVer with cloud auto-update support" --allow-empty
git push origin main
Write-Host "✅ Source code pushed to GitHub repository!" -ForegroundColor Green

Write-Host "🔨 Building production binaries & uploading to GitHub Releases..." -ForegroundColor Cyan
npx electron-builder --win --x64 --publish always

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host "   🎉 SUCCESS! Release v$newVer has been deployed!" -ForegroundColor Green
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host "✅ The update is now live on GitHub Releases." -ForegroundColor White
    Write-Host "✅ All academy desktop users will receive this update" -ForegroundColor White
    Write-Host "   AUTOMATICALLY upon opening their application!" -ForegroundColor Yellow
    Write-Host "=========================================================" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to publish release. Check electron-builder error logs." -ForegroundColor Red
}
