# Configuration des Variables d'Environnement

## 🔑 Variables Requises pour Cloud Run

### 1. Créer un fichier `.env.production.local`

```bash
# Ne JAMAIS commiter ce fichier (déjà dans .gitignore)
```

### 2. Ajouter les clés réelles

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_GEMINI_API_KEY=AIzaSy...
```

### 3. Configurer dans GitHub Secrets

Pour Cloud Run (via GitHub Actions) :

1. Aller sur GitHub → Settings → Secrets and variables → Actions
2. Ajouter les secrets suivants :

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLIC_KEY
VITE_GEMINI_API_KEY
```

### 4. Vérifier le Dockerfile

Le Dockerfile doit accepter les ARG :

```dockerfile
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_GEMINI_API_KEY
```

### 5. Build local avec variables

```bash
# Charger les variables
export $(cat .env.production.local | xargs)

# Build
npm run build
```

## ⚠️ Erreurs Courantes

### Logo 404

✅ **Résolu** : Logo changé vers une image existante (`/images/p1.jpg`)

### Gemini 403

❌ **Cause** : `VITE_GEMINI_API_KEY` non définie ou invalide

**Solutions** :

1. Vérifier que la clé est dans `.env.production.local`
2. Rebuild avec `npm run build`
3. Redéployer sur Cloud Run
4. Si la clé est absente, le chatbot affiche un message de fallback

### Stripe Checkout

Si les paiements échouent, vérifier `VITE_STRIPE_PUBLIC_KEY`

## 📋 Checklist Déploiement

- [ ] `.env.production.local` créé et rempli
- [ ] Secrets GitHub configurés
- [ ] Build local réussi
- [ ] Test de toutes les fonctionnalités
- [ ] Push et déploiement Cloud Run
- [ ] Vérification logs Cloud Run
