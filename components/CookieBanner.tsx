import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRefuseAll: () => void;
  onSavePreferences: (prefs: CookiePreferences) => void;
  onLearnMore: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onAcceptAll,
  onRefuseAll,
  onSavePreferences,
  onLearnMore,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Always true
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveCustom = () => {
    onSavePreferences(prefs);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] animate-[slideUp_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Main Header Area */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 p-3 rounded-xl flex-shrink-0 border border-slate-700 hidden sm:block">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                Votre vie privée nous appartient... non, on rigole.
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                Conformément au RGPD, vous avez le choix. Nous utilisons des cookies pour sécuriser
                votre espace membre (essentiels) et, si vous l'acceptez, pour améliorer nos guides
                (analytiques).
              </p>
            </div>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden lg:flex gap-3 flex-shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2.5 text-slate-300 font-medium hover:text-white underline decoration-slate-600 hover:decoration-white transition text-sm"
            >
              Personnaliser
            </button>
            <button
              onClick={onRefuseAll}
              className="px-6 py-2.5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 border border-slate-700 transition text-sm"
            >
              Tout refuser
            </button>
            <button
              onClick={onAcceptAll}
              className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 shadow-lg hover:shadow-orange-500/25 transition text-sm"
            >
              Tout accepter
            </button>
          </div>
        </div>

        {/* Customization Panel (Expandable) */}
        {showDetails && (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Necessary */}
              <div
                className="flex items-start gap-3 opacity-70 cursor-not-allowed"
                title="Obligatoire"
              >
                <div className="mt-1">
                  <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Essentiels (Obligatoire)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Nécessaires pour l'espace membre, le panier et la sécurité des paiements.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => handleToggle('analytics')}
              >
                <div className="mt-1 relative">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${prefs.analytics ? 'bg-orange-500 border-orange-500' : 'bg-slate-900 border-slate-600'}`}
                  >
                    {prefs.analytics && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm group-hover:text-orange-400 transition">
                    Analytique & Performance
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Nous aide à comprendre quelles vidéos sont les plus regardées pour les
                    améliorer.
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => handleToggle('marketing')}
              >
                <div className="mt-1 relative">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${prefs.marketing ? 'bg-orange-500 border-orange-500' : 'bg-slate-900 border-slate-600'}`}
                  >
                    {prefs.marketing && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm group-hover:text-orange-400 transition">
                    Publicité Ciblée
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Permet de vous proposer des offres pertinentes (nous en utilisons très peu).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-slate-700">
              <button
                onClick={handleSaveCustom}
                className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition text-sm"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}

        {/* Mobile Actions (Stacked) */}
        <div className="flex flex-col gap-3 lg:hidden mt-4">
          <button
            onClick={onAcceptAll}
            className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg"
          >
            Tout accepter
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRefuseAll}
              className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700"
            >
              Tout refuser
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 bg-transparent text-slate-300 font-medium border border-slate-700 rounded-lg"
            >
              {showDetails ? 'Masquer' : 'Personnaliser'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center lg:text-left">
          <button
            onClick={onLearnMore}
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Lire notre politique de confidentialité complète
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
