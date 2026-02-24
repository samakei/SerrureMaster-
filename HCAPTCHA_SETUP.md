# ✅ Configuration hCaptcha - Terminée

L'intégration hCaptcha est maintenant **complète et fonctionnelle** dans votre application.

---

## 📦 Ce qui a été installé

- ✅ Package `@hcaptcha/react-hcaptcha` installé
- ✅ Composant hCaptcha intégré dans `LoginPage.tsx`
- ✅ Variable d'environnement `VITE_HCAPTCHA_SITE_KEY` ajoutée
- ✅ Build validé sans erreurs

---

## 🔑 Dernière étape : Ajouter votre Site Key

### 1. Récupérer votre Site Key hCaptcha

Dans votre Dashboard hCaptcha : https://dashboard.hcaptcha.com/sites

1. Sélectionne ton site **SerrureMaster**
2. Copie la **Site Key** (publique)
   - Format : `10000000-ffff-ffff-ffff-000000000001`

### 2. Remplacer dans `.env.local`

Ouvre le fichier `.env.local` et remplace :

```env
VITE_HCAPTCHA_SITE_KEY=votre_site_key_ici
```

Par :

```env
VITE_HCAPTCHA_SITE_KEY=ta_vraie_site_key_copiee
```

### 3. Redémarrer le serveur de dev

```bash
npm run dev
```

---

## 🧪 Test de validation

1. Ouvre ton app en local : `http://localhost:5173`
2. Va sur la page de connexion
3. Tu dois voir le **challenge hCaptcha** (checkbox ou invisible)
4. Saisis un email → Résous le captcha → Clique "Recevoir mon lien"
5. ✅ L'OTP devrait être envoyé normalement

---

## 🚨 Dépannage

### Erreur "Captcha verification failed"

**Cause** : La Secret Key dans Supabase ne correspond pas à la Site Key frontend

**Solution** :

1. Vérifie que la **Secret Key** dans Supabase Dashboard est correcte
2. Vérifie que la **Site Key** dans `.env.local` correspond au même site hCaptcha

### Le captcha ne s'affiche pas

**Cause** : Variable d'environnement non chargée

**Solution** :

1. Arrête le serveur (`Ctrl+C`)
2. Vérifie `.env.local` : la ligne `VITE_HCAPTCHA_SITE_KEY=...` existe ?
3. Redémarre : `npm run dev`

### "Disabled" dans Supabase Dashboard

**Cause** : Tu n'as pas encore saisi la Secret Key

**Solution** :

1. Dashboard hCaptcha → Settings → Secret Key (copier)
2. Supabase Dashboard → Authentication → Attack Protection
3. Colle la Secret Key
4. Save

---

## 🎯 Pour déployer en production

### Variables d'environnement production

Ajoute `VITE_HCAPTCHA_SITE_KEY` dans :

- **Vercel** : Settings → Environment Variables
- **Cloud Run** : GitHub Secrets (si CI/CD)
- **Autres** : Fichier `.env.production.local`

### DNS hCaptcha (important !)

Dans ton Dashboard hCaptcha → Site Settings → **Hostnames**, assure-toi d'avoir :

```
serruremaster.com
www.serruremaster.com
```

Sans ça, le captcha sera rejeté en production.

---

## 📊 Fonctionnalités actives

- ✅ **Protection anti-bot** sur connexion OTP
- ✅ **Protection mots de passe compromis** (si activée dans Supabase)
- ✅ **Challenge invisible ou checkbox** (selon config hCaptcha)
- ✅ **Auto-reset** du captcha après chaque tentative
- ✅ **Gestion d'erreurs** captcha avec messages clairs
- ✅ **UI responsive** et thème dark adapté

---

## 🔗 Liens utiles

- [Dashboard hCaptcha](https://dashboard.hcaptcha.com/)
- [Docs hCaptcha](https://docs.hcaptcha.com/)
- [Supabase Attack Protection](https://supabase.com/docs/guides/auth/auth-captcha)

---

**👍 Tout est prêt ! Remplace juste ta Site Key dans `.env.local` et teste.**
