import React, { useState } from 'react';
import { User, LogOut, ShoppingCart, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../contexts/CartContext';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  onLoginClick: () => void;
  onCheckout: () => void;
}

// Composant Logo Tech Moderne - Version Cyber avec Clé Digitale
const SerrureMasterLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 380 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo SerrureMaster"
    style={{ filter: 'drop-shadow(0 2px 8px rgba(14, 165, 233, 0.3))' }}
  >
    <defs>
      {/* Dégradé blanc principal */}
      <linearGradient id="cyber_blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f5f5f5', stopOpacity: 1 }} />
      </linearGradient>

      {/* Dégradé orange accent */}
      <linearGradient id="orange_accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
      </linearGradient>

      {/* Effet néon glow */}
      <filter id="neon_glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Groupe Icône - Porte */}
    <g transform="translate(5, 10)">
      <g transform="translate(28, 25)">
        {/* Panneau de porte */}
        <rect x="-13" y="-17.3" width="26" height="34.6" rx="2.6" fill="#F97316" />
        {/* Poignee */}
        <circle cx="7.2" cy="0.6" r="1.75" fill="#ffffff" />
      </g>
    </g>

    {/* Groupe Texte Moderne Tech */}
    <g transform="translate(70, 0)">
      {/* Texte principal - Design épuré */}
      <text
        x="0"
        y="32"
        fontFamily="'Inter', sans-serif"
        fontWeight="800"
        fontSize="24"
        letterSpacing="0.5"
        fill="#ffffff"
      >
        SERRURE
      </text>

      <text
        x="0"
        y="52"
        fontFamily="'Inter', sans-serif"
        fontWeight="800"
        fontSize="24"
        letterSpacing="0.5"
        fill="#F97316"
      >
        MASTER
      </text>

      {/* Badge "TECH SECURE" */}
      <g transform="translate(140, 18)">
        <rect x="0" y="0" width="75" height="18" rx="9" fill="#ffffff" opacity="0.15" />
        <text
          x="37.5"
          y="12"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          fontSize="8"
          fill="#ffffff"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          TECH SECURE
        </text>
      </g>
    </g>
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  onNavigate,
  currentPage,
  onLogout,
  onLoginClick,
  onCheckout,
}) => {
  const { count, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Logo Section */}
            <div
              className="flex items-center cursor-pointer hover:opacity-90 transition py-2 -ml-2"
              onClick={() => onNavigate('home')}
            >
              <SerrureMasterLogo className="h-10 sm:h-14 w-auto" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className={`text-sm font-medium hover:text-orange-400 transition ${
                  currentPage === 'home' ? 'text-orange-500' : 'text-slate-300'
                }`}
              >
                Nos Plans d'Action
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="text-sm font-medium text-slate-300 hover:text-orange-400 transition"
              >
                L'Expert
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-slate-300 hover:text-white transition group"
                aria-label="Ouvrir le panier"
              >
                <ShoppingCart className="h-6 w-6" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 animate-bounce-subtle">
                    {count}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition ${
                      currentPage === 'dashboard'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Espace Membre
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-slate-400 hover:text-red-400"
                    title="Se déconnecter"
                    aria-label="Se déconnecter"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition border border-slate-600 px-4 py-2 rounded-md hover:border-orange-500"
                >
                  <User className="h-4 w-4 mr-2" />
                  Connexion Client
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle + Cart */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleCart}
                className="relative p-2 text-slate-300 hover:text-white transition"
                aria-label="Ouvrir le panier"
              >
                <ShoppingCart className="h-6 w-6" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">
                    {count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white transition"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            <div className="fixed inset-x-0 top-16 sm:top-20 bg-slate-900 border-t border-slate-800 z-50 md:hidden shadow-2xl animate-slideUp">
              <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <button
                  onClick={() => handleNavigate('home')}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition ${
                    currentPage === 'home'
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Nos Plans d'Action
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  L'Expert
                </button>

                <div className="border-t border-slate-800 pt-4 mt-4">
                  {user ? (
                    <>
                      <button
                        onClick={() => handleNavigate('dashboard')}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition mb-2 ${
                          currentPage === 'dashboard'
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <User className="h-5 w-5 mr-3" />
                        Espace Membre
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          closeMobileMenu();
                        }}
                        className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-slate-800 transition"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onLoginClick();
                        closeMobileMenu();
                      }}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 transition border border-slate-700"
                    >
                      <User className="h-5 w-5 mr-3" />
                      Connexion Client
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Cart Drawer is always rendered but controlled by context */}
      <CartDrawer onCheckout={onCheckout} />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <div
              className="flex items-center mb-4 cursor-pointer -ml-2"
              onClick={() => onNavigate('home')}
            >
              <SerrureMasterLogo className="h-10 w-auto opacity-90 hover:opacity-100 transition" />
            </div>
            <p className="text-sm leading-relaxed">
              La référence pour maîtriser votre sécurité et économiser jusqu'à 400€ en dépannage.
              Apprenez à ouvrir votre porte vous-même avec nos guides professionnels.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('cgv')}
                  className="hover:text-orange-500 transition text-left"
                >
                  CGV & Mentions Légales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-orange-500 transition text-left"
                >
                  Politique de Confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cookies')}
                  className="hover:text-orange-500 transition text-left"
                >
                  Gestion des Cookies
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Paiement Sécurisé</h3>
            <div className="flex space-x-2">
              {/* Mock Payment Icons */}
              <div className="bg-white px-2 py-1 rounded text-xs font-bold text-slate-900">
                STRIPE
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs font-bold text-slate-900">
                VISA
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs font-bold text-slate-900">
                MASTERCARD
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">Transactions chiffrées SSL 256-bit.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} SerrureMaster. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};
