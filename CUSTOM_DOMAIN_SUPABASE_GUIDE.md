# 🌐 Configuration Custom Domain pour Supabase Auth

> **Résumé :** Au lieu que vos Magic Links pointent vers `zlcjwrootdtddykhjmex.supabase.co`, ils utiliseront `auth.serruremaster.com`.
>
> **Bénéfices :** Meilleure réputation de domaine, cohérence de marque, contrôle complet des liens.

---

## 📋 Checklist Prérequis

- ✅ Accès à Supabase Dashboard (production)
- ✅ Accès DNS serruremaster.com (ton registrar)
- ✅ SSL/HTTPS fonctionnant sur serruremaster.com
- ⏱️ **Temps total:** ~15 min (incluant propagation DNS)

---

## 1️⃣ **Étape 1 : Ajouter Custom Domain dans Supabase**

### 1.1 Ouvrir Supabase Dashboard

1. Va sur [app.supabase.com](https://app.supabase.com)
2. Sélectionne ton projet SerrureMaster (`zlcjwrootdtddykhjmex`)
3. **Sidebar** → **Project Settings** (⚙️)
4. **Onglet** → **Custom Domains**

### 1.2 Ajouter le Custom Domain

Clique sur **"Add custom domain"**

- **Domain name :** `auth.serruremaster.com` (ou `auth.serruremaster.fr` si tu préfères)
- Clique **"Initiate"**

Supabase te génère :

- **Certificat SSL :** Pour HTTPS
- **DNS CNAME :** Quelque chose comme `cname.supabase.com`

📝 **Note l'adresse CNAME fournie par Supabase** (elle change par projet)

---

## 2️⃣ **Étape 2 : Configurer le CNAME DNS**

### 2.1 Accéder à ton Registrar DNS

- **Où :** Généralement dans les lettres d'accès que tu as reçues (Gandi, OVH, etc.)
- **URL type :** `https://www.ovh.com/manager/` ou `https://admin.gandi.net/`
- **Login :** Identifiants SerrureMaster

### 2.2 Ajouter l'Enregistrement CNAME

**Onglet Zone DNS** → **Créer un nouvel enregistrement**

```
Type     : CNAME
Nom      : auth  (ou auth.serruremaster.com selon le format)
Valeur   : {SUPABASE_CNAME_PROVIDED}  ex: cname.supabase.com.
TTL      : 1800 (ou par défaut)
```

**Upsert si nécessaire :** Si `auth.serruremaster.com` existe déjà, remplace l'ancienne entrée.

### 2.3 Valider

- Clique **"Créer"** ou **"Valider"**
- **Attends 5-15 minutes** pour la propagation DNS

---

## 3️⃣ **Étape 3 : Vérifier la Configuration dans Supabase**

De retour dans Supabase > **Custom Domains** :

1. Tu devrais voir l'enregistrement en **"Pending"** ou **"Active"**
2. Clique **"Verify DNS"** (bouton refresh)
3. Supabase confirmera le CNAME dans ~5 min

**Statut final :** ✅ **"Active"**

---

## 4️⃣ **Étape 4 : Mettre à Jour les URLs de Redirection**

### 4.1 Dans Supabase > **Authentication** > **URL Configuration**

Mettre à jour (si nécessaire - certains clients gardent les deux) :

```
Site URL:              https://serruremaster.com
Redirect URLs:
  - https://serruremaster.com/**
  - https://www.serruremaster.com/**
  - http://localhost:3000/**
  - http://localhost:5173/**  (Vite dev)
```

**Note :** Pas besoin de changer en `auth.serruremaster.com` ici. La redirection post-login reste vers ton domaine principal.

---

## 5️⃣ **Étape 5 : Tester**

### 5.1 Test Local (Dev)

```bash
npm run dev
# Navigue vers http://localhost:5173/login
# Essaie une connexion magic link
```

### 5.2 Test Production

```bash
curl -I https://auth.serruremaster.com/
# Devrait retourner : HTTP/2 200 ou 302 (redirect)
```

Reçois un email de test :

- Regarde l'en-tête du lien
- Format attendu : `https://auth.serruremaster.com/auth/v1/verify?...`
- ✅ Plus de `zlcjwrootdtddykhjmex.supabase.co`

---

## 6️⃣ **Dépannage Courant**

| Problème                            | Cause                             | Solution                                                     |
| ----------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| **DNS Not Verified**                | CNAME pas encore propagé          | Attends 15+ min, récupère la valeur CNAME exacte de Supabase |
| **SSL Certificate Error**           | Certificat pas émis               | Supabase l'émet après 1-2 min, clique Verify DNS             |
| **Email liens toujours old domain** | Cache ou template pas mise à jour | Supabase MAJ auto après Verify. Efface cache navigateur.     |
| **Redirect fails**                  | URL non autorisée                 | Revérifie **URL Configuration** dans Supabase Auth           |

---

## 7️⃣ **Impact Outlook**

Avec un custom domain ✅ :

- ✅ Réputation liée à `serruremaster.com` (fort)
- ✅ Pas d'IP tierce (supabase.com)
- ✅ SPF/DKIM alignent mieux (domaine du lien = domaine d'envoi)
- 📊 **Résultat :** SCL score baisse (moins de junk)

**Temps d'impact :** 24-48h (après full propagation)

---

## 📚 Références

- **Supabase Docs :** https://supabase.com/docs/guides/auth/custom-domains
- **CNAME vs Alias :** Reutilise CNAME si Supabase le propose (plus courant)
- **SSL Auto-Renewal :** Supabase renouvelle automatiquement

---

## ✨ Prochaine Étape (Optionnel)

Si Outlook persiste après template + custom domain, considère migrer vers **Postmark** ou **Mailgun** (voir guide SMTP ci-dessous).

**Reviens dès que custom domain est ✅ Active !**
