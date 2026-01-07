# 🔍 État du Déploiement Cloud Run

**Date:** 7 janvier 2026  
**Statut:** ⚠️ Service pas encore déployé

---

## 📊 Analyse

### ✅ Ce qui est fait

- Code compilé avec succès (npm run build: 55.28s)
- Tests GitHub Actions: **Success** ✓
- Workflow `cloud-run.yml` configuré et prêt
- Dockerfile et nginx.conf optimisés pour Cloud Run
- Artifact Registry setup dans GCP (europe-west1)

### ❌ Problème détecté

```
gcloud error: Cannot find service [serruremaster-web]
```

**Cause probable:** Les secrets GitHub n'ont pas été configurés, donc le workflow `cloud-run.yml` n'a pas pu s'exécuter (a échoué silencieusement ou n'a pas été déclenché).

---

## 🔧 Actions à prendre (dans cet ordre)

### **1. Vérifier les secrets GitHub** (2 min)

Aller à: `https://github.com/samakei/SerrureMaster-/settings/secrets/actions`

✅ Vérifier que ces **10 secrets** existent:

- [ ] `GCP_SA_KEY` (JSON service account complet)
- [ ] `GCP_PROJECT_ID` (ex: serruremaster-prod)
- [ ] `GCP_REGION` (ex: europe-west1)
- [ ] `AR_REPO` (ex: serruremaster)
- [ ] `CLOUD_RUN_SERVICE` (ex: serruremaster-web)
- [ ] `CLOUD_RUN_STAGING_SERVICE` (ex: serruremaster-web-staging)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_STRIPE_PUBLIC_KEY`
- [ ] `VITE_GEMINI_API_KEY`

**Si manquants:** Ajouter les secrets en lisant [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

---

### **2. Déclencher manuellement le déploiement** (1 min)

Une fois secrets OK, forcer le déploiement:

```bash
# PowerShell
git commit --allow-empty -m "chore: trigger cloud run deployment"
git push origin main

# GitHub Actions se déclenche automatiquement
# Aller à: https://github.com/samakei/SerrureMaster-/actions
```

Attendre ~2 min pour que le workflow se termine.

---

### **3. Vérifier que le service est créé** (1 min)

```bash
# Récupérer l'URL du service
gcloud run services describe serruremaster-web `
  --region europe-west1 `
  --project serruremaster-prod `
  --format "value(status.url)"

# Tester l'endpoint santé
curl https://<URL-RETOURNÉE>/_health
```

**Résultat attendu:**

```
https://serruremaster-web-xxxx-ew.a.run.app
Status: 200 ok
```

---

## 📋 Checklist de diagnostic

- [ ] Tous les 10 secrets GitHub sont présents
- [ ] Dernière run du workflow `cloud-run.yml` est en **Success** (vérifier Actions)
- [ ] `gcloud run services list` affiche `serruremaster-web`
- [ ] URL du service répond avec `200 ok` sur `/_health`
- [ ] Page d'accueil charge correctement (tester manuellement)

---

## 🚨 Si le déploiement a échoué

### Logs GitHub Actions

```
Repo → Actions → cloud-run → dernière run → voir les logs détaillés
```

**Erreurs courantes:**

1. **"Secret not found"** → Secrets pas configurés sur GitHub
2. **"Invalid service account key"** → JSON mal formaté
3. **"Build failed"** → Erreur Docker (vérifier `npm run build` en local)
4. **"Deploy failed"** → Permissions GCP insuffisantes

---

## ✨ Une fois déployé

### URL Production

```
https://serruremaster-web-<hash>-ew.a.run.app
```

### Tester en production

```bash
# Santé
curl https://serruremaster-web-xxx-ew.a.run.app/_health

# Voir les logs
gcloud run services logs read serruremaster-web --region europe-west1 --limit 50

# Métriques
gcloud run services describe serruremaster-web --region europe-west1
```

---

## 📞 Support

Si bloqué:

1. Vérifier [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
2. Voir les logs GitHub Actions complets
3. Vérifier les permissions du service account GCP
4. Relancer le workflow avec un commit vide

**Next step:** Configurer les secrets et relancer le déploiement.
