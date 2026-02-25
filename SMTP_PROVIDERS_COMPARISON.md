# 📧 Comparaison Fournisseurs SMTP pour Email Transactionnel

> **Contexte :** IONOS shared IP (212.227.126.130) → Outlook junk (SCL:5). Migration vers provider spécialisé recommandée.
>
> **Verdict Final :** **Postmark** (meilleur rapport qualité/prix pour startup). Fallback : Mailgun (plus flexible).

---

## 🏆 Tableau Comparatif

| Critère                   | Postmark            | Mailgun               | SendGrid           | IONOS (Actuel)             |
| ------------------------- | ------------------- | --------------------- | ------------------ | -------------------------- |
| **Plan Free/Essai**       | 100/mois + 10 jours | 5k/mois illimité      | 100/jour           | Inclus                     |
| **Coût/1000 emails**      | $0.80-1.00          | $0.50 (après free)    | $0.10 (v3)         | Inclus (faible reputation) |
| **Réputation Outlook**    | ⭐⭐⭐⭐⭐          | ⭐⭐⭐⭐              | ⭐⭐⭐⭐           | ⭐⭐ (le problème)         |
| **IP Dédiée**             | Option ($200/mois)  | Option ($50-200/mois) | Option ($400/mois) | Partagée (limitée)         |
| **Warm-up**               | Automatique         | Manuel                | Manuel             | N/A                        |
| **Setup DNS**             | SPF + DKIM          | SPF + DKIM            | SPF + DKIM + CNAME | ✓ Déjà fait                |
| **Support**               | Excellent           | Bon                   | Très Bon           | Basique                    |
| **Webhook**               | ✅ Complets         | ✅ Complets           | ✅ Complets        | ✅ Basiques                |
| **Délivrabilité Outlook** | 98%+                | 96%+                  | 95%+               | 70% (actuel)               |

---

## 🎯 Recommandation par Profil

### 📌 **Si tu veux Simple & Rapide → POSTMARK**

**Pourquoi :**

- ✅ Configuration DNS ultra-simple (2 enregistrements)
- ✅ Warm-up automatique (pas de courbe progressive)
- ✅ Meilleure délivrabilité to Outlook out-of-box
- ✅ Support reactif (humans, pas chatbots)
- ✅ Dashboard intuitif + logs complets
- 💰 Coût : ~$15/mois pour 25k emails (startup)

**Usage :** Parfait pour **SerrureMaster** (faible volume, priorité délivrabilité)

---

### 🔧 **Si tu veux Flexibilité & Inexpensif → MAILGUN**

**Pourquoi :**

- ✅ 5k emails/mois gratuit (long terme)
- ✅ API très flexible (webhooks avancés)
- ✅ Routing rules (splitter le trafic)
- ✅ Contrôle granulaire (rate limiting, retry)
- ⚠️ Setup DNS plus complexe (DKIM rotation)
- 💰 Coût : Gratuit/5k (ou $0.50/1000)

**Usage :** Bon pour **scale future** avec besoins customs

---

### 🚀 **Si tu veux Enterprise → SENDGRID**

**Pourquoi :**

- ✅ IP dédiée standard (meilleure pour volume)
- ✅ Suppression list (rejecte adresses de retour)
- ✅ Onboarding IP warm-up (process professionnel)
- ✅ Template builder visuel
- ⚠️ Plus cher (~$29/mois minimum)
- 💰 Coût : Cher pour startup

**Usage :** Overkill pour SerrureMaster **maintenant**. Envisageable si >100k emails/mois.

---

## 📋 Plan Migration POSTMARK (Recommandé)

### **Phase 1 : Création Compte & DNS (5 min)**

