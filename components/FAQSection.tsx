import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: "Est-ce vraiment légal d'ouvrir sa porte ?",
    a: "Oui, tant que vous êtes l'occupant légitime du logement (propriétaire ou locataire avec bail). Nos guides rappellent systématiquement ce cadre légal.",
  },
  {
    q: "Et si je n'y arrive pas ?",
    a: "Nos méthodes fonctionnent dans 90% des cas (porte claquée simple). Si vous échouez, nous vous conseillons d'arrêter pour ne rien casser. Vous aurez économisé le temps d'attente d'un serrurier avant de l'appeler en dernier recours.",
  },
  {
    q: "Ai-je besoin d'outils spéciaux ?",
    a: "Non. Les méthodes enseignées utilisent uniquement du matériel domestique courant. Aucun outil professionnel n'est requis.",
  },
  {
    q: 'Puis-je me faire rembourser ?',
    a: "S'agissant de produits numériques avec accès immédiat, le droit de rétractation ne s'applique pas une fois le contenu consommé, conformément à la loi. Cependant, nous étudions les réclamations au cas par cas si le guide n'a pas été téléchargé/visionné.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Questions Fréquentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left bg-slate-50 hover:bg-slate-100 transition"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
