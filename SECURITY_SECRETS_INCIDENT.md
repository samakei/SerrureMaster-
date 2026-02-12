# Incident secrets exposés - actions immédiates

## 1) Ce qui a été corrigé localement

- Suppression des clés en clair dans la documentation Stripe.
- Ajout de `build` et `.env.production.local` dans `.gitignore`.
- Suppression de `build/` de l'index Git (`git rm --cached`) pour éviter les republications.

## 2) Rotation des secrets (obligatoire)

- Stripe: régénérer la clé secrète et la clé publique.
- Google/Gemini: régénérer la clé API.
- Supabase: régénérer la clé exposée si nécessaire.

Après rotation:

- mettre à jour `.env.local`
- mettre à jour les secrets de déploiement (Cloud Run / GitHub Actions / Supabase Edge Functions)
- redéployer

## 3) Purge de l'historique Git

Le script `scripts/purge-git-secrets.ps1` réécrit l'historique pour remplacer les patterns de clés.

Exécution (PowerShell):

```powershell
./scripts/purge-git-secrets.ps1 -Remote origin -Branch main
```

Puis pousser l'historique réécrit:

```powershell
git push --force-with-lease origin main
```

## 4) Vérification post-purge

- Re-scan local:

```powershell
git grep -n "AIza\|sk_test_\|sk_live_\|pk_test_\|pk_live_\|sb_publishable_"
```

- Vérifier GitHub Security alerts (Secret scanning) jusqu'à disparition des alertes.

## 5) Important pour l'équipe

- Tous les collaborateurs doivent resynchroniser leur clone après réécriture d'historique.
- Exemple rapide:

```powershell
git fetch --all
git reset --hard origin/main
```