1. **Aller sur [postmark.com](https://postmark.com)**
2. **Sign up** → créer projet SerrureMaster
3. **Email Settings** → ajouter domaine `serruremaster.com`
4. Postmark génère SPF + DKIM → copier dans DNS

**DNS Update :**

```
SPF:  serruremaster.com  TXT  "v=spf1 include:postmarkapp.com ~all"
DKIM: {token}.dkim.postmarkapp.com  CNAME  postmarkapp.com
```

5. **Valider DNS** dans Postmark (auto-détecte après propagation)

---

### **Phase 2 : Récupérer SMTP Credentials (2 min)**

Dans Postmark > **Integrations** → **SMTP**

```
SMTP Server:   smtp.postmarkapp.com
Port:          587 (TLS) ou 465 (SSL)
Login:         {API_TOKEN_POSTMARK}
Password:      {API_TOKEN_POSTMARK}  (même que login)
```

> **Note :** Pas d'email/password. Token unique = login + password.

---

### **Phase 3 : Mettre à Jour Supabase (3 min)**

**Supabase Dashboard** → **Settings** → **SMTP Settings**

Remplace IONOS par Postmark :

```
SMTP Host:     smtp.postmarkapp.com
SMTP Port:     587
SMTP User:     {API_TOKEN_POSTMARK}
SMTP Password: {API_TOKEN_POSTMARK}
Sender Email:  noreply@serruremaster.com
Sender Name:   SerrureMaster
```

**Test :** Envoie test email depuis Settings → vérife inbox

---

### **Phase 4 : Vérifier Délivrabilité (24h)**

1. **Envoie mini campagne test :**
   - 10 emails à addresses Outlook perso
   - 10 emails à Gmail
   - 10 emails à Yahoo

2. **Vérifie Postmark Dashboard :**
   - Bounce rate (devrait 0%)
   - Spam complaints (devrait 0%)
   - Open rate (just for info)

3. **Outlook Header Check :**
   ```
   From: noreply@serruremaster.com
   DKIM:      pass (postmarkapp.com)
   SPF:       pass (v=spf1 include:postmarkapp.com)
   DMARC:     pass (existing, no change needed)
   SCL score: [should be < 0]
   ```

**Résultat attendu :** ✅ Inbox (pas Junk) + SCL:-1 à 2

---

## 💰 Coût Estimation

| Volume    | IONOS                 | Postmark       | Mailgun   |
| --------- | --------------------- | -------------- | --------- |
| 5k/mois   | Inclus (mauvaise rep) | $0 (free tier) | $0 (free) |
| 25k/mois  | Inclus                | ~$15           | ~$12.50   |
| 100k/mois | Inclus                | ~$40           | ~$50      |

**Conclusion :** Postmark + cher mais délivrabilité top. Si 5k/mois, Mailgun free tier viable.

---

## 🔄 Comparaison Effort d'Intégration

| Étape               | Postmark    | Mailgun            | SendGrid             |
| ------------------- | ----------- | ------------------ | -------------------- |
| Setup DNS           | ⭐ Facile   | ⭐⭐ Moyen         | ⭐⭐ Moyen           |
| Récup credentials   | ⭐ Auto     | ⭐ Manuel          | ⭐⭐ Deux endroits   |
| Supabase config     | ⭐ Simple   | ⭐ Simple          | ⭐ Simple            |
| Warm-up needed      | ❌ Non      | ⭐⭐⭐ Oui         | ⭐⭐⭐ Oui           |
| Vérif délivrabilité | ⭐ Quick    | ⭐⭐ Vérifier logs | ⭐⭐ Bounce handling |
| **Total Temps**     | **~15 min** | **~20 min**        | **~25 min**          |

---

## 🎯 Décision : Postmark vs Mailgun

### **J'ai peu de budget ou beaucoup de volume ?**

→ **Mailgun** (5k free + scale cheap)

### **Je veux juste que ça marche fast ?**

→ **Postmark** (meilleur out-of-box)

### **Je fais 100k+ emails/mois ?**

→ **SendGrid** (infrastructure IP dédiée)

---

## ⚠️ Important : IP Reputation

**IONOS Problème :** IP 212.227.126.130 partagée entre 1000s comptes → réputation groupée mauvaise si 1 spammeur.

**Postmark/Mailgun Solution :** Pool d'IPs dédiée par provider (rotate automatiquement) → réputation forte.

**Résultat :** Même contenu identique, Outlook va classifier :

- ❌ IONOS : SCL +5 (Junk)
- ✅ Postmark/Mailgun : SCL -1 (Inbox)

---

## 📖 Références

- [Postmark Pricing](https://postmarkapp.com/pricing)
- [Postmark Setup Guide](https://postmarkapp.com/support/article/1057-how-do-i-add-a-domain)
- [Mailgun Documentation](https://documentation.mailgun.com/)
- [SendGrid SMTP Guide](https://sendgrid.com/docs/for-developers/sending-email/integrating-with-the-smtp-api/)
- [Supabase SMTP Config](https://supabase.com/docs/guides/auth/auth-smtp/)

---

## 🚀 Plan d'Action Recommandé

### Immédiat (Cette semaine)

1. ✅ **Appliquer template HTML optimisé** (EMAIL_TEMPLATE_MAGIC_LINK.html)
2. ✅ **Setup custom domain Supabase** (suivi guide CUSTOM_DOMAIN_SUPABASE_GUIDE.md)
3. 📅 **Tester 48h** (laisser Custom Domain + Template + DMARC travailler)

### Si Outlook persiste après 48h

4. 🔄 **Créer compte Postmark** (5 min)
5. 🔄 **Ajouter SPF + DKIM Postmark à DNS** (5 min)
6. 🔄 **Swap SMTP dans Supabase** (IONOS → Postmark)
7. 📊 **Tester délivrabilité** (24h) → SCL devrait passer < 2

---

**Budget Total Recommandé :** $0-15/mois (dépend du volume)

**ROI :** 50%+ d'emails récupérés from Junk folder → plus de conversions.

Prêt à commencer ? Lequel d'abord ? 🚀
