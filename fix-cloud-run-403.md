# Correction Erreur 403 Cloud Run

## Problème

Erreur 403 (Forbidden) lors de l'accès à l'application Cloud Run.

## Causes identifiées

1. ❌ Configuration nginx incorrecte (syntaxe `${PORT:-8080}` non supportée)
2. ❌ Service Cloud Run non accessible publiquement

## Solutions appliquées

### 1. Correction du nginx.conf

✅ Changé `listen ${PORT:-8080}` → `listen 8080`

### 2. Autoriser l'accès public

Exécutez ces commandes :

```bash
# Remplacez par vos valeurs
PROJECT_ID="your-project-id"
SERVICE_NAME="serruremaster-web"
REGION="europe-west1"

# Autoriser l'accès public (sans authentification)
gcloud run services add-iam-policy-binding $SERVICE_NAME \
  --region=$REGION \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### 3. Vérifier l'état du service

```bash
# Vérifier les détails du service
gcloud run services describe $SERVICE_NAME --region=$REGION

# Voir les logs en temps réel
gcloud run services logs read $SERVICE_NAME --region=$REGION --limit=50
```

### 4. Redéployer après correction

```bash
# Option A: Via GitHub Actions
# → Pusher le code avec nginx.conf corrigé sur main

# Option B: Déploiement manuel
gcloud run deploy $SERVICE_NAME \
  --region=$REGION \
  --allow-unauthenticated
```

## Vérification

Après redéploiement, testez :

- ✅ GET https://serruremaster-web-309280937564.europe-west1.run.app/ devrait retourner 200
- ✅ Le favicon.ico devrait se charger correctement

## Note sur les autres erreurs

Les erreurs suivantes sont **normales** et liées aux extensions de navigateur :

- `runtime.lastError` → Extension de navigateur
- `csspeeper-inspector-tools` → Extension CSS Peeper
- Ces erreurs n'affectent pas votre application
