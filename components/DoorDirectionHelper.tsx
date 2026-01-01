import React, { useState } from 'react';
import { Info, CheckCircle } from 'lucide-react';

export const DoorDirectionHelper: React.FC = () => {
  const [selection, setSelection] = useState<'droite' | 'gauche' | null>(null);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mt-8 shadow-xl">
      <div className="flex items-center mb-4">
        <div className="bg-orange-500/10 p-2 rounded-lg mr-3">
          <Info className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Diagnostic Express : Sens de la porte</h3>
          <p className="text-slate-400 text-sm">Indispensable avant d'acheter votre nouvelle serrure pour éviter l'erreur.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Option DROITE */}
        <div 
          className={`relative group rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer ${
            selection === 'droite' 
              ? 'border-orange-500 bg-slate-800 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
              : 'border-slate-700 bg-slate-950 hover:border-slate-600'
          }`}
          onClick={() => setSelection('droite')}
        >
          <div className="h-40 relative mb-4 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
             {/* Schéma Porte Droite (Vue de dessus simplifiée) */}
             <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-80 group-hover:opacity-100 transition">
                {/* Cadre */}
                <rect x="10" y="10" width="80" height="10" fill="#475569" />
                {/* Porte ouverte vers la droite */}
                <path d="M90 20 L90 90" stroke="#f97316" strokeWidth="4" />
                <path d="M90 20 A 70 70 0 0 0 20 20" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                {/* Flèche */}
                <path d="M40 50 L80 50" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Poignée */}
                <circle cx="85" cy="55" r="3" fill="#cbd5e1" />
             </svg>
          </div>
          <h4 className="text-white font-bold text-center mb-2">Serrure à Droite</h4>
          <p className="text-xs text-slate-500 text-center mb-4">Les gonds sont à droite quand je pousse la porte.</p>
          
          <button 
            className={`w-full py-2 rounded-lg font-bold text-sm transition ${
              selection === 'droite' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
            }`}
          >
            {selection === 'droite' ? 'Sélectionné' : "C'est mon cas"}
          </button>
        </div>

        {/* Option GAUCHE */}
        <div 
          className={`relative group rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer ${
            selection === 'gauche' 
              ? 'border-orange-500 bg-slate-800 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
              : 'border-slate-700 bg-slate-950 hover:border-slate-600'
          }`}
          onClick={() => setSelection('gauche')}
        >
          <div className="h-40 relative mb-4 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
             {/* Schéma Porte Gauche */}
             <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-80 group-hover:opacity-100 transition">
                {/* Cadre */}
                <rect x="10" y="10" width="80" height="10" fill="#475569" />
                {/* Porte ouverte vers la gauche */}
                <path d="M10 20 L10 90" stroke="#f97316" strokeWidth="4" />
                <path d="M10 20 A 70 70 0 0 1 80 20" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                {/* Flèche */}
                <path d="M60 50 L20 50" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Poignée */}
                <circle cx="15" cy="55" r="3" fill="#cbd5e1" />
             </svg>
          </div>
          <h4 className="text-white font-bold text-center mb-2">Serrure à Gauche</h4>
          <p className="text-xs text-slate-500 text-center mb-4">Les gonds sont à gauche quand je pousse la porte.</p>
          
          <button 
            className={`w-full py-2 rounded-lg font-bold text-sm transition ${
              selection === 'gauche' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
            }`}
          >
            {selection === 'gauche' ? 'Sélectionné' : "C'est mon cas"}
          </button>
        </div>
      </div>

      {/* Résultat */}
      {selection && (
        <div className="mt-6 animate-fade-in bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400">Diagnostic terminé</h4>
            <p className="text-green-200/80 text-sm mt-1 leading-relaxed">
              Votre porte est une <strong className="text-white uppercase">{selection}</strong>. 
              <br/>Notez bien cette information ("{selection === 'droite' ? 'D' : 'G'}") pour votre achat de serrure ou de cylindre.
            </p>
          </div>
        </div>
      )}

      {/* SVG Definitions for Arrows */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="white" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};