# 🔐 Configuration GitHub Secrets - Cloud Run Deployment

**Durée**: ~10 minutes pour configurer tous les secrets

---

## 📋 Secrets Requuis

Total: **12 secrets** à configurer

### **Groupe 1: Authentification GCP (4 secrets)**

| Secret           | Exemple             | Source                      |
| ---------------- | ------------------- | --------------------------- |
| `GCP_SA_KEY`     | (JSON complet)      | Service account credentials |
| `GCP_PROJECT_ID` | `my-project-123456` | GCP Console                 |
| `GCP_REGION`     | `europe-west1`      | Où les ressources sont      |
| `AR_REPO`        | `serruremaster`     | Artifact Registry repo name |

### **Groupe 2: Cloud Run Service Names (2 secrets)**

| Secret                      | Valeur                      |
| --------------------------- | --------------------------- |
| `CLOUD_RUN_SERVICE`         | `serruremaster-web`         |
| `CLOUD_RUN_STAGING_SERVICE` | `serruremaster-web-staging` |

### **Groupe 3: API Frontend (4 secrets)**

| Secret                   | Exemple                                    |
| ------------------------ | ------------------------------------------ |
| `VITE_SUPABASE_URL`      | `https://zlcjwrootdtddykhjmex.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_51Qk1z7...` ou `pk_live_...`      |
| `VITE_GEMINI_API_KEY`    | `AIzaSy...`                                |

### **Groupe 4: Optional - Workload Identity (si pas de SA Key)**

| Secret                       | Valeur             |
| ---------------------------- | ------------------ |
| `WORKLOAD_IDENTITY_PROVIDER` | (si utilisant WIF) |
| `GCP_SERVICE_ACCOUNT_EMAIL`  | (si utilisant WIF) |

---

## 🔧 Configuration Étape par Étape

### Step 1: Aller à GitHub Settings

```
GitHub Repo → Settings → Secrets and variables → Actions
```

Ou directement:

```
https://github.com/samakei/SerrureMaster-/settings/secrets/actions
```

### Step 2: Ajouter Secrets GCP

**Cliquer "New repository secret"** pour chaque:

#### **GCP_SA_KEY**

```
Name: GCP_SA_KEY
Value: (Coller le contenu COMPLET du fichier sa-key.json)
```

Récupérer sa-key.json:

```bash
gcloud iam service-accounts keys create sa-key.json \
  --iam-account github-actions-deployer@YOUR_PROJECT.iam.gserviceaccount.com
cat sa-key.json  # Copier tout
```

#### **GCP_PROJECT_ID**

```
Name: GCP_PROJECT_ID
Value: (ex: my-project-123456)
```

```bash
gcloud config get-value project
```

#### **GCP_REGION**

```
Name: GCP_REGION
Value: europe-west1
```

#### **AR_REPO**

```
Name: AR_REPO
Value: serruremaster
```

### Step 3: Ajouter Cloud Run Service Names

#### **CLOUD_RUN_SERVICE**

```
Name: CLOUD_RUN_SERVICE
Value: serruremaster-web
```

#### **CLOUD_RUN_STAGING_SERVICE**

```
Name: CLOUD_RUN_STAGING_SERVICE
Value: serruremaster-web-staging
```

### Step 4: Ajouter APIs Frontend

#### **VITE_SUPABASE_URL**

```
Name: VITE_SUPABASE_URL
Value: https://zlcjwrootdtddykhjmex.supabase.co
```

#### **VITE_SUPABASE_ANON_KEY**

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

_Trouver dans: Supabase Dashboard → Project Settings → API → anon key_

#### **VITE_STRIPE_PUBLIC_KEY**

```
Name: VITE_STRIPE_PUBLIC_KEY
Value: pk_test_51Qk1z7...  (ou pk_live_... si production)
```

_Trouver dans: Stripe Dashboard → API keys → Publishable key_

#### **VITE_GEMINI_API_KEY**

```
Name: VITE_GEMINI_API_KEY
Value: AIzaSy...
```

_Trouver dans: Google Cloud Console → APIs & Services → Credentials_

---

## ✅ Checklist Configuration

- [ ] GCP_SA_KEY configuré
- [ ] GCP_PROJECT_ID configuré
- [ ] GCP_REGION configuré (europe-west1)
- [ ] AR_REPO configuré (serruremaster)
- [ ] CLOUD_RUN_SERVICE configuré (serruremaster-web)
- [ ] CLOUD_RUN_STAGING_SERVICE configuré (serruremaster-web-staging)
- [ ] VITE_SUPABASE_URL configuré
- [ ] VITE_SUPABASE_ANON_KEY configuré
- [ ] VITE_STRIPE_PUBLIC_KEY configuré
- [ ] VITE_GEMINI_API_KEY configuré

**Total: 10 secrets minimum**

---

## 🧪 Vérifier les Secrets

Une fois configurés, vérifier via CLI:

