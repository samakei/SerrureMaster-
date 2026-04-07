// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string,
  { auth: { persistSession: false } }
);

const parseIds = (raw?: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string' && x.length > 0) : [];
  } catch {
    return [];
  }
};

const getPriceIds = async (session: Stripe.Checkout.Session): Promise<string[]> => {
  const fromMetadata = [
    ...parseIds(session.metadata?.priceIds),
    ...parseIds(session.metadata?.productIds),
  ];
  if (fromMetadata.length > 0) return fromMetadata;

  const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  return lines.data
    .map((line) => line.price?.id)
    .filter((value): value is string => Boolean(value));
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return new Response(JSON.stringify({ error: 'sessionId et userId requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.mode !== 'payment') {
      return new Response(JSON.stringify({ error: 'Session Stripe invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'Paiement non confirmé', payment_status: session.payment_status }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const ownerUserId = session.client_reference_id || session.metadata?.userId;
    if (!ownerUserId || ownerUserId !== userId) {
      return new Response(JSON.stringify({ error: 'Session non liée à cet utilisateur' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripePriceIds = await getPriceIds(session);
    if (stripePriceIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun price_id trouvé dans la session' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, stripe_price_id')
      .in('stripe_price_id', stripePriceIds);

    if (productsError) {
      throw new Error(`Erreur lookup products: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun produit local correspondant' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows = products.map((product) => ({ user_id: userId, product_id: product.id }));

    const { error: upsertError } = await supabaseAdmin
      .from('user_products')
      .upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });

    if (upsertError) {
      throw new Error(`Erreur upsert user_products: ${upsertError.message}`);
    }

    return new Response(
      JSON.stringify({ ok: true, grantedProductIds: rows.map((r) => r.product_id) }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ stripe-confirm-session error:', error?.message);
    return new Response(JSON.stringify({ error: error?.message || 'Erreur interne' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
