# 🚀 Quick Start Déploiement Cloud Run

**⏱️ Durée totale**: ~30 minutes

---

## Step 1: Préparer GCP (5 min)

```bash
# 1. Authentification
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Activer services
gcloud services enable run.googleapis.com artifactregistry.googleapis.com

# 3. Créer dépôt Docker
gcloud artifacts repositories create serruremaster \
  --repository-format=docker \
  --location=europe-west1 \
  --description="SerrureMaster images"

# 4. Créer service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name "GitHub Actions Deployer"

# 5. Attribuer rôles
PROJECT_ID=$(gcloud config get-value project)
SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member "serviceAccount:$SA_EMAIL" \
  --role "roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member "serviceAccount:$SA_EMAIL" \
  --role "roles/artifactregistry.writer"

gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --member "serviceAccount:$SA_EMAIL" \
  --role "roles/iam.serviceAccountUser"

# 6. Générer clé JSON
gcloud iam service-accounts keys create /tmp/sa-key.json \
  --iam-account $SA_EMAIL

# Afficher le contenu (pour copier vers GitHub)
cat /tmp/sa-key.json
```

---

## Step 2: Configurer GitHub Secrets (10 min)

**Aller à**: GitHub → Repo Settings → Secrets and variables → Actions

Cliquer "New repository secret" et ajouter:

```env
GCP_SA_KEY=          # (Coller le contenu complet de sa-key.json)
GCP_PROJECT_ID=      # (ex: my-project-123456)
GCP_REGION=          # europe-west1
AR_REPO=             # serruremaster
CLOUD_RUN_SERVICE=   # serruremaster-web
CLOUD_RUN_STAGING_SERVICE=  # serruremaster-web-staging

VITE_SUPABASE_URL=   # https://zlcjwrootdtddykhjmex.supabase.co
VITE_SUPABASE_ANON_KEY=     # eyJhbGciOiJIUzI1NiIs...
VITE_STRIPE_PUBLIC_KEY=     # pk_live_... (ou pk_test_...)
VITE_GEMINI_API_KEY=        # AIzaSy...
```

✅ Tous les secrets renseignés?

---

## Step 3: Vérifier le Code (5 min)

Le code est déjà prêt:

- ✅ `Dockerfile` mis à jour (Node 20)
- ✅ `nginx.conf` configuré (port dynamique)
- ✅ `.github/workflows/cloud-run.yml` (prod)
- ✅ `.github/workflows/cloud-run-staging.yml` (staging)
- ✅ `npm run build` passe

**Vérifier localement**:

```bash
npm run build  # Doit finir avec ✓ built in Xs
```

---

## Step 4: Test Déploiement Staging (5 min)

1. **Créer une PR de test**:

```bash
git checkout -b test/cloud-run
git commit -m "test: cloud run deployment" --allow-empty
git push origin test/cloud-run
```

2. **Ouvrir PR sur GitHub** → branch: `main`

3. **Attendre GitHub Actions**:
   - Aller à: Actions → cloud-run-staging
   - Vérifier que la build passe
   - Chercher l'URL staging dans les logs

4. **Tester l'URL staging**:

```bash
# Vous devriez voir un commentaire auto dans la PR
# avec l'URL type: https://serruremaster-web-staging-abc123-ew.a.run.app
curl https://your-staging-url
```

✅ Staging fonctionne?

---

## Step 5: Déployer Production (5 min)

1. **Merger la PR**:

```bash
# Via GitHub UI: Click "Merge pull request"
# Ou en CLI:
git checkout main && git pull
git merge test/cloud-run
git push origin main
```

2. **Monitoring Actions**:
   - Aller à: Actions → cloud-run
   - Attendre "Deploy to Cloud Run" ✓

3. **Récupérer l'URL production**:

```bash
gcloud run services describe serruremaster-web \
  --region europe-west1 \
  --format='value(status.url)'
# Résultat: https://serruremaster-web-abc123-ew.a.run.app
```

4. **Tester Production**:

```bash
curl https://serruremaster-web-abc123-ew.a.run.app

# Vérifier les fonctionnalités clés:
# - Page d'accueil charge
# - Login fonctionne
# - Panier + checkout
# - Espace membre
```

✅ Production en ligne?

---

## 🎯 Troubleshooting Rapide

### ❌ Erreur: "workflow not triggered"

**Solution**: Vérifier que les secrets GCP_SA_KEY et GCP_PROJECT_ID sont renseignés

### ❌ Erreur Docker build: "npm ci" fail

**Solution**: Vérifier que `package-lock.json` existe au repo root

### ❌ Erreur: "404 on /path"

**Solution**: Nginx SPA fallback est configuré. Vérifier que `index.html` est dans `build/`

### ❌ Cloud Run timeout

**Solution**: Augmenter timeout dans `.github/workflows/cloud-run.yml` (actuellement 600s)

---

## 📊 Vérification Post-Déploiement

Après 5 minutes, vérifier:

```bash
# 1. Service est UP
gcloud run services describe serruremaster-web --region europe-west1

# 2. Logs n'ont pas d'erreurs critiques
gcloud run services logs read serruremaster-web --region europe-west1 --limit 50

# 3. Performance acceptable
curl -w "@-" <<'EOF'
    time_namelookup:  %{time_namelookup}\n
    time_connect:     %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
    time_redirect:    %{time_redirect}\n
    time_pretransfer: %{time_pretransfer}\n
    time_starttransfer: %{time_starttransfer}\n
    time_total:       %{time_total}\n
EOF
https://serruremaster-web-abc123-ew.a.run.app/
```

---

## 🎉 Félicitations!

Vous venez de déployer SerrureMaster en production sur **Google Cloud Run** avec CI/CD automatisé! 🚀

### Prochaines étapes (optionnel):

1. **Domaine personnalisé**: Cloud Run → Setup → Custom domains
2. **Monitoring**: Cloud Logging → Créer alertes
3. **Analytics**: Google Analytics 4 + Sentry
4. **Backup**: Supabase → Backup daily
5. **Auto-scaling**: Cloud Run → Memory/CPU si besoin

---

## 📝 Notes

- **Coûts**: ~$10-20/mois Cloud Run (free tier inclu)
- **Uptime**: 99.95% SLA Google Cloud
- **Scaling**: Auto (0 → N conteneurs selon traffic)
- **Région**: europe-west1 (Belgique - latence basse France/Europe)

---

**Questions?** Voir [CLOUD_RUN_DEPLOYMENT.md](CLOUD_RUN_DEPLOYMENT.md) ou [CLOUD_RUN_AUDIT.md](CLOUD_RUN_AUDIT.md)
