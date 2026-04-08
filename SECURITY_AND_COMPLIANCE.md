# 🔐 SÉCURITÉ & CONFORMITÉ - SERRUREMASTER

**Référence rapide pour les aspects sécurité et conformité du projet**

---

## 📋 STATUT GLOBAL

| Aspect | Statut | Score | Priorité |
|--------|--------|-------|----------|
| 🔐 Sécurité | ⚠️ Vulnérabilités critiques | 70/100 | 🔴 Urgent |
| 📜 Conformité RGPD | ⚠️ Partiellement conforme | 75/100 | 🔴 Urgent |
| 🛡️ Protection des données | ⚠️ À améliorer | 65/100 | 🟡 Important |
| 📊 Privacy Policy | ✅ Complète | 95/100 | ✅ Conforme |

**⚠️ ATTENTION**: 4 problèmes critiques à corriger avant production

---

## 🚨 PROBLÈMES CRITIQUES

### 1. API Key Gemini Exposée (CVSS 9.1)
**Fichier**: `services/geminiService.ts`

**Problème**: Clé API Google Gemini visible dans le code client
```typescript
// ❌ PROBLÈME
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

**Impact**:
- Facturation Google illimitée
- Abus de quota API
- Vol de la clé par extraction du bundle JS

**Solution**: Migrer vers Edge Function backend
**Délai**: 1 semaine
**Référence**: [AUDIT_DATA_COMPLIANCE.md](./AUDIT_DATA_COMPLIANCE.md#critique-1-api-key-exposée)

---

### 2. Absence de Rate Limiting (CVSS 7.5)
**Fichier**: `components/ChatWidget.tsx`

**Problème**: Aucune limite sur le nombre de messages envoyés au chatbot

**Impact**:
- Spam API → coûts exponentiels
- Déni de service potentiel
- Abus du service

**Solution**: Implémenter limite 10 messages/minute/utilisateur
**Délai**: 3 jours
**Référence**: [AUDIT_DATA_COMPLIANCE.md](./AUDIT_DATA_COMPLIANCE.md#critique-2-pas-de-rate-limiting)

---

### 3. Google Gemini Non Documenté (RGPD Art. 13)
**Fichier**: `components/PrivacyPolicy.tsx`

**Problème**: Transfert de données vers Google non mentionné dans la politique de confidentialité

**Impact**:
- Non-conformité RGPD Article 13 (information)
- Transfert international non documenté
- Absence de base légale

**Solution**: Ajouter section Google Gemini dans Privacy Policy
**Délai**: 2 jours
**Référence**: [AUDIT_DATA_COMPLIANCE.md](./AUDIT_DATA_COMPLIANCE.md#critique-google-gemini)

---

### 4. Droit à l'Effacement Manquant (RGPD Art. 17)
**Fichier**: `components/Dashboard.tsx`

**Problème**: Pas de fonction "Supprimer mon compte"

**Impact**:
- Non-conformité RGPD Article 17
- Impossibilité d'exercer le droit à l'effacement
- Risque de réclamation CNIL

**Solution**: Implémenter fonction de suppression de compte
**Délai**: 1 semaine
**Référence**: [AUDIT_DATA_COMPLIANCE.md](./AUDIT_DATA_COMPLIANCE.md#droit-à-leffacement)

---

## 🟡 PROBLÈMES IMPORTANTS

### 5. LocalStorage Non Chiffré
**Impact**: Données sensibles (panier, consentement) stockées en clair
**Délai**: 2 semaines

### 6. Droit à la Portabilité Manquant
**Impact**: Non-conformité RGPD Article 20
**Délai**: 2 semaines

### 7. Absence de CSP Headers
**Impact**: Vulnérabilité XSS potentielle
**Délai**: 2 semaines

### 8. Registre des Traitements Manquant
**Impact**: Non-conformité RGPD Article 30
**Délai**: 1 semaine

---

## ✅ POINTS FORTS

### Sécurité
- ✅ HTTPS obligatoire (TLS 1.3)
- ✅ Encryption base de données (AES-256)
- ✅ Row Level Security (RLS) sur toutes les tables
- ✅ Session JWT avec expiration automatique
- ✅ Signed URLs pour téléchargements (expire 1h)
- ✅ Audit logging des actions sensibles
- ✅ Watermarking anti-piratage

### Conformité RGPD
- ✅ Politique de confidentialité complète
- ✅ Cookie banner granulaire (opt-in/opt-out)
- ✅ DPO désigné (dpo@serruremaster.com)
- ✅ Droit d'accès (dashboard utilisateur)
- ✅ Droit de rectification (édition profil)
- ✅ Minimisation des données
- ✅ Durées de conservation définies

---

## 📊 DONNÉES COLLECTÉES

### Données Personnelles
| Type | Obligatoire | Durée | Base Légale |
|------|-------------|-------|-------------|
| Email | ✅ Oui | Compte actif + 1 an | Contrat |
| Nom | ❌ Non | Compte actif + 1 an | Consentement |
| User ID | ✅ Oui | Compte actif + 1 an | Intérêt légitime |
| Historique achats | ✅ Oui | 10 ans | Obligation légale |
| IP (logs) | ⚠️ Oui | 12 mois | ⚠️ Non documentée |
| Conversations IA | ⚠️ Oui | Session | ⚠️ Non documentée |

---

## 🌍 SOUS-TRAITANTS & TRANSFERTS

| Service | Pays | Données Transférées | DPA | Statut |
|---------|------|---------------------|-----|--------|
| **Supabase** | 🇪🇺 EU-West-1 | DB, Auth, Storage | ✅ | Conforme |
| **Stripe** | 🇺🇸 USA | Paiements | ✅ SCCs | Conforme |
| **Google Gemini** | 🇺🇸 USA | Chat messages | ❌ ? | ⚠️ À vérifier |

**⚠️ Action requise**: Obtenir DPA (Data Processing Agreement) de Google pour Gemini AI

---

## 🛡️ CHECKLIST SÉCURITÉ

### Avant Production
- [ ] API keys sécurisées (backend uniquement)
- [ ] Rate limiting actif (10 req/min)
- [ ] CSP headers configurés
- [x] HTTPS obligatoire (HSTS)
- [x] Audit logs fonctionnels
- [x] RLS actif sur toutes les tables
- [ ] Scan de vulnérabilités (OWASP ZAP)
- [x] Dépendances à jour (npm audit)

### Conformité RGPD
- [x] Privacy policy complète
- [ ] Registre des traitements (Art. 30)
- [x] DPO désigné
- [x] Cookie banner granulaire
- [ ] Droit à l'effacement
- [ ] Droit à la portabilité
- [ ] SCCs signés (tous sous-traitants)
- [ ] Transfer Impact Assessment

---

## 📋 PLAN D'ACTION PRIORITAIRE

### Semaine 1 (CRITIQUE)
1. 🔴 Sécuriser API Gemini (Edge Function)
2. 🔴 Documenter Google Gemini (Privacy Policy)
3. 🔴 Implémenter rate limiting

### Semaine 2 (CRITIQUE)
4. 🔴 Implémenter droit à l'effacement
5. 🟡 Créer registre des traitements
6. 🟡 Ajouter CSP headers

### Semaine 3-4 (IMPORTANT)
7. 🟡 Implémenter droit à la portabilité
8. 🟡 Chiffrer localStorage
9. 🟡 Obtenir DPA Google Gemini

---

## 🧪 TESTS DE SÉCURITÉ

### Tests Automatisés
```bash
# Audit des dépendances npm
npm audit

