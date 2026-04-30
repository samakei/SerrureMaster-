import { supabase } from './supabaseClient';

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  isCustomer: boolean = false
): Promise<string> => {
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
