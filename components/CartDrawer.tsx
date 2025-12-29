import React from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { PRODUCTS } from '../constants';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { items, isOpen, toggleCart, removeFromCart, total, subtotal, discount, addToCart } =
    useCart();

  // Upsell Logic: Check if P1 is in cart but P4 (Security Pack) is NOT
  const hasP1 = items.some((i) => i.id === 'p1_door_slammed');
  const hasP4 = items.some((i) => i.id === 'p4_security_pack');
  const showSecurityUpsell = hasP1 && !hasP4;

  // Find P4 product object for the upsell
  const securityProduct = PRODUCTS.find((p) => p.id === 'p4_security_pack');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[70] w-full sm:max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Votre Panier</h2>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full border border-slate-700">
              {items.length} article{items.length > 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={toggleCart}
            aria-label="Fermer le panier"
            className="text-slate-400 hover:text-white transition p-2 hover:bg-slate-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <div className="bg-slate-800 p-6 rounded-full">
                <ShoppingCart className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-200 font-medium">Votre panier est vide.</p>
              <button
                onClick={toggleCart}
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Découvrir nos guides
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex bg-slate-800/50 rounded-xl border border-slate-700 p-3 hover:border-orange-500/30 transition-all"
                >
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-700">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-bold text-white line-clamp-2 pr-4">
                          {item.title}
                        </h3>
                        <p className="text-sm font-bold text-orange-400">{item.price}€</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-1">{item.description}</p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <div className="text-xs text-slate-400 font-mono flex items-center">
                        {item.type === 'BUNDLE' && (
                          <ShieldCheck className="w-3 h-3 mr-1 text-green-500" />
                        )}
                        {item.type}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Retirer ${item.title} du panier`}
                        className="text-slate-400 hover:text-red-400 transition flex items-center text-xs group/btn"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">
                          Retirer
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upsell Card (Only visible if condition met) */}
              {showSecurityUpsell && securityProduct && (
                <div className="mt-6 border-t border-slate-700 pt-6 animate-fade-in-up">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 border border-orange-500/30 shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <ShieldCheck className="w-24 h-24 text-orange-500" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center mb-2">
                        <Sparkles className="w-4 h-4 text-orange-400 mr-2 animate-pulse" />
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                          Offre Spéciale Sécurité
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1">
                        Sécurisez votre porte après ouverture
                      </h4>
                      <p className="text-slate-200 text-xs mb-3">
                        Ajoutez le pack "Changer sa serrure" pour seulement{' '}
                        <span className="text-white font-bold underline">50€</span> (au lieu de
                        100€).
                      </p>
                      <button
                        onClick={() => addToCart(securityProduct)}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Ajouter le pack (+50€ seulement)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Sous-total</span>
                <span>{subtotal}€</span>
              </div>

              {/* Discount Row */}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-400 font-medium">
                  <span className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" /> Remise Bundle
                  </span>
                  <span>-{discount}€</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-slate-400">
                <span>Taxes (estimées)</span>
                <span>Incluses</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-orange-500">{total}€</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center group"
            >
              <span>Procéder au paiement</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex justify-center items-center space-x-4 text-[10px] text-slate-300 mt-2">
              <span className="flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> Paiement Sécurisé
              </span>
              <span className="flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> Satisfait ou remboursé
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
