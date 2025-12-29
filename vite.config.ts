import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge toutes les variables d'environnement (inclus .env.local)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [
      react({
        // Optimiser le runtime React
      }),
    ],
    // Permet à Vite de charger les variables commençant par NEXT_PUBLIC_ (compatibilité)
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      // Injection sécurisée de la clé API
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill de sécurité pour éviter "process is not defined" si une lib l'appelle
      'process.env': JSON.stringify({}),
      process: JSON.stringify({ env: {} }),
    },
    build: {
      // Utiliser un dossier de sortie différent temporairement
      outDir: 'build',
      // Optimisations de production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Supprimer les console.log en production
          drop_debugger: true,
          passes: 2, // Multiple passes pour meilleure compression
          pure_funcs: ['console.log', 'console.info'], // Supprimer ces fonctions
        },
        mangle: {
          safari10: true, // Support Safari 10+
        },
        format: {
          comments: false, // Supprimer tous les commentaires
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Séparer les vendor chunks pour un meilleur cache
            'react-vendor': ['react', 'react-dom'],
            icons: ['lucide-react'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
      // Optimiser les chunks
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      // Réduire le nombre de chunks
      reportCompressedSize: false, // Désactiver le rapport de taille (plus rapide)
      sourcemap: false, // Pas de sourcemaps en prod pour réduire la taille
    },
  };
});
