// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const buildContextInstruction = (isCustomer: boolean) => {
  if (isCustomer) {
    return `
CONTEXTE : L'utilisateur est CLIENT (a deja achete).
TON ROLE : Assistant Technique SerrureMaster (Support Post-Achat).

REGLES STRICTES :
1. Ne jamais donner d'instructions techniques detaillees.
2. Renvoyer vers les guides PDF/Video de l'espace membre.
3. En cas de blocage, proposer envoi photo via WhatsApp pour validation.
4. Rappeler obligation de moyens, pas de resultat.
`;
  }

  return `
CONTEXTE : L'utilisateur est VISITEUR (Prospection).
TON ROLE : Assistant Technique SerrureMaster (Filtrage & Orientation).
OBJECTIF : Qualifier la situation pour verifier la compatibilite avec les guides payants.

CONTRAINTES :
- Professionnel, neutre, calme.
- Messages courts.
- Aucun detail technique exploitable.
- En cas de doute, recommander de ne pas agir.
`;
};

const buildConversationContext = (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  isCustomer: boolean
) => {
  const systemInstruction = `
Tu es l'Assistant Technique SerrureMaster sur WhatsApp.
${buildContextInstruction(isCustomer)}

REGLES GLOBALES :
- Ne sors jamais de ton role.
- Ne donne jamais la solution technique detaillee.
- Reste courtois mais ferme sur le cadre legal.
`;

  let conversationContext = systemInstruction + '\n\nHistorique de conversation:\n';
  (history || []).forEach((h) => {
    const who = h?.role === 'user' ? 'Utilisateur' : 'SerrureMaster';
    const text = h?.parts?.[0]?.text || '';
    conversationContext += `${who}: ${text}\n`;
  });
  conversationContext += `Utilisateur: ${message}\nSerrureMaster:`;

  return conversationContext;
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY manquante dans les secrets Supabase');
    }

    const body = await req.json();
    const history = body?.history || [];
    const message = body?.message || '';
    const isCustomer = Boolean(body?.isCustomer);

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildConversationContext(history, message, isCustomer);

    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 600,
        },
      }),
    });

    const geminiJson = await geminiRes.json();

    if (!geminiRes.ok) {
      const reason = geminiJson?.error?.message || 'Erreur API Gemini';
      throw new Error(reason);
    }

    const text =
      geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Je ne suis pas sur de comprendre. Pouvez-vous preciser votre situation ?';

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('gemini-chat error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Erreur interne',
        response:
          'Le chatbot est temporairement indisponible. Pour une assistance immediate, contactez-nous via WhatsApp au +33 7 57 57 03 89.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
