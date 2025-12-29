import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
  discount: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('serrure_master_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('serrure_master_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Optionnel: Incrémenter la quantité si on vendait des produits physiques multiples
        // Pour l'instant, on évite les doublons pour les produits digitaux, sauf le kit
        if (product.id === 'p6_survival_kit') {
          return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return prev;
      }
      return [...prev, { ...product, quantity: 1, addedAt: Date.now() }];
    });
    setIsOpen(true); // Open drawer on add
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleCart = () => setIsOpen((prev) => !prev);

  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
  };

  // Bundle Logic: If user has 'Door Slammed' (P1) AND 'Security Pack' (P4), give 50€ discount
  const hasP1 = items.some((i) => i.id === 'p1_door_slammed');
  const hasP4 = items.some((i) => i.id === 'p4_security_pack');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate Discount
  let discount = 0;
  if (hasP1 && hasP4) {
    discount = 50; // Flat discount for the bundle
  }

  const total = Math.max(0, subtotal - discount);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        toggleCart,
        clearCart,
        total,
        subtotal,
        discount,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