```bash
# Lister les secrets (montrera juste les noms)
gh secret list

# Vérifier qu'un secret existe
gh secret view GCP_SA_KEY --json name
```

Ou via GitHub UI:

```
Settings → Secrets and variables → Actions
```

Vous devriez voir la liste avec les cases vérifiées ✓

---

## 🚀 Lancer le Déploiement

### Option 1: Créer une PR Test (Recommandé)

```bash
# 1. Créer branche test
git checkout -b test/cloud-run-deploy

# 2. Commit vide (ou changement mineur)
git commit --allow-empty -m "test: trigger cloud run deployment"

# 3. Pousser
git push origin test/cloud-run-deploy

# 4. Ouvrir PR sur GitHub
# → Actions → cloud-run-staging workflow
# Attendre la validation + URL staging dans les logs
```

**Résultat attendu:**

```
✓ Tests passed
✓ Build successful
✓ Image pushed to Artifact Registry
✓ Deployed to Cloud Run (staging)
✓ URL: https://serruremaster-web-staging-abc123-ew.a.run.app
```

### Option 2: Déploiement Direct Production

Une fois staging OK, merger la PR:

```bash
# Merger via GitHub UI (click "Merge")
# Ou en CLI:
git checkout main
git pull
git merge test/cloud-run-deploy
git push origin main

# Actions → cloud-run workflow
# Attendre production deployment
```

**Résultat attendu:**

```
✓ Build successful
✓ Image pushed to Artifact Registry
✓ Deployed to Cloud Run (production)
✓ URL: https://serruremaster-web-abc123-ew.a.run.app
```

---

## 📊 Vérifier le Déploiement

### Via GitHub Actions

```
GitHub Repo → Actions → cloud-run (pour production)
                     → cloud-run-staging (pour PR)
```

Logs à vérifier:

- ✅ "Checkout repository"
- ✅ "Authenticate to Google Cloud"
- ✅ "Configure Docker auth"
- ✅ "Build and push Docker image"
- ✅ "Deploy to Cloud Run"
- ✅ "Deployed to Cloud Run: https://..."

### Via GCP CLI

```bash
# URL du service
gcloud run services describe serruremaster-web \
  --region europe-west1 \
  --format='value(status.url)'

# Tester la réponse
curl https://serruremaster-web-xxx-ew.a.run.app

# Logs
gcloud run services logs read serruremaster-web \
  --region europe-west1 --limit 50
```

---

## 🆘 Troubleshooting

### ❌ Erreur: "Secret not found"

```
Erreur: GCP_SA_KEY secret not found
```

**Solution**: Vérifier que le secret existe sur GitHub → Settings → Secrets

### ❌ Erreur: "Invalid service account key"

```
Erreur: invalid JSON in GCP_SA_KEY
```

**Solution**: Vérifier le contenu est du JSON valide (copier-coller complètement)

### ❌ Erreur: "Authentication failed"

```
Erreur: Couldn't authenticate with provided credentials
```

**Solution**: Vérifier le service account a les bons rôles:

```bash
gcloud projects get-iam-policy YOUR_PROJECT \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-deployer@*"
```

### ❌ Workflow ne déclenche pas

**Solution**: Vérifier les fichiers workflow:

```bash
ls -la .github/workflows/
# cloud-run.yml
# cloud-run-staging.yml
```

Vérifier les branches dans les workflows:

```yaml
on:
  push:
    branches: ['main'] # ← doit exister
  pull_request:
    branches: ['main'] # ← doit exister
```

---

## 📝 Notes Importantes

### Security

- ✅ Secrets sont chiffrés en transit et au repos
- ✅ GCP_SA_KEY n'apparait jamais en logs
- ✅ Valable seulement pour ce repo

### Permissions

- Les secrets ne sont visibles que par les admins du repo
- Les actions GitHub peuvent les utiliser
- Les PRs externes n'ont pas accès (sécurité)

### Coûts

- ✅ GitHub Actions: gratuit pour repos publics
- ✅ Cloud Run: $15-20/mois (free tier peut suffire)
- ⚠️ Artifact Registry: $0.10/GB storage

---

## ✨ Résumé

**Secrets à configurer:** 10  
**Durée:** ~10 minutes  
**Résultat:** Déploiement automatisé en production ✨

```
┌─────────────────────────┐
│  1. Push code (main)    │
├─────────────────────────┤
│  2. GitHub Actions      │
│     - Tests             │
│     - Build             │
│     - Docker push       │
├─────────────────────────┤
│  3. Cloud Run Deploy    │
│     - Staging/Prod      │
│     - Auto-scaling      │
│     - HTTPS             │
├─────────────────────────┤
│  4. URL Production Live │
└─────────────────────────┘
```

---

**Next Step**: Configurer les 10 secrets, puis pousser du code vers `main` ou ouvrir une PR test.

**Questions?** Voir [CLOUD_RUN_QUICKSTART.md](CLOUD_RUN_QUICKSTART.md)
