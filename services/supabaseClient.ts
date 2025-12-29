import { createClient } from '@supabase/supabase-js';

// Fonction utilitaire robuste pour récupérer les variables d'environnement
// Compatible Vite (import.meta.env) et Node/CRA (process.env)
const getEnvVar = (keys: string[]): string | undefined => {
  // 1. Essayer Vite (import.meta.env)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    for (const key of keys) {
      // @ts-ignore
      const val = import.meta.env[key];
      if (val) return val;
    }
  }
  
  // 2. Essayer Process (process.env) pour compatibilité
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    for (const key of keys) {
      // @ts-ignore
      const val = process.env[key];
      if (val) return val;
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