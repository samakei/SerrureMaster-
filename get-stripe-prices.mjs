// Script simple pour récupérer les Price IDs Stripe
// Exécutez avec: node get-stripe-prices.mjs

import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const secretKey = envFile.match(/STRIPE_SECRET_KEY=(.+)/)?.[1]?.trim();

if (!secretKey) {
  console.error('❌ STRIPE_SECRET_KEY non trouvée');
  process.exit(1);
}

console.log('🔍 Récupération...\n');

const response = await fetch('https://api.stripe.com/v1/products?active=true&limit=100', {
  headers: { Authorization: `Bearer ${secretKey}` },
});

const { data: products } = await response.json();
console.log(`✅ ${products.length} produits:\n`);

for (const product of products) {
  const priceResp = await fetch(
    `https://api.stripe.com/v1/prices?product=${product.id}&active=true&limit=1`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    }
  );
  const { data: prices } = await priceResp.json();
  const price = prices[0];

  console.log(`${product.name}`);
  console.log(`  Price ID: ${price?.id || 'N/A'}`);
  console.log(`  Montant: ${price?.unit_amount ? price.unit_amount / 100 : 0}€\n`);
}

console.log('\n📋 COMMANDES SQL À EXÉCUTER:\n');
console.log('-- Copiez dans Supabase SQL Editor --\n');
