import { supabase } from './supabaseClient';

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
  const comparable = toComparable(value);
  const blockedPatterns = [
    'fermee a cle',
    'cle tournee',
    'verrouillee',
    'cle a l interieur et verrouillee',
  ];

  return blockedPatterns.some((pattern) => comparable.includes(pattern));
};

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  isCustomer: boolean = false
): Promise<string> => {
  const latestUserHistory = [...history]
    .reverse()
    .find((entry) => entry?.role === 'user' && entry?.parts?.[0]?.text)?.parts?.[0]?.text;

  if (isLockedDoorCase(message) || (latestUserHistory && isLockedDoorCase(latestUserHistory))) {
    return LOCKED_DOOR_RESPONSE;
  }

  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: {
        history,
        message,
        isCustomer,
      },
    });

    if (error) {
      throw new Error(error.message || 'Edge Function Gemini indisponible');
    }

    const text =
      data?.response ?? data?.text ?? data?.message ?? data?.content ?? data?.data?.response;

    if (typeof text === 'string' && text.trim().length > 0) {
      return text;
    }

    return 'Je ne suis pas sûr de comprendre. Pouvez-vous préciser votre situation ?';
  } catch (error) {
    console.error('Gemini Edge Function Error:', error);
    return 'Le chatbot est temporairement indisponible. Pour une assistance immédiate, contactez-nous via WhatsApp au +33 7 57 57 03 89.';
  }
};
