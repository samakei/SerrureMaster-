# 🔄 DÉPLOIEMENT FUTUR - CHECKLIST STANDARD

Lors de chaque déploiement en production:

---

## ✅ Avant de Pousser (5 min)

```bash
# 1. Code change
vim src/...

# 2. Vérifier local
npm run dev     # Tester en dev
npm test        # Tests passent
npm run build   # Build OK

# 3. Commit propre
git add .
git commit -m "feat: description concise"
```

## ✅ Pull Request (GitHub) (10 min)

```bash
# 1. Créer branche
git checkout -b feature/name

# 2. Pousser
git push origin feature/name

# 3. Ouvrir PR sur GitHub
# Description, lien issue, changelog

# 4. Attendre CI
# Actions → Tests → Coverage → Build
```

**Checklist PR**:

- [ ] Tests passe (Actions)
- [ ] Coverage OK (80%+)
- [ ] Code review approved
- [ ] No conflicts
- [ ] Changelog rempli

## ✅ Déploiement Production (5 min)

```bash
# 1. Merger PR
# GitHub UI: "Merge pull request"

# 2. Monitoring
# Actions → cloud-run (watch)

# 3. Vérifier déploiement
gcloud run services describe serruremaster-web \
  --region europe-west1 \
  --format='value(status.url)'
```

**Checklist Prod**:

- [ ] Cloud Run workflow déclenché
- [ ] Build image success
- [ ] Image poussée à AR
- [ ] Service deployment réussi
- [ ] Nouvelle URL active

## ✅ Post-Déploiement (5 min)

```bash
# 1. Tester production
curl https://serruremaster-web-xxx.run.app

# 2. Vérifier logs
gcloud run services logs read serruremaster-web \
  --region europe-west1 --limit 50

# 3. Vérifier monitoring
# GCP Console → Cloud Run → serruremaster-web → Metrics
```

**Checklist Post**:

- [ ] Site répond (HTTP 200)
- [ ] Pas d'erreurs critiques en logs
- [ ] Pas de spike de CPU/Memory
- [ ] Fonctionnalités clés testées:
  - [ ] Login fonctionne
  - [ ] Produits chargent
  - [ ] Checkout OK
  - [ ] Emails envoyés

---

## 🆘 Rollback Urgent

Si un problème critique:

```bash
# 1. List previous revisions
gcloud run services describe serruremaster-web \
  --region europe-west1

# 2. Rollback to previous version
gcloud run services update-traffic serruremaster-web \
  --to-revisions REVISION_ID=100 \
  --region europe-west1
```

---

## 📊 Monitoring Quotidien

Via GCP Console ou CLI:

```bash
# Uptime
gcloud monitoring metrics-descriptors list \
  --filter="metric.type:run.googleapis.com"

# Erreurs
gcloud logging read "resource.type=cloud_run_revision" \
  --limit 100 --format json

# Performance
gcloud run services describe serruremaster-web \
  --region europe-west1
```

---

## 📝 Notes

- **Frequency**: Déploiements 1-2 fois par semaine
- **Downtime**: Zéro (Cloud Run gère les reveisions)
- **Rollback**: <5 minutes si nécessaire
- **Cost**: ~$15-20/mois pour traffic standard

---

**Last Updated**: 7 janvier 2026  
**Next Review**: Après 10 déploiements
