# 🔐 Configuration des Secrets GitHub

## Pour que le déploiement Cloud Run fonctionne, vous DEVEZ configurer ces secrets sur GitHub

### Étapes :

1. Aller sur : **https://github.com/samakei/SerrureMaster-/settings/secrets/actions**
2. Ajouter les secrets suivants :

### 📋 Secrets à configurer

**GCP Authentication (Choisir l'une des deux méthodes) :**

```
GCP_SA_KEY : (contenu complet du fichier sa-key.json en JSON)
OU
WORKLOAD_IDENTITY_PROVIDER : https://iam.googleapis.com/locations/...
GCP_SERVICE_ACCOUNT_EMAIL : your-sa@your-project.iam.gserviceaccount.com
```

**GCP Project (Obligatoire) :**

```
GCP_PROJECT_ID : serruremaster-prod (ou votre ID projet)
```

**Frontend API Keys (Obligatoire pour que le chatbot fonctionne) :**

```
VITE_SUPABASE_URL : https://zlcjwrootdtddykhjmex.supabase.co
VITE_SUPABASE_ANON_KEY : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLIC_KEY : pk_live_... (ou pk_test_...)
VITE_GEMINI_API_KEY : AIzaSy... (votre clé API Google)
```

---

## 📝 Où trouver ces valeurs ?

### Supabase

```
1. Aller sur https://app.supabase.com
2. Sélectionner le projet
3. Settings → API
4. Copier "Project URL" → VITE_SUPABASE_URL
5. Copier "anon public" → VITE_SUPABASE_ANON_KEY
```

### Stripe

```
1. Aller sur https://dashboard.stripe.com
2. Developers → API keys
3. Copier "Publishable key" → VITE_STRIPE_PUBLIC_KEY
```

### Google Gemini

```
1. Aller sur https://ai.google.dev
2. API & Services → Credentials
3. Créer une "API Key"
4. Copier la clé → VITE_GEMINI_API_KEY
```

### GCP Service Account

```
# Si vous utilisez la méthode Service Account Key :
1. GCP Console → Service Accounts
2. Créer une key en JSON
3. Copier tout le contenu JSON → GCP_SA_KEY
```

---

## ⚠️ Important

- **Ne JAMAIS** commiter ces clés dans le code
- Les secrets GitHub sont chiffrés et sécurisés
- Chaque secret est exposé uniquement aux workflows autorisés
- Utilisez des clés en `pk_test_` et `test` tant que vous développez

---

## ✅ Vérifier que ça marche

Une fois les secrets configurés :

```bash
git commit --allow-empty -m "chore: trigger deployment with secrets"
git push
```

Aller sur GitHub Actions pour voir le déploiement.
