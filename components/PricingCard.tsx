import React from 'react';
import { Check, Shield, FileText, PlayCircle, Zap } from 'lucide-react';
import { Product } from '../types';

interface PricingCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  isOwned?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ product, onBuy, isOwned }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col h-full transform transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <h3 className="text-xl font-bold text-white mb-2 relative z-10">{product.title}</h3>
        <div className="flex items-baseline justify-center text-white relative z-10">
          <span className="text-4xl font-extrabold tracking-tight">{product.price}€</span>
          <span className="ml-1 text-slate-400 line-through text-sm">500€</span>
        </div>
        <p className="text-orange-400 text-xs font-bold mt-2 uppercase tracking-wider relative z-10">
          -80% vs Intervention
        </p>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-slate-600 mb-6 text-sm min-h-[40px]">{product.description}</p>
        
        <div className="space-y-4 mb-8 flex-1">
          <div className="flex items-center text-sm font-semibold text-slate-800">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Plan PDF Complet
          </div>
          <div className="flex items-center text-sm font-semibold text-slate-800">
            <PlayCircle className="w-4 h-4 mr-2 text-red-600" />
            Tutoriels Vidéo HD
          </div>
          <div className="border-t border-dashed border-slate-200 my-4"></div>
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-600">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onBuy(product)}
          disabled={isOwned}
          className={`w-full py-4 rounded-lg font-bold text-center transition-all flex justify-center items-center ${
            isOwned 
              ? 'bg-green-100 text-green-700 cursor-default' 
              : 'bg-slate-900 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30'
          }`}
        >
          {isOwned ? (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Déjà acheté
            </>
          ) : (
            "Obtenir le Plan"
          )}
        </button>
        
        {!isOwned && (
           <p className="text-xs text-center text-slate-400 mt-3 flex justify-center items-center">
             <Zap className="w-3 h-3 mr-1 text-orange-500" /> Accès immédiat après paiement
           </p>
        )}
      </div>
    </div>
  );
};