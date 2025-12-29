# 📋 ORDRE D'EXÉCUTION DES SCRIPTS SQL

## ⚠️ IMPORTANT : Exécutez dans CET ORDRE dans Supabase SQL Editor

### 1️⃣ fix-product-ids-logic.sql

**Renomme les IDs pour logique p1→p2→p3→p4→p5→p6**

- p6_security_pack → p4_security_pack
- p7_audit_security → p5_audit_security
- p5_survival_kit → p6_survival_kit

### 2️⃣ update-real-stripe-prices.sql

**Met les VRAIS Price IDs de votre compte Stripe**

- price_1SiPxGDs1RajryhDI67AEulE (p1)
- price_1SiQ6RDs1RajryhDOqqWBLm1 (p2)
- price_1SiQBSDs1RajryhDzxFr1t86 (p3)
- price_1SiQFaDs1RajryhDS8jfoNIm (p4)
- price_1SiQKMDs1RajryhDsu55why0 (p5)
- price_1SiQN7Ds1RajryhD1bnlfKel (p6)

### 3️⃣ fix-profile-406.sql

**Crée votre profil utilisateur**

- ID: d9d1fddb-4900-4552-bd5c-5dcd9c187fb1
- Email: samakeissa10@outlook.fr

### 4️⃣ set-admin-role.sql

**Vous donne le rôle admin**

### 5️⃣ update-product-images.sql

**Met les chemins vers vos images locales**

- /images/p1.jpg → /images/p6.jpg

---

## ✅ Après l'exécution

1. Rechargez localhost:5173
2. Testez le panier → Payer
3. Le message "Mode Démo" doit disparaître !
