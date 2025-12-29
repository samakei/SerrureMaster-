# SerrureMaster - Configuration & Setup Guide

## 📋 Fichiers de Configuration

### Linting & Formatting

- **`.eslintrc.json`** - Configuration ESLint pour JavaScript/TypeScript/React

  - Désactive les avertissements de styles inline (nécessaires pour animations dynamiques)
  - Valide la qualité du code

- **`.stylelintrc.json`** - Configuration Stylelint pour CSS

  - Ignore les directives Tailwind (`@tailwind`, `@apply`, `@layer`)
  - Accepte les propriétés CSS modernes

- **`.prettierrc`** - Configuration Prettier pour formatage automatique
  - Semi-colons obligatoires
  - Single quotes
  - Largeur ligne: 100 caractères

### Code Style

- **`.editorconfig`** - Configuration pour tous les éditeurs
  - Indentation: 2 espaces
  - Fin de ligne: LF
  - Charset: UTF-8

### Navigation & Build

- **`.browserslistrc`** - Navigateurs supportés
  - Chrome/Edge >= 121
  - Firefox >= 64
  - Safari >= 15.4
  - iOS >= 15.4

## 🚀 Démarrage Rapide

### Installation des dépendances

```bash
npm install
```

### Développement

```bash
npm run dev
```

### Build pour production

```bash
npm run build
```

### Preview du build

```bash
npm run preview
```

## ⚙️ Configurations du Projet

### TypeScript (`tsconfig.json`)

- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx
- **Strict mode**: Activé
- **forceConsistentCasingInFileNames**: Activé (multi-OS)

### Vite (`vite.config.ts`)

- Plugin React activé
- Port dev: 5174
- Optimisation du build

### Tailwind CSS (`tailwind.config.js`)

- Thème personnalisé avec couleurs slate/orange
- Animations personnalisées
- Plugins de sécurité

### PostCSS (`postcss.config.js`)

- Tailwind CSS
- Autoprefixer pour compatibilité navigateurs

## 📝 Normes de Code

### Accessibilité

- Tous les inputs ont des labels ou `aria-label`
- Boutons ont des `title` pour contexte
- Navette logique des formulaires

### Performance

- Images lazy loading
- Code splitting automatique
- Optimisation CSS Tailwind

### Sécurité

- Sanitization des URLs externes
- `rel="noopener noreferrer"` sur liens externes
- Validation côté client

## ⚠️ Avertissements Acceptables

### Styles Inline Dynamiques

- **Dashboard.tsx** (watermark position)
- **Hero.tsx** (animation delays)
- **Raison**: Valeurs calculées à l'exécution

### CSS Modernes

- `scrollbar-width` / `scrollbar-color` (CSS 2024)
- Fallback webkit pour compatibilité

### Directives Tailwind

- `@tailwind`, `@apply`, `@layer`
- Traitées par PostCSS

## 🐛 Débogage

### Chrome Extension Errors

Résolu dans `index.tsx` avec listener approprié

### Provider Errors

`useProducts` et autres hooks nécessitent le provider parent

### Build Errors

Vérifier `npm run build` avant production

## 📚 Ressources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Dernière mise à jour**: 25 Décembre 2025
**Version du Projet**: 1.0.0
