import { supabase } from './supabaseClient';
import { CartItem } from '../types';

export const createCheckoutSession = async (userId: string, items: CartItem[]) => {
  try {
    console.log('🔍 createCheckoutSession called with:', { userId, items });

    // Vérifier que tous les items ont un stripePriceId
    const invalidItems = items.filter((item) => !item.stripePriceId);
    if (invalidItems.length > 0) {
      console.error('❌ Items sans stripePriceId:', invalidItems);
      throw new Error(`Certains produits n'ont pas de Price ID Stripe configuré`);
    }

    // On appelle la Supabase Edge Function 'stripe-checkout'
    // C'est l'équivalent d'une Server Action ou Route API sécurisée
    const payload = {
      userId,
      items: items.map((item) => ({
        priceId: item.stripePriceId,
        quantity: item.quantity,
      })),
      successUrl: `${window.location.origin}/dashboard?status=success`,
      cancelUrl: `${window.location.origin}/?status=cancel`,
    };

    console.log('📤 Payload envoyé à stripe-checkout:', payload);

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: payload,
    });

    console.log('📥 Réponse de stripe-checkout:', { data, error });

    if (error) throw error;
    if (!data?.url) throw new Error("Pas d'URL de redirection retournée par Stripe");

    // Redirection vers la page de paiement Stripe hébergée
    console.log('✅ Redirection vers:', data.url);
    window.location.href = data.url;
  } catch (error) {
    console.error('❌ Erreur dans createCheckoutSession:', error);
    // Rethrow to be handled by the caller (App.tsx) which has logic for demo fallback
    throw error;
  }
};
