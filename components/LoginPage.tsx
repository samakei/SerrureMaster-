import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Loader2, AlertCircle, Unlock } from 'lucide-react';
import { LOGO_URL, APP_NAME } from '../constants';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setError(null);
    setStatus('loading');

    try {
      // Authentification réelle via Supabase Magic Link
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setStatus('sent');
    } catch (err: any) {
      console.error('Erreur Login:', err);

      // Explicitly check for fetch failure (Backend not reachable / Keys missing)
      if (
        err.message &&
        (err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('network'))
      ) {
        setError(
          "⚠️ Serveur inaccessible (Mode Démo). Veuillez utiliser le bouton 'Connexion Démo' ci-dessous."
        );
      } else {
        setError(err.message || "Impossible d'envoyer le lien. Vérifiez votre email.");
      }
      setStatus('idle');
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess('demo@serruremaster.com');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <img
              src={LOGO_URL}
              alt={APP_NAME}
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">Connexion Sécurisée</h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Accédez à votre Espace Membre et à vos guides.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-lg border border-slate-700 py-8 px-4 shadow-2xl rounded-xl sm:px-10">
          {status === 'idle' || status === 'loading' ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Adresse Email
                </label>{' '}
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Adresse email
                </label>{' '}
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm py-3 transition-colors"
                    placeholder="vous@exemple.com"
                  />
                </div>
                {error && (
                  <div className="mt-2 flex items-start text-sm text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50 animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      Recevoir mon lien de connexion
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {/* DEMO BYPASS BUTTON */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/0 text-slate-500 backdrop-blur">Ou</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full flex justify-center items-center py-2 px-4 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors hover:border-orange-500/50"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Connexion Démo (Sans Email)
                </button>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400 rounded">Sécurité</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> Chiffrement SSL
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> Sans mot de passe
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              {status === 'sent' && (
                <div className="animate-fade-in">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-white mb-2">
                    Vérifiez vos emails
                  </h3>
                  <p className="text-sm text-slate-300 mb-6">
                    Nous avons envoyé un lien de connexion magique à <strong>{email}</strong>.
                    <br />
                    <br />
                    Cliquez sur le lien dans l'email pour vous connecter instantanément à votre
                    espace sécurisé.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-xs text-slate-500 underline"
                  >
                    Renvoyer un lien ou changer d'email
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button onClick={onBack} className="text-sm text-slate-400 hover:text-white transition">
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
