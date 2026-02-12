# 🏦 Stripe Configuration Guide

## Overview

SerrureMaster utilise **Stripe** pour le traitement des paiements. Ce guide explique comment configurer votre clé Stripe de test.

---

## 📋 Current Configuration

### Test Keys (Sandbox)

```env
# Public Key (Frontend - Safe)
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY

# Secret Key (Backend - Supabase Edge Functions)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

---

## 🚀 Getting Started

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click **Sign Up**
3. Fill in your business details
4. Verify your email

### Step 2: Get Your Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Ensure **Test mode** is enabled (toggle in top right)
3. Navigate to **Developers** > **API Keys**
4. Copy your keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### Step 3: Update Configuration

#### For Development (.env.local)

```bash
# 1. Open .env.local
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY

# 2. For backend/Edge Functions, set in Supabase:
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET
```

#### For Production (.env.production)

```bash
# Use live keys (without 'test_')
VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET
```

---

## 🔑 Key Types Explained

### Public Key (pk*test*...)

- **Visibility**: Frontend (visible in browser)
- **Usage**: Initialize Stripe.js on client
- **Security**: Safe to expose
- **Location**: `.env.local` (VITE_STRIPE_PUBLIC_KEY)

### Secret Key (sk*test*...)

- **Visibility**: Backend only
- **Usage**: Server-side API calls
- **Security**: Keep private!
- **Location**: Supabase secrets
- **Never**: Commit to git or expose in frontend

---

## 📁 Integration Points

### Frontend (React)

```typescript
// App.tsx or checkout component
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Use in checkout
const stripe = await stripePromise;
```

### Backend (Supabase Edge Functions)

```typescript
// supabase/functions/stripe-checkout/index.ts
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string);
```

---

## 🧪 Testing with Test Cards

Stripe provides test cards for development:

### Test Cards for Development

| Card Number         | CVC          | Expiry          | Use Case           |
| ------------------- | ------------ | --------------- | ------------------ |
| 4242 4242 4242 4242 | Any 3 digits | Any future date | Successful payment |
| 4000 0000 0000 0002 | Any 3 digits | Any future date | Declined card      |
| 5555 5555 5555 4444 | Any 3 digits | Any future date | Visa card          |
| 3782 822463 10005   | Any 4 digits | Any future date | American Express   |

**Example**:

- Card: `4242 4242 4242 4242`
- CVC: `424`
- Date: `12/25`
- Name: `Test User`

---

## 🔐 Security Checklist

✅ **DO**

- ✅ Keep secret keys in `.env` (never commit)
- ✅ Use test keys for development
- ✅ Rotate keys periodically
- ✅ Use HTTPS in production
- ✅ Validate amounts on backend
- ✅ Never expose secret key to frontend

❌ **DON'T**

- ❌ Commit `.env.local` to git
- ❌ Share secret keys via email/chat
- ❌ Use live keys in development
- ❌ Log sensitive payment data
- ❌ Hardcode keys in code

---

## 🚨 Environment Variables Setup

### Vite Configuration (.env.local)

```bash
# Public key for frontend
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
```

### Supabase Edge Functions Secrets

```bash
# 1. Go to Supabase Dashboard
# 2. Project Settings > Edge Functions > Secrets
# 3. Add secret: STRIPE_SECRET_KEY = sk_test_YOUR_SECRET
```

### GitHub Actions (for CI/CD)

```yaml
# .github/workflows/tests.yml
env:
  STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
```

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"

**Solution**: Check that you're using test keys (contain `test_`)

### Issue: "Key not found in environment"

**Solution**: Verify VITE_STRIPE_PUBLIC_KEY is in `.env.local`

### Issue: "Card was declined"

**Solution**: Use test card `4242 4242 4242 4242` for successful payment

### Issue: "CORS error on checkout"

**Solution**: Verify Stripe domain is whitelisted in Stripe Dashboard

### Issue: "Payment method not found"

**Solution**: Check that Stripe Session creation includes payment methods

---

## 📊 Integration Status

| Component      | Status        | Details                  |
| -------------- | ------------- | ------------------------ |
| **Public Key** | ✅ Configured | In `.env.local`          |
| **Secret Key** | 📋 Pending    | Add to Supabase secrets  |
| **Frontend**   | ✅ Ready      | Stripe.js integrated     |
| **Backend**    | ✅ Ready      | Edge Function configured |
| **Test Cards** | ✅ Available  | Use provided test cards  |

---

## 🔄 Setup Instructions

### 1. Development Setup (Local)

```bash
# 1. Copy test keys from Stripe Dashboard
# 2. Update .env.local:
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY

# 3. Test with:
npm run dev

# 4. Use test card: 4242 4242 4242 4242
```

### 2. Production Setup (Deploy)

```bash
# 1. Get live keys from Stripe Dashboard
# 2. Add to hosting platform:
#    - Vercel/Netlify: Project Settings > Environment Variables
#    - AWS: Systems Manager Parameter Store
# 3. Set in code:
VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY

# 4. Add secret to Supabase:
#    - Settings > Edge Functions > Secrets
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET
```

---

## 📚 Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe JavaScript SDK](https://stripe.com/docs/stripe-js)

---

## ✅ Verification Checklist

Before going live:

- [ ] Test keys configured for development
- [ ] Test card payments working
- [ ] `.env.local` not committed to git
- [ ] Secret key in Supabase secrets
- [ ] Live keys prepared (not yet deployed)
- [ ] Error handling implemented
- [ ] Payment flow tested end-to-end
- [ ] Security review completed

---

## 📞 Need Help?

- Check Stripe Dashboard for API status
- Review [Stripe documentation](https://stripe.com/docs)
- Check edge function logs in Supabase
- Enable test mode in Stripe to see live dashboard

---

**Last Updated**: 26 Décembre 2025  
**Status**: ✅ Test Keys Configured  
**Next Step**: Add live keys before production deployment
