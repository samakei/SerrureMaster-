<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SerrureMaster - Formation Professionnelle d'Ouverture de Porte

Application web complète pour la vente et la gestion de formations professionnelles.

View your app in AI Studio: https://ai.studio/apps/drive/1SGpa2A0-RC-S8YzfcCWSuWnA1hNt69Zz

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** (inclus avec Node.js)
- Compte **Supabase** (gratuit sur [supabase.com](https://supabase.com))
- Compte **Stripe** (gratuit sur [stripe.com](https://stripe.com))

### Installation

1. **Clonez le dépôt :**
   ```bash
   git clone https://github.com/samakei/SerrureMaster-.git
   cd SerrureMaster-
   ```

2. **Installez les dépendances :**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement :**

   Créez un fichier `.env.local` à la racine du projet :
   ```bash
   cp .env.example .env.local
   ```

   Éditez `.env.local` et remplissez vos clés :
   ```env
   # Supabase (Dashboard → Settings → API)
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici

   # Stripe (Dashboard → Developers → API keys)
   VITE_STRIPE_PUBLIC_KEY=pk_test_votre-cle-publique

   # Gemini (optionnel - pour le chatbot IA)
   VITE_GEMINI_API_KEY=votre-cle-gemini
   ```

   **Où obtenir les clés ?**
   - **Supabase :** Créez un projet sur [supabase.com](https://supabase.com), puis allez dans Settings → API
   - **Stripe :** Créez un compte sur [stripe.com](https://stripe.com), puis allez dans Developers → API keys (utilisez les clés de test)
   - **Gemini :** (Optionnel) Créez une clé sur [Google AI Studio](https://ai.google.dev/)

4. **Lancez le serveur de développement :**
   ```bash
   npm run dev
   ```

5. **Ouvrez votre navigateur :**
   
   L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

### ⚠️ Problème "ERR_CONNECTION_REFUSED" ?

Si vous rencontrez cette erreur :

1. **Vérifiez que le serveur de développement est lancé :**
   ```bash
   npm run dev
   ```

2. **Vérifiez que le fichier `.env.local` existe et contient les bonnes clés**

3. **Redémarrez le serveur après toute modification de `.env.local`** (Ctrl+C puis `npm run dev`)

4. Si la page reste blanche, ouvrez la console du navigateur (F12) pour voir les erreurs

## 🧪 Tests 
## 🧪 Tests

Pour tester l'application :

```bash
npm test              # Mode watch
npm run test:ui       # Interface visuelle
npm run test:coverage # Rapport de couverture
```

## 🏗️ Build et Production

```bash
npm run build         # Build de production
npm run preview       # Prévisualiser le build
```

## 💳 Test de Paiement (Mode Test Stripe)

Pour tester un paiement complet :

* Carte test : `4242 4242 4242 4242`
* Date : N'importe quelle date future
* CVC : `123`

## 📚 Documentation

Pour plus d'informations, consultez :

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Guide de configuration détaillé
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Guide des tests
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Index complet de la documentation

## 🔒 Sécurité

⚠️ **IMPORTANT :**
- Ne committez **JAMAIS** le fichier `.env.local` avec vos vraies clés
- Le fichier `.env.local` est déjà dans `.gitignore`
- Utilisez uniquement les clés de **test** de Stripe en développement
- Pour la production, utilisez `.env.production.local` et les variables d'environnement de votre hébergeur

## 🤝 Contribution

Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les directives de contribution.

## 📄 Licence

Voir le fichier LICENSE pour plus de détails.

---

**Tout est opérationnel ! 💪**
