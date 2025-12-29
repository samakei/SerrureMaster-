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

// Composant Logo Vectoriel Ultra-Moderne avec Glassmorphism & 3D
const SerrureMasterLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 420 75"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo SerrureMaster"
    style={{ filter: 'drop-shadow(0 4px 12px rgba(249, 115, 22, 0.2))' }}
  >
    <defs>
      {/* Dégradé principal moderne (Orange → Rose → Violet) */}
      <linearGradient id="shield_modern_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
      </linearGradient>

      {/* Dégradé lumineux cyan électrique */}
      <linearGradient id="glow_cyan" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
      </linearGradient>

      {/* Effet glassmorphism */}
      <linearGradient id="glass_effect" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.15 }} />
        <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.05 }} />
      </linearGradient>

      {/* Filtre glow soft */}
      <filter id="soft_glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Ombre interne 3D */}
      <filter id="inner_shadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Groupe Icône Bouclier Moderne */}
    <g transform="translate(10, 8)">
      {/* Bouclier principal avec dégradé tri-color */}
      <path
        d="M28 0 L50 11 V28 C50 42 40 55 28 60 C16 55 6 42 6 28 V11 L28 0 Z"
        fill="url(#shield_modern_grad)"
        filter="url(#soft_glow)"
      >
        <animate attributeName="opacity" values="0.95;1;0.95" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Couche glassmorphism */}
      <path
        d="M28 3 L47 12 V28 C47 40 38 52 28 56 C18 52 9 40 9 28 V12 L28 3 Z"
        fill="url(#glass_effect)"
        opacity="0.6"
      />

      {/* Découpe hexagonale centrale (forme M moderne) */}
      <path
        d="M28 14 L38 22 V42 L28 50 L18 42 V22 L28 14 Z"
        fill="#0a0f1e"
        opacity="0.95"
        filter="url(#inner_shadow)"
      />

      {/* Cadenas moderne minimaliste */}
      <g transform="translate(28, 30)" filter="url(#soft_glow)">
        {/* Corps du cadenas */}
        <rect x="-5" y="0" width="10" height="8" rx="1.5" fill="url(#glow_cyan)" />

        {/* Anse du cadenas (arc) */}
        <path
          d="M-3 0 V-4 C-3 -5.65 -1.65 -7 0 -7 C1.65 -7 3 -5.65 3 -4 V0"
          stroke="url(#glow_cyan)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Point lumineux central */}
        <circle cx="0" cy="4" r="1.5" fill="#0a0f1e">
          <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Pulsation lumineuse */}
        <circle cx="0" cy="4" r="1.5" fill="url(#glow_cyan)" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Particules tech flottantes */}
      <g opacity="0.7">
        <circle cx="55" cy="15" r="2.5" fill="#06b6d4">
          <animate attributeName="cy" values="15;12;15" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="58" cy="25" r="1.5" fill="#ec4899">
          <animate attributeName="cy" values="25;22;25" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="1" cy="15" r="2.5" fill="#a855f7">
          <animate attributeName="cy" values="15;18;15" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="-2" cy="25" r="1.5" fill="#f97316">
          <animate attributeName="cy" values="25;28;25" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Lignes de connexion animées */}
      <g opacity="0.5" strokeWidth="1" strokeLinecap="round">
        <line x1="50" y1="15" x2="55" y2="15" stroke="#06b6d4">
          <animate attributeName="x2" values="55;58;55" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="6" y1="15" x2="1" y2="15" stroke="#a855f7">
          <animate attributeName="x2" values="1;-2;1" dur="3.5s" repeatCount="indefinite" />
        </line>
      </g>
    </g>

    {/* Groupe Texte Ultra-Moderne */}
    <g transform="translate(85, 0)">
      {/* Texte principal avec effet 3D subtil */}
      <text
        x="0"
        y="36"
        fontFamily="'Inter', sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="1.5"
        fill="url(#shield_modern_grad)"
        style={{ paintOrder: 'stroke fill' }}
      >
        SERRURE
        <tspan fill="#06b6d4" dx="4">
          MASTER
        </tspan>
      </text>

      {/* Reflet glassmorphism sur le texte */}
      <text
        x="0"
        y="35"
        fontFamily="'Inter', sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="1.5"
        fill="url(#glass_effect)"
        opacity="0.8"
      >
        SERRURE
        <tspan dx="4">MASTER</tspan>
      </text>

      {/* Badge moderne sous le titre */}
      <g transform="translate(0, 45)">
        {/* Fond du badge */}
        <rect
          x="0"
          y="0"
          width="120"
          height="16"
          rx="8"
          fill="url(#shield_modern_grad)"
          opacity="0.15"
        />

        {/* Texte du badge */}
        <text
          x="60"
          y="11"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          fontSize="9"
          fill="#06b6d4"
          letterSpacing="2"
          textAnchor="middle"
          style={{ textTransform: 'uppercase' }}
        >
          Votre Sécurité
        </text>

        {/* Point lumineux animé */}
        <circle cx="8" cy="8" r="2" fill="#10b981">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
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
