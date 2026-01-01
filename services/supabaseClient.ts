import { createClient } from '@supabase/supabase-js';

// Récupère une variable depuis import.meta.env (Vite) sans ts-ignore ni process.env côté client
const getEnvVar = (keys: string[]): string | undefined => {
  const env = (import.meta as any)?.env;
  if (env) {
    for (const key of keys) {
      const val = env[key];
      if (typeof val === 'string' && val) return val;
    }
  }
  return undefined;
};

// Ordre de priorité : NEXT_PUBLIC_ (Votre config) > VITE_ (Standard Vite) > REACT_APP_ (Legacy)
const supabaseUrl = getEnvVar([
    'NEXT_PUBLIC_SUPABASE_URL', 
    'VITE_SUPABASE_URL', 
    'REACT_APP_SUPABASE_URL'
]) || 'https://votre-projet.supabase.co';

const supabaseKey = getEnvVar([
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'VITE_SUPABASE_ANON_KEY', 
    'REACT_APP_SUPABASE_ANON_KEY'
]) || 'votre-cle-anon-publique';

// Création du client
// La Service Role Key n'est JAMAIS utilisée ici pour des raisons de sécurité
export const supabase = createClient(supabaseUrl, supabaseKey);