#!/usr/bin/env pwsh
# SEO Verification Script for fantasticfinancialadvisory.com

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "SEO Configuration Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$domain = "https://fantasticfinancialadvisory.com"
$errors = 0

# Check 1: robots.txt
Write-Host "[1/5] Checking robots.txt..." -ForegroundColor Yellow
try {
    $robotsUrl = "$domain/robots.txt"
    $response = Invoke-WebRequest -Uri $robotsUrl -UseBasicParsing -ErrorAction Stop
    if ($response.Content -match "fantasticfinancialadvisory.com") {
        Write-Host "  ✓ robots.txt has correct domain" -ForegroundColor Green
    } else {
        Write-Host "  ✗ robots.txt still has wrong domain!" -ForegroundColor Red
        $errors++
    }
} catch {
    Write-Host "  ✗ Cannot access robots.txt: $_" -ForegroundColor Red
    $errors++
}

# Check 2: sitemap.xml
Write-Host "`n[2/5] Checking sitemap.xml..." -ForegroundColor Yellow
try {
    $sitemapUrl = "$domain/sitemap.xml"
    $response = Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing -ErrorAction Stop
    if ($response.Content -match "fantasticfinancialadvisory.com") {
        Write-Host "  ✓ sitemap.xml has correct domain" -ForegroundColor Green
    } else {
        Write-Host "  ✗ sitemap.xml still has wrong domain!" -ForegroundColor Red
        $errors++
    }
    
    # Count URLs in sitemap
    $urlCount = ([regex]::Matches($response.Content, "<loc>")).Count
    Write-Host "  ℹ Found $urlCount URLs in sitemap" -ForegroundColor Cyan
} catch {
    Write-Host "  ✗ Cannot access sitemap.xml: $_" -ForegroundColor Red
    $errors++
}

# Check 3: Homepage meta tags
Write-Host "`n[3/5] Checking homepage meta tags..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $domain -UseBasicParsing -ErrorAction Stop
    
    if ($response.Content -match 'og:url.*fantasticfinancialadvisory.com') {
        Write-Host "  ✓ Open Graph URL correct" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Open Graph URL incorrect!" -ForegroundColor Red
        $errors++
    }
    
    if ($response.Content -match 'twitter:url.*fantasticfinancialadvisory.com') {
        Write-Host "  ✓ Twitter Card URL correct" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Twitter Card URL incorrect!" -ForegroundColor Red
        $errors++
    }
} catch {
    Write-Host "  ✗ Cannot access homepage: $_" -ForegroundColor Red
    $errors++
}

# Check 4: Google indexing status
Write-Host "`n[4/5] Checking Google indexing..." -ForegroundColor Yellow
Write-Host "  ℹ Checking if site is indexed on Google..." -ForegroundColor Cyan
try {
    $searchQuery = "site:fantasticfinancialadvisory.com"
    $googleUrl = "https://www.google.com/search?q=$searchQuery"
    Write-Host "  ℹ Search URL: $googleUrl" -ForegroundColor Cyan
    Write-Host "  ℹ Open this link in browser to check manually" -ForegroundColor Cyan
    
    # Note: Automated checking of Google is difficult due to CAPTCHA
    Write-Host "  ⚠ Manual verification required - see link above" -ForegroundColor Yellow
} catch {
    Write-Host "  ✗ Error: $_" -ForegroundColor Red
}

# Check 5: Site accessibility
Write-Host "`n[5/5] Checking site accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $domain -UseBasicParsing -ErrorAction Stop
    Write-Host "  ✓ Site is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
    
    # Check if it's HTTPS
    if ($domain -match "^https://") {
        Write-Host "  ✓ Using HTTPS" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Site not accessible: $_" -ForegroundColor Red
    $errors++
}

# Summary
Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

if ($errors -eq 0) {
    Write-Host "✓ All checks passed!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Set up Google Search Console" -ForegroundColor White
    Write-Host "2. Submit your sitemap" -ForegroundColor White
    Write-Host "3. Request indexing" -ForegroundColor White
    Write-Host "`nSee seo_action_plan.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "✗ Found $errors error(s)" -ForegroundColor Red
    Write-Host "`nPlease fix the errors above before proceeding" -ForegroundColor Yellow
}

Write-Host ""
