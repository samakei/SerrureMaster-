// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const LOCKED_DOOR_RESPONSE = `Merci pour votre précision.

Dans ce cas, lorsque la porte est fermée à clé, nos plans d’action pédagogiques à distance ne sont pas adaptés.

Pour éviter tout risque de dommage ou de situation illégale, nous vous recommandons de faire appel à un professionnel sur place.

SerrureMaster intervient uniquement sur des situations compatibles (porte claquée non verrouillée).

Si vous avez une autre situation ou une question générale, je reste à votre disposition.`;

const toComparable = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isLockedDoorCase = (value: string): boolean => {
  const comparable = toComparable(value || '');
  const blockedPatterns = [
    'fermee a cle',
    'cle tournee',
    'verrouillee',
    'cle a l interieur et verrouillee',
  ];

  return blockedPatterns.some((pattern) => comparable.includes(pattern));
};

const extractUserIdFromJwt = (authHeader: string | null): string | null => {
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  try {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return typeof payload?.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
};

const persistChatLog = async (payload: Record<string, unknown>) => {
  try {
    await supabaseAdmin.from('chatbot_conversations').insert(payload);
  } catch (error: any) {
    console.warn('chatbot_conversations insert skipped:', error?.message || error);
  }
};

const buildContextInstruction = (isCustomer: boolean) => {
  if (isCustomer) {
    return `
CONTEXTE : L'utilisateur est CLIENT (a deja achete).
TON ROLE : Assistant Technique SerrureMaster (Support Post-Achat).

REGLES STRICTES :
0. Si l'utilisateur indique une porte fermee a cle, cle tournee, porte verrouillee,
   ou cle a l'interieur et verrouillee, reponds UNIQUEMENT avec le message
   de non-compatibilite standard, sans reformuler.
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
- Si cas non compatible (porte fermee a cle / verrouillee), arreter la qualification,
  afficher le message standard, puis proposer de revenir a l'accueil ou une aide generale non technique.
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
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const authHeader = req.headers.get('authorization');
    const userId = extractUserIdFromJwt(authHeader);

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const latestUserHistory = [...history]
      .reverse()
      .find((entry: any) => entry?.role === 'user' && entry?.parts?.[0]?.text)?.parts?.[0]?.text;

    if (isLockedDoorCase(message) || (latestUserHistory && isLockedDoorCase(latestUserHistory))) {
      await persistChatLog({
        user_id: userId,
        message,
        response: LOCKED_DOOR_RESPONSE,
        is_customer: isCustomer,
        is_non_compatible_case: true,
        rule_trigger: 'LOCKED_DOOR',
        model: 'policy-override',
        ip,
        user_agent: userAgent,
      });

      return new Response(JSON.stringify({ response: LOCKED_DOOR_RESPONSE }), {
        status: 200,
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

    await persistChatLog({
      user_id: userId,
      message,
      response: text,
      is_customer: isCustomer,
      is_non_compatible_case: false,
      rule_trigger: null,
      model,
      ip,
      user_agent: userAgent,
    });

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('gemini-chat error:', error?.message || error);

    const safeMessage =
      typeof error?.message === 'string' && error.message.length > 0
        ? error.message
        : 'Erreur interne';

    try {
      const body = await req.clone().json();
      await persistChatLog({
        user_id: extractUserIdFromJwt(req.headers.get('authorization')),
        message: typeof body?.message === 'string' ? body.message : '',
        response:
          'Le chatbot est temporairement indisponible. Pour une assistance immediate, contactez-nous via WhatsApp au +33 7 57 57 03 89.',
        is_customer: Boolean(body?.isCustomer),
        is_non_compatible_case: false,
        rule_trigger: 'RUNTIME_ERROR',
        model: 'error',
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        error_message: safeMessage,
      });
    } catch {
      // Ignore logging parsing errors in catch flow.
    }

    return new Response(
      JSON.stringify({
        error: safeMessage,
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
