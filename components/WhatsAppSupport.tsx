import React from 'react';
import { Bot, MessageCircle, Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhatsAppSupportProps {
  onOpenChat: () => void;
}

export const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({ onOpenChat }) => {
  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-slate-300 text-xs font-bold tracking-wider uppercase">
              Support Connecté
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Une question ? Deux niveaux d'assistance.
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Pour garantir un service pédagogique de qualité sans fausse promesse, nous distinguons
            l'orientation immédiate de l'expertise humaine.
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* CARD 1: IA / VIRTUAL ASSISTANT */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col relative group hover:border-slate-600 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Bot className="w-24 h-24 text-white" />
            </div>

            <div className="mb-6">
              <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Assistant Virtuel (IA)</h3>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                Premier contact & Éligibilité
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Diagnostic de compatibilité immédiat</span>
              </li>
              <li className="flex items-start text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Disponible 24h/24 et 7j/7</span>
              </li>
              <li className="flex items-start text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Orientation vers le bon guide PDF/Vidéo</span>
              </li>
            </ul>

            <button
              onClick={onOpenChat}
              className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center"
            >
              Lancer le diagnostic gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3">
              Réponse instantanée automatisée
            </p>
          </div>

          {/* CARD 2: HUMAN / WHATSAPP BUSINESS */}
          <div className="bg-green-900/20 rounded-2xl p-8 border border-green-500/30 flex flex-col relative group hover:border-green-500/50 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <MessageCircle className="w-24 h-24 text-green-500" />
            </div>

            <div className="mb-6">
              <div className="w-14 h-14 bg-green-900/30 rounded-xl flex items-center justify-center mb-4 border border-green-500/30">
                <MessageCircle className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Expert SerrureMaster</h3>
              <p className="text-sm text-green-400 font-medium uppercase tracking-wide">
                Validation Visuelle Humaine
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Analyse de votre serrure sur photo</span>
              </li>
              <li className="flex items-start text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Confirmation technique avant achat</span>
              </li>
              <li className="flex items-start text-slate-300 text-sm">
                <Clock className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                <span>Délai de réponse variable (heures ouvrées)</span>
              </li>
            </ul>

            <a
              href="https://wa.me/33757570389"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-green-900/20"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contacter le Support Pro
            </a>
            <p className="text-center text-[10px] text-slate-400 mt-3">
              WhatsApp Business Officiel
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="max-w-4xl mx-auto mt-12 bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">
              Cadre d'intervention et Responsabilité :
            </strong>
            L'assistance WhatsApp (IA ou Humaine) a pour unique vocation de qualifier votre
            situation et de vous orienter vers le produit adapté.
            <span className="text-orange-400">
              {' '}
              Aucune instruction technique détaillée d'ouverture ne sera transmise par message.
            </span>
            Ce canal ne constitue pas un service de dépannage à distance ni une garantie de
            résultat. En cas d'urgence vitale ou de blocage complexe, faites appel à un
            professionnel sur place.
          </div>
        </div>
      </div>
    </section>
  );
};
