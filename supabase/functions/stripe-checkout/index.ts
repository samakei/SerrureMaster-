// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

// Fix: Declare Deno global to resolve type error when Deno namespace is not available in the editor context
declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // 1. Gérer les requêtes CORS (Preflight OPTIONS)
  // Indispensable pour que le frontend (localhost ou vercel) puisse appeler cette fonction
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Initialisation de Stripe
    // La clé secrète doit être configurée dans les variables d'environnement Supabase
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 3. Récupération des données envoyées par le Frontend
    const { items, userId, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("Le panier est vide");
    }

    // 4. Construction des articles pour Stripe
    // Dans une app en production, il est recommandé de vérifier les prix en base de données
    // pour éviter qu'un utilisateur malin ne modifie le prix côté client.
    const lineItems = items.map((item: any) => ({
      price: item.priceId, // ID du prix Stripe (ex: price_1Op...)
      quantity: item.quantity,
    }));

    console.log(
      `Création de session pour User: ${userId} avec ${lineItems.length} articles`
    );

    // 5. Création de la Session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      // Metadonnées utiles pour les Webhooks (pour activer le produit après paiement)
      metadata: {
        userId: userId,
        productIds: JSON.stringify(items.map((i: any) => i.priceId)), // Simplification pour démo
      },
    });

    // 6. Réponse au Frontend avec l'URL de redirection
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Erreur Stripe Checkout:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