# Scan de vulnérabilités (si CodeQL configuré)
npm run security:scan

# Vérifier qu'aucune clé API dans le bundle
npm run build
grep -r "VITE_GEMINI_API_KEY" dist/
# Attendu: Aucun résultat
```

### Tests Manuels
1. **Cookie Consent**: Ouvrir en navigation privée → Banner s'affiche
2. **RLS**: Tenter d'accéder aux données d'un autre user → Refusé
3. **Session Expiry**: Attendre 1h → Session expirée automatiquement
4. **Signed URLs**: Tenter d'accéder au-delà de 1h → Lien expiré

---

## 📚 RESSOURCES

### Documentation Interne
- 📄 [AUDIT_DATA_COMPLIANCE.md](./AUDIT_DATA_COMPLIANCE.md) - Audit complet (800 lignes)
- 📄 [AUDIT_DATA_COMPLIANCE_SUMMARY.md](./AUDIT_DATA_COMPLIANCE_SUMMARY.md) - Résumé exécutif
- 📄 [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Index de toute la documentation

### Guides Externes
- 🔗 [CNIL - Guide du Développeur](https://www.cnil.fr/fr/guide-developpeur)
- 🔗 [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- 🔗 [Supabase Security Best Practices](https://supabase.com/docs/guides/database/postgres/security)
- 🔗 [ANSSI - Guide Sécurité](https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-un-systeme-gnu-linux/)

### Conformité RGPD
- 🔗 [RGPD - Texte officiel](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- 🔗 [CNIL - Modèles de registres](https://www.cnil.fr/fr/RGDP-le-registre-des-activites-de-traitement)
- 🔗 [Stripe GDPR Compliance](https://stripe.com/guides/general-data-protection-regulation)

---

## 📞 CONTACTS URGENTS

### Sécurité
**En cas d'incident de sécurité**:
1. Contacter immédiatement le responsable technique
2. Documenter l'incident (date, heure, nature, impact)
3. Notifier le DPO si données personnelles compromises
4. Préparer notification CNIL (72h si requis)

### Conformité RGPD
**Data Protection Officer (DPO)**  
Email: dpo@serruremaster.com  
Rôle: Gestion des demandes RGPD, conseils conformité

**CNIL (Autorité de contrôle)**  
Web: https://www.cnil.fr  
Tél: 01 53 73 22 22  
Rôle: Réclamations, violations de données

---

## 📊 INDICATEURS À SURVEILLER

### Sécurité
- Nombre d'incidents de sécurité: **0/mois** (cible)
- Temps de patch des vulnérabilités: **<7 jours** (cible)
- Score npm audit: **0 vulnérabilités critiques** (cible)

### Conformité
- Temps de réponse demandes RGPD: **<30 jours** (obligation légale)
- Taux d'opt-out analytics: **Surveillance** (indicateur satisfaction)
- Audits de conformité: **2/an** (recommandé)

---

## 🎯 OBJECTIFS COURT TERME

### D'ici 2 Semaines
- [ ] Résoudre 4 problèmes critiques
- [ ] Score sécurité: 70% → 90%
- [ ] Score conformité: 75% → 95%

### D'ici 1 Mois
- [ ] 100% conforme RGPD
- [ ] Audit externe passé
- [ ] Documentation complète
- [ ] Tests de sécurité automatisés

---

## ⚠️ RAPPEL IMPORTANT

**NE PAS DÉPLOYER EN PRODUCTION** sans avoir corrigé:
1. 🔴 API Key Gemini exposée
2. 🔴 Google Gemini non documenté
3. 🔴 Droit à l'effacement manquant
4. 🔴 Rate limiting absent

**Risques**:
- Facture Google illimitée
- Amende CNIL (jusqu'à 20M€ ou 4% CA)
- Réclamations utilisateurs
- Atteinte à la réputation

---

**Version**: 1.0  
**Dernière mise à jour**: 12 février 2026  
**Prochaine revue**: 12 mai 2026 (3 mois)

_Document de référence rapide - Consulter [AUDIT_DATA_COMPLIANCE.md](./AUDIT_DATA_COMPLIANCE.md) pour détails complets_
