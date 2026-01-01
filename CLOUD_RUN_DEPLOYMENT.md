# Déploiement Cloud Run avec Artifact Registry

Ce guide décrit la configuration et l’exécution du déploiement automatique sur Cloud Run en utilisant Artifact Registry, tels que configurés par les workflows présents dans le dépôt.

## Prérequis

- Projet GCP actif (ex: `PROJECT_ID`).
- Rôles requis pour le compte de service utilisé par GitHub Actions:
  - `roles/run.admin`
  - `roles/artifactregistry.writer`
  - `roles/iam.serviceAccountUser` (sur le compte de service lui‑même)
- Artifact Registry activé et un dépôt Docker créé (ex: `serruremaster`).

## Création du dépôt Artifact Registry

Exécuter ces commandes (adapter `PROJECT_ID`, `REGION`, `REPO`):

```bash
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com

# Créer le dépôt Docker dans Artifact Registry
gcloud artifacts repositories create REPO \
  --repository-format=docker \
  --location=REGION \
  --description="Images SerrureMaster"

# (Optionnel) Créer un compte de service pour CI/CD
gcloud iam service-accounts create github-actions-deployer \
  --display-name "GitHub Actions Deployer"

# Attribuer les rôles au compte de service
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member "serviceAccount:github-actions-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/run.admin"
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member "serviceAccount:github-actions-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/artifactregistry.writer"
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-deployer@PROJECT_ID.iam.gserviceaccount.com \
  --member "serviceAccount:github-actions-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/iam.serviceAccountUser"

# Générer et télécharger une clé JSON (à stocker dans GitHub Secrets)
gcloud iam service-accounts keys create sa-key.json \
  --iam-account github-actions-deployer@PROJECT_ID.iam.gserviceaccount.com
```

## Secrets GitHub Actions à renseigner

Renseigner ces secrets dans le dépôt GitHub (Settings → Secrets and variables → Actions):

- `GCP_SA_KEY`: Contenu du fichier JSON (clé du compte de service).
- `GCP_PROJECT_ID`: ID du projet GCP.
- `GCP_REGION`: Région Cloud Run/Artifact Registry (ex: `europe-west1`).
- `AR_REPO`: Nom du dépôt Artifact Registry (ex: `serruremaster`).
- `CLOUD_RUN_SERVICE`: Nom du service Cloud Run pour la prod (ex: `serruremaster-web`).
- `CLOUD_RUN_STAGING_SERVICE`: Nom du service Cloud Run pour le staging PR (ex: `serruremaster-web-staging`).

Secrets pour la build Vite (si nécessaires côté client):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_GEMINI_API_KEY` (si utilisé côté navigateur)

## Workflows et déclencheurs

- Prod: [.github/workflows/cloud-run.yml](.github/workflows/cloud-run.yml)

  - Déclenché sur `push` vers `main`.
  - Construit l’image, pousse dans Artifact Registry et déploie sur Cloud Run.
- Staging PR: [.github/workflows/cloud-run-staging.yml](.github/workflows/cloud-run-staging.yml)

  - Déclenché sur `pull_request` vers `main`.
  - Déploie un service de staging et commente automatiquement l’URL du service dans la PR.

## Convention d’image

Les workflows utilisent Artifact Registry: `REGION-docker.pkg.dev/PROJECT_ID/AR_REPO/SERVICE:SHA`.
L’auth Docker vers Artifact Registry est gérée dans les workflows via `gcloud auth configure-docker`.

## Vérification rapide

1. Créer le dépôt AR et renseigner les secrets.
2. Ouvrir une PR de test → vérifier le déploiement de staging et le commentaire d’URL.
3. Merger vers `main` → vérifier le déploiement prod sur Cloud Run.

## Dépannage

- Erreur "repository not found": créer le dépôt AR (voir commandes ci‑dessus).
- Erreur d’auth/push: vérifier `GCP_SA_KEY` et les rôles attribués.
- 404 SPA: la config Nginx inclut le fallback, vérifier l’image déployée et `nginx.conf`.
- Port: Cloud Run écoute sur 8080; l’image Nginx est configurée pour 8080.
