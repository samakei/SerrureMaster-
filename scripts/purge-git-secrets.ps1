param(
  [string]$Remote = "origin",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git n'est pas installé."
}

$gitFilterRepo = git help -a | Select-String "filter-repo"
if (-not $gitFilterRepo) {
  Write-Host "Installation de git-filter-repo..."
  python -m pip install --user git-filter-repo
}

$repoRoot = (git rev-parse --show-toplevel).Trim()
Set-Location $repoRoot

$replaceFile = Join-Path $repoRoot "scripts\filter-repo-replacements.txt"
@"
regex:AIza[0-9A-Za-z\-_]{20,}==>REDACTED_GOOGLE_API_KEY
regex:sk_(test|live)_[A-Za-z0-9_]+==>REDACTED_STRIPE_SECRET_KEY
regex:pk_(test|live)_[A-Za-z0-9_]+==>REDACTED_STRIPE_PUBLIC_KEY
regex:sb_publishable_[A-Za-z0-9_\-]+==>REDACTED_SUPABASE_ANON_KEY
"@ | Set-Content -Path $replaceFile -Encoding UTF8

Write-Host "Réécriture de l'historique en cours..."
git filter-repo --force --replace-text $replaceFile

Write-Host "Nettoyage objets git..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Terminé. Vérifie puis pousse avec:"
Write-Host "git push --force-with-lease $Remote $Branch"
Write-Host ""
Write-Host "Ensuite: invalider/rotater les clés compromises côté fournisseurs."
