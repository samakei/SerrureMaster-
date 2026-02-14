import { createClient } from '@supabase/supabase-js';

// Récupération directe des variables d'environnement Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag pour indiquer si la configuration est valide
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
export const supabaseConfigError = (() => {
  if (isSupabaseConfigured) return null;
  
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseKey) missing.push('VITE_SUPABASE_ANON_KEY');

  console.error('❌ Variables Supabase manquantes:', missing.join(', '));
  console.error('📋 Variables actuelles:', {
    VITE_SUPABASE_URL: supabaseUrl || '(vide)',
    VITE_SUPABASE_ANON_KEY: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '(vide)',
    MODE: import.meta.env.MODE,
  });

  const isProduction = import.meta.env.MODE === 'production';
  return isProduction
    ? `⚠️ Configuration Supabase manquante: ${missing.join(', ')}. Ajoutez-les dans .env.production.local puis: npm run build && npm run preview`
    : `⚠️ Configuration Supabase manquante: ${missing.join(', ')}. Ajoutez-les dans .env.local puis: npm run dev`;
})();

// Log de démarrage (sans exposer les clés)
if (isSupabaseConfigured) {
  console.info('✅ Supabase client initialisé:', {
    url: new URL(supabaseUrl!).host,
    keyFormat: supabaseKey!.startsWith('sb_publishable_')
      ? 'publishable'
      : supabaseKey!.startsWith('eyJ')
        ? 'JWT'
        : 'unknown',
    mode: import.meta.env.MODE,
  });
}

// Création du client Supabase avec des valeurs par défaut si non configuré
// Note: Le client avec placeholders ne doit être utilisé que si ConfigurationCheck
// empêche l'accès au reste de l'application
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
