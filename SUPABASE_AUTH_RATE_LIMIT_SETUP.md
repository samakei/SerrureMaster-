# Configuration Supabase Auth (Rate Limit OTP)

Objectif: réduire les erreurs `email rate limit exceeded` tout en gardant une protection anti-spam.

## 1) URL de production (obligatoire)

Dans **Supabase Dashboard > Authentication > URL Configuration**:

- **Site URL**: `https://serruremaster.com`
- **Redirect URLs** (ajouter):
  - `https://serruremaster.com`
  - `https://www.serruremaster.com` (si utilisé)
  - `http://localhost:5173`
  - `http://localhost:5174`

Retirer les anciennes URLs locales inutiles (ex: `localhost:3000`) si présentes.

---

## 2) Réglages anti-spam OTP (Dashboard)

Dans **Authentication > Providers > Email** (ou section équivalente selon version UI):

- Activer l'envoi OTP / Magic Link (déjà actif dans ton app)
- Augmenter légèrement la tolérance d'envoi pour éviter le blocage utilisateur

### Recommandation pratique (équilibre sécurité / UX)

- **Cooldown entre 2 emails OTP**: ~`60s`
- **Limite par heure par email/IP**: modérée (éviter trop bas)
- **Conserver les protections anti-abus** actives

> Les libellés exacts peuvent varier selon la version Supabase, mais l'idée est: garder un cooldown court et une limite horaire raisonnable.

---

## 3) Côté application (déjà fait)

Ton frontend gère maintenant correctement le rate-limit:

- Détection des erreurs `429` / `rate limit`
- Message utilisateur clair
- Cooldown visuel avec compte à rebours

Fichier concerné: `components/LoginPage.tsx`

---

## 4) Validation rapide après réglage

1. Demander un lien OTP une première fois
2. Redemander immédiatement -> message cooldown attendu
3. Attendre la fin du timer -> nouvelle demande OK
4. Ouvrir le lien reçu -> connexion sur `https://serruremaster.com` (pas localhost)

---

## 5) Si l'erreur persiste

- Vérifier la réputation/délivrabilité de l'email expéditeur (SPF/DKIM)
- Éviter les clics répétés côté utilisateur
- Tester avec un second email pour confirmer que ce n'est pas un blocage ciblé
