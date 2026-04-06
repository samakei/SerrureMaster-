# Stripe Webhook Setup (sans abonnements)

Ce projet utilise Stripe Checkout en `mode: payment`.
Les webhooks recommandés (et implémentés) sont uniquement les événements non-abonnement.

## Événements à configurer dans Stripe Dashboard

- `checkout.session.completed` ✅ (critique)
- `checkout.session.expired`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`

## Endpoint à créer dans Stripe

URL:

`https://<PROJECT_REF>.functions.supabase.co/stripe-webhook`

## Secrets requis (Supabase Edge Functions)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (le `whsec_...` de Stripe)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Déploiement

```bash
supabase functions deploy stripe-webhook --no-verify-jwt
```

Webhook Stripe:

- Méthode: `POST`
- Signature vérifiée via `stripe-signature`

## Comportement backend actuel

- `checkout.session.completed`: attribution d'accès dans `public.user_products` (idempotent via `upsert` + contrainte unique `(user_id, product_id)`).
- `checkout.session.expired`: log d'expiration.
- `payment_intent.payment_failed`: log d'échec paiement.
- `charge.refunded`: log de remboursement.
- `charge.dispute.created`: log de litige.

## Test local rapide avec Stripe CLI

```bash
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook
```

Puis copier le `whsec_...` retourné dans la variable `STRIPE_WEBHOOK_SECRET`.
