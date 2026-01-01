import React, { useMemo, useCallback } from 'react';
import { CheckCircle, XCircle, MessageCircle, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  isOwned?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, isOwned }) => {
  const { addToCart, items } = useCart();

  // Mémoiser les calculs coûteux
  const isInCart = useMemo(() => items.some((item) => item.id === product.id), [items, product.id]);

  // Validation des données produit
  if (!product) {
    return null;
  }

  // Mémoiser les valeurs dérivées
  const productImage = useMemo(() => product.image || '/images/p1.jpg', [product.image]);
  const productDescription = useMemo(
    () => product.description || 'Description non disponible',
    [product.description]
  );

  const handleAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:border-orange-500 hover:-translate-y-3 hover:rotate-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group cursor-pointer">
      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-purple-400/0 group-hover:from-orange-400/20 group-hover:to-purple-400/10 transition-all duration-300 pointer-events-none rounded-2xl" />

      {/* Header Image */}
      <div className="h-32 sm:h-40 -mx-4 -mt-4 mb-4 overflow-hidden relative bg-gradient-to-br from-orange-50 to-purple-50 rounded-t-2xl group-hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-10" />
        <img
          src={productImage}
          alt={product.title || 'Produit'}
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/p1.jpg';
          }}
          className="w-full h-full object-cover grayscale-0 group-hover:grayscale-0 brightness-100 group-hover:brightness-110 saturate-100 group-hover:saturate-125 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 ease-out"
        />
      </div>

      <div className="flex-1 flex flex-col z-10">
        {/* Titre avec hauteur min et limite de lignes pour alignement */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-200 line-clamp-2 min-h-[3rem] flex items-center leading-tight">
          {product.title}
        </h3>

        {/* Description avec hauteur min et limite de lignes */}
        <p className="text-slate-600 mb-3 text-xs sm:text-sm leading-relaxed line-clamp-3 min-h-[3.5rem]">
          {productDescription}
        </p>

        {/* Compatibility List */}
        {product.compatibility ? (
          <div className="mb-3 bg-gradient-to-br from-slate-50 to-slate-100/50 p-3 rounded-xl border border-slate-200 flex-1 shadow-sm group-hover:border-orange-200 transition-colors duration-300">
            <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5">
              {product.compatibility.valid.slice(0, 2).map((item, i) => (
                <li key={`v-${i}`} className="flex gap-2 items-start">
                  <CheckCircle className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-800 line-clamp-1">{item}</span>
                </li>
              ))}
              {product.compatibility.invalid.slice(0, 1).map((item, i) => (
                <li key={`i-${i}`} className="flex gap-2 items-start opacity-60">
                  <XCircle className="text-red-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-400 line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-3 flex-1 bg-slate-50 rounded-xl border border-slate-200 opacity-0"></div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2.5 text-[11px] font-semibold text-slate-700 mb-3 border border-green-200 flex items-center justify-between shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
          <span className="flex items-center gap-2">
            <MessageCircle className="text-green-600 w-4 h-4 group-hover:animate-pulse" />
            Assistance Pro incluse
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-slate-100 group-hover:border-orange-200 transition-colors duration-300">
          <div className="flex flex-col group-hover:scale-105 transition-transform duration-200">
            <span className="text-slate-900 text-2xl sm:text-3xl font-black tracking-tight">
              {product.price} €
            </span>
            {product.originalPrice && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-400 line-through text-xs font-medium">
                  {product.originalPrice} €
                </span>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  -
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}
                  %
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOwned || isInCart}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-lg transform active:scale-90 flex items-center group-hover:scale-110 ${
              isOwned
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-300 cursor-default shadow-green-200'
                : isInCart
                  ? 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-2 border-slate-300 cursor-default shadow-slate-300'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-500/50 hover:shadow-orange-500/80 border-2 border-orange-400 hover:rotate-3'
            }`}
          >
            {isOwned ? (
              <>
                <Shield className="w-4 h-4 mr-2" /> Acquis
              </>
            ) : isInCart ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" /> Au panier
              </>
            ) : (
              'Ajouter au panier'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
