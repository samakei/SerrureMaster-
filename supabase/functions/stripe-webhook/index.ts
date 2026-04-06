// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, stripe-signature',
};

const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.payment_failed',
  'charge.refunded',
  'charge.dispute.created',
]);

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string,
  { auth: { persistSession: false } }
);

const parseProductIds = (raw?: string | null): string[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry) => typeof entry === 'string' && entry.length > 0);
    }
  } catch {
    return [];
  }

  return [];
};

const getPriceIdsFromSession = async (session: Stripe.Checkout.Session): Promise<string[]> => {
  const fromMetadata = [
    ...parseProductIds(session.metadata?.priceIds),
    ...parseProductIds(session.metadata?.productIds),
  ];
  if (fromMetadata.length > 0) return fromMetadata;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  return lineItems.data
    .map((line) => line.price?.id)
    .filter((priceId): priceId is string => Boolean(priceId));
};

const grantPurchasedProducts = async (session: Stripe.Checkout.Session) => {
  const userId = session.client_reference_id || session.metadata?.userId;
  if (!userId) {
    throw new Error(`checkout.session.completed sans userId (session: ${session.id})`);
  }

  const stripePriceIds = await getPriceIdsFromSession(session);
  if (stripePriceIds.length === 0) {
    throw new Error(`Aucun stripe_price_id trouvé (session: ${session.id})`);
  }

  const { data: products, error: productError } = await supabaseAdmin
    .from('products')
    .select('id, stripe_price_id')
    .in('stripe_price_id', stripePriceIds);

  if (productError) {
    throw new Error(`Erreur lookup products: ${productError.message}`);
  }

  if (!products || products.length === 0) {
    throw new Error(
      `Aucun produit local ne correspond aux Price IDs Stripe (session: ${session.id})`
    );
  }

  const rows = products.map((product) => ({
    user_id: userId,
    product_id: product.id,
  }));

  const { error: grantError } = await supabaseAdmin
    .from('user_products')
    .upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });

  if (grantError) {
    throw new Error(`Erreur upsert user_products: ${grantError.message}`);
  }

  console.log(
    `✅ Accès attribués pour user=${userId}, session=${session.id}, products=${rows
      .map((row) => row.product_id)
      .join(',')}`
  );
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!webhookSecret) {
    return new Response(JSON.stringify({ error: 'STRIPE_WEBHOOK_SECRET manquant' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Header stripe-signature manquant' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('❌ Signature webhook invalide:', error?.message);
    return new Response(JSON.stringify({ error: 'Signature invalide' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await grantPurchasedProducts(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`ℹ️ Session expirée: ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const failureReason = paymentIntent.last_payment_error?.message || 'raison inconnue';
        console.warn(`⚠️ Paiement échoué: ${paymentIntent.id} (${failureReason})`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.warn(
          `↩️ Remboursement reçu: charge=${charge.id}, amount_refunded=${charge.amount_refunded}`
        );
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.warn(`🚨 Litige créé: dispute=${dispute.id}, charge=${dispute.charge}`);
        break;
      }

      default:
        break;
    }

    return new Response(JSON.stringify({ received: true, type: event.type }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Erreur traitement webhook:', error?.message);
    return new Response(JSON.stringify({ error: 'Erreur traitement webhook' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
