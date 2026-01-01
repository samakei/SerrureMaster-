# Script de revue des PRs Dependabot
# Usage: .\scripts\review-dependabot.ps1

Write-Host "🔍 Analyse des PRs Dependabot..." -ForegroundColor Cyan

# PRs à risque (MAJOR versions)
$riskyPRs = @(
    @{ Number = 4; Package = "vite"; From = "5.4.21"; To = "7.3.0"; Risk = "HIGH" },
    @{ Number = 5; Package = "tailwindcss"; From = "3.4.19"; To = "4.1.18"; Risk = "HIGH" }
)

# PRs à tester (dev dependencies)
$testPRs = @(
    @{ Number = 1; Package = "jsdom"; From = "23.2.0"; To = "27.4.0"; Risk = "MEDIUM" },
    @{ Number = 2; Package = "@testing-library/react"; From = "14.3.1"; To = "16.3.1"; Risk = "MEDIUM" }
)

# PRs probablement safe
$safePRs = @(
    @{ Number = 3; Package = "react + @types/react"; Risk = "LOW" }
)

Write-Host "`n🔴 PRs À RISQUE (ne pas merger sans tests approfondis):" -ForegroundColor Red
foreach ($pr in $riskyPRs) {
    Write-Host "  #$($pr.Number) - $($pr.Package): $($pr.From) → $($pr.To)" -ForegroundColor Yellow
}

Write-Host "`n🟡 PRs À TESTER (dev dependencies):" -ForegroundColor Yellow
foreach ($pr in $testPRs) {
    Write-Host "  #$($pr.Number) - $($pr.Package): $($pr.From) → $($pr.To)" -ForegroundColor Cyan
}

Write-Host "`n🟢 PRs PROBABLEMENT SAFE:" -ForegroundColor Green
foreach ($pr in $safePRs) {
    Write-Host "  #$($pr.Number) - $($pr.Package)" -ForegroundColor Green
}

Write-Host "`n📝 Actions recommandées:" -ForegroundColor Cyan
Write-Host "  1. Fermer les PRs risquées (#4, #5)" -ForegroundColor White
Write-Host "     gh pr close 4 5 -c 'Nécessite migration guidée'" -ForegroundColor Gray
Write-Host "`n  2. Tester localement les PRs dev (#1, #2)" -ForegroundColor White
Write-Host "     git checkout dependabot/npm_and_yarn/jsdom-27.4.0" -ForegroundColor Gray
Write-Host "     npm ci && npm test" -ForegroundColor Gray
Write-Host "`n  3. Merger la PR safe (#3) après vérification des tests" -ForegroundColor White
Write-Host "     gh pr merge 3 --auto --squash" -ForegroundColor Gray
