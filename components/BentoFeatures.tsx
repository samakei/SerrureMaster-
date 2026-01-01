import React from 'react';
import { Zap, Smartphone, Wrench, Scale } from 'lucide-react';

export const BentoFeatures = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section optimisé UX/Légal */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            L'expertise technique. La sécurité juridique.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Accédez au savoir-faire d'un artisan serrurier pour traiter une urgence sans
            intervention extérieure, dans le strict respect de l'intégrité de votre matériel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 : Technique & Intégrité */}
          <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition group-hover:bg-orange-500/20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Protocole Non-Destructif</h3>
              <p className="text-slate-400 text-lg max-w-lg">
                Priorité absolue à l'ouverture fine. Nos plans d'action vous guident vers des
                méthodes professionnelles douces pour tenter l'ouverture sans endommager votre
                serrure ni votre porte.
              </p>
            </div>
          </div>

          {/* Feature 2 : Disponibilité */}
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 relative overflow-hidden">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Disponibilité Immédiate</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Votre urgence n'attend pas. Accédez à votre Espace Membre sécurisé et aux supports
              vidéo dès la validation de la commande.
            </p>
          </div>

          {/* Feature 3 : Cadre Légal */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6">
              <Scale className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cadre & Conformité</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Usage strictement réservé aux occupants légitimes. Nos guides intègrent
              systématiquement les rappels légaux et de sécurité.
            </p>
          </div>

          {/* Feature 4 : Assistance Technique */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-100 to-white rounded-3xl p-8 border border-slate-200 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Validation Technique Incluse
                </h3>
                <p className="text-slate-600 text-lg">
                  Un doute sur votre type de serrure ? Envoyez une photo via WhatsApp. <br />
                  Un expert confirme la compatibilité de la méthode en temps réel avant toute
                  action.
                </p>
              </div>
              <div className="w-full md:w-1/3">
                {/* Mock chat bubbles - Version Professionnelle */}
                <div className="space-y-3 opacity-90">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-xs text-slate-600">
                    Bonjour, ma porte n'a pas de poignée extérieure, est-ce compatible ?
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md text-xs ml-auto">
                    Oui, c'est une configuration palière standard. Le module 2 du guide détaille le
                    geste précis pour ce cas.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
