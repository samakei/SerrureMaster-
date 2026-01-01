import { createClient } from '@supabase/supabase-js';

// Récupération directe des variables d'environnement Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation des variables requises
if (!supabaseUrl || !supabaseKey) {
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
  const msg = isProduction
    ? `⚠️ Configuration Supabase manquante: ${missing.join(', ')}. Ajoutez-les dans .env.production.local puis: npm run build && npm run preview`
    : `⚠️ Configuration Supabase manquante: ${missing.join(', ')}. Ajoutez-les dans .env.local puis: npm run dev`;

  throw new Error(msg);
}

// Log de démarrage (sans exposer les clés)
console.info('✅ Supabase client initialisé:', {
  url: new URL(supabaseUrl).host,
  keyFormat: supabaseKey.startsWith('sb_publishable_')
    ? 'publishable'
    : supabaseKey.startsWith('eyJ')
      ? 'JWT'
      : 'unknown',
  mode: import.meta.env.MODE,
});

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
