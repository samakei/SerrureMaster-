import React from 'react';
import { Search, FileText, PlayCircle, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "1. Diagnostic d'éligibilité",
    desc: "Vérifiez impérativement que votre situation (ex: porte claquée non verrouillée) est compatible avec nos protocoles d'ouverture fine.",
  },
  {
    icon: FileText,
    title: '2. Accès au protocole',
    desc: "Obtenez instantanément le plan d'action vidéo et PDF. Un contenu technique conçu pour être appliqué par des non-professionnels.",
  },
  {
    icon: PlayCircle,
    title: '3. Application guidée',
    desc: 'Suivez la méthodologie pas à pas. Nos supports vous indiquent les gestes précis à effectuer et les erreurs critiques à éviter.',
  },
  {
    icon: ShieldCheck,
    title: '4. Résolution maîtrisée',
    desc: "Tentez l'ouverture sans dégradation. Si la méthode ne suffit pas, vous aurez évité d'aggraver la situation pour le dépanneur.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Votre plan d'action en 4 étapes</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Une démarche structurée pour intervenir calmement, avec les bons outils et la bonne
            méthode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 z-10 relative group-hover:border-orange-500/50 group-hover:shadow-md transition-all">
                <step.icon className="w-8 h-8 text-slate-700 group-hover:text-orange-600 transition-colors" />
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-slate-900 rounded-lg text-white text-sm font-bold flex items-center justify-center border-2 border-slate-50">
                  {idx + 1}
                </div>
              </div>

              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-0"></div>
              )}

              <h3 className="font-bold text-lg text-slate-900 mb-3">{step.title}</h3>
              <p className="text-sm text-slate-600 px-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
