import React, { useState, useEffect } from 'react';
import { User, Product } from '../types';
import {
  Lock,
  Download,
  Play,
  AlertCircle,
  FileText,
  Loader2,
  CheckCircle,
  ShieldAlert,
  X,
  Shield,
  MessageCircle,
  Wrench,
  Eye,
  XCircle,
  ChevronRight,
  FileWarning,
  Star,
  PenTool,
} from 'lucide-react';
import { generateSecureLink } from '../services/securityService';
import { useProducts } from '../contexts/ProductContext';
import { DoorDirectionHelper } from './DoorDirectionHelper';
import { LOGO_URL, APP_NAME } from '../constants';
import { TestimonialForm } from './TestimonialForm';

interface DashboardProps {
  user: User;
  onNavigateToCourse?: (productId: string) => void;
}

// Simple internal Modal Component for confirmation
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 transform transition-all scale-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
              title="Fermer"
            >
              <X className="w-6 h-6" aria-label="Fermer la modale" />
            </button>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Security Component: Dynamic Watermark
const DynamicWatermark: React.FC<{ userId: string }> = ({ userId }) => {
  const posOptions = [
    'top-[10%] left-[10%]',
    'top-[15%] left-[15%]',
    'top-[20%] left-[25%]',
    'top-[30%] left-[12%]',
    'top-[40%] left-[30%]',
    'top-[22%] left-[45%]',
    'top-[35%] left-[55%]',
    'top-[50%] left-[20%]',
  ];
  const opacityOptions = ['opacity-30', 'opacity-40', 'opacity-50', 'opacity-70'];
  const [posClass, setPosClass] = useState<string>(posOptions[1]);
  const [opacityClass, setOpacityClass] = useState<string>(opacityOptions[2]);
  const [timestamp, setTimestamp] = useState(
    new Date().toISOString().replace('T', ' ').substring(0, 19)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19));
      const nextPos = posOptions[Math.floor(Math.random() * posOptions.length)];
      const nextOpacity = opacityOptions[Math.floor(Math.random() * opacityOptions.length)];
      setPosClass(nextPos);
      setOpacityClass(nextOpacity);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    // Dynamic position styles are required - cannot be moved to CSS file
    // eslint-disable-next-line react/forbid-component-props
    // eslint-disable-next-line react/no-inline-styles
    <div
      className={`absolute pointer-events-none select-none z-30 transition-all duration-[3500ms] ease-in-out ${posClass} ${opacityClass}`}
    >
      <div className="flex flex-col items-center transform -rotate-12">
        <div className="bg-slate-900/40 backdrop-blur-sm text-white/60 px-4 py-2 rounded-lg text-xs font-mono whitespace-nowrap border border-white/10 shadow-2xl">
          <p className="font-bold tracking-[0.2em] text-orange-500/80 mb-0.5">CONFIDENTIEL</p>
          <p className="font-semibold text-white/80">ID: {userId}</p>
          <p className="text-[10px] mt-0.5 font-light">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const SecureFileDownload: React.FC<{
  label: string;
  product: Product;
  user: User;
  isVideo?: boolean;
  variant?: 'card' | 'button';
}> = ({ label, product, user, isVideo, variant = 'card' }) => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error' | 'unavailable'>(
    'idle'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Resource Logic
  const resource = product.currentResource;
  const isAvailable = resource && resource.status === 'published';
  const isDraft = resource && resource.status === 'draft';
  const fileName = resource ? resource.fileName : `${product.id}.pdf`;
  const fileSize = resource ? resource.fileSize : 'PDF';

  // For Videos (Legacy/Mock logic as they don't have resource management yet)
  // We assume videos are always available if they exist in the product definition
  const isVideoAvailable = isVideo;

  const handleInteraction = () => {
    if (!isVideo && !isAvailable) return; // Do nothing if PDF unavailable

    if (status === 'ready') {
      setStatus('idle');
    } else if (status !== 'generating') {
      setShowConfirm(true);
    }
  };

  const executeGeneration = async () => {
    setShowConfirm(false);
    setStatus('generating');
    setErrorMsg('');

    const response = await generateSecureLink(user, product.id, fileName);

    if (response.success && response.url) {
      setStatus('ready');
      window.open(response.url, '_blank');
      setTimeout(() => {
        setStatus('idle');
      }, 15 * 60 * 1000);
    } else {
      setStatus('error');
      setErrorMsg(response.error || 'Erreur inconnue');
    }
  };

  // Warning Message Content (Official Text)
  const warningContent = (
    <div className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
        <p className="font-bold text-orange-900 mb-3">
          Ce guide s’applique exclusivement aux situations suivantes :
        </p>
        <ul className="space-y-2 text-sm text-orange-900 font-medium">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
            Porte claquée (non verrouillée)
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
            Porte blindée claquée sans verrouillage
          </li>
        </ul>

        <div className="mt-4 pt-4 border-t border-orange-200">
          <div className="flex items-start">
            <XCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-bold text-sm">
              Ce guide ne permet en aucun cas l’ouverture d’une porte fermée à clé.
            </p>
          </div>
        </div>
      </div>

      <div className="text-sm space-y-2">
        <p className="font-bold text-slate-800">En cas de doute, STOP.</p>
        <p>
          Une tentative inadaptée peut endommager la serrure et entraîner des frais plus élevés.
        </p>
      </div>

      <p className="text-[10px] text-slate-400 mt-2 text-center border-t pt-2">
        Traçabilité active : Fichier marqué pour l'utilisateur {user.id}
      </p>

      <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition text-sm"
        >
          Annuler
        </button>
        <button
          onClick={executeGeneration}
          className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 transition text-sm shadow-lg flex items-center"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          J'ai lu et je valide
        </button>
      </div>
    </div>
  );

  // --- BUTTON VARIANT ---
  if (variant === 'button') {
    if (!isVideo && !isAvailable) {
      // Disabled / Draft State
      return (
        <button
          disabled
          className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold cursor-not-allowed"
          title={
            isDraft
              ? "Le document est en cours de validation par l'expert."
              : 'Document indisponible'
          }
        >
          {isDraft ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Lock className="w-4 h-4 mr-2" />
          )}
          {isDraft ? 'Validation en cours...' : 'Bientôt disponible'}
        </button>
      );
    }

    return (
      <>
        <ConfirmationModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="⚠️ IMPORTANT – LIRE AVANT TOUTE ACTION"
        >
          {warningContent}
        </ConfirmationModal>

        <button
          onClick={handleInteraction}
          disabled={status === 'generating'}
          className={`flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition text-sm font-bold shadow-lg shadow-orange-900/20 group ${
            status === 'generating' ? 'opacity-75 cursor-wait' : ''
          }`}
        >
          {status === 'generating' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          )}
          <span>{status === 'generating' ? 'Chargement...' : label}</span>
        </button>
      </>
    );
  }

  // --- CARD VARIANT (Default) ---
  const isDisabled = !isVideo && !isAvailable;

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="⚠️ IMPORTANT – LIRE AVANT TOUTE ACTION"
      >
        {warningContent}
      </ConfirmationModal>

      <div
        onClick={isDisabled ? undefined : handleInteraction}
        className={`relative group border rounded-xl p-4 transition-all overflow-hidden ${
          isDisabled
            ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
            : status === 'error'
            ? 'bg-red-50 border-red-200'
            : 'bg-white border-slate-200 hover:border-orange-500 hover:shadow-md cursor-pointer'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                isDisabled
                  ? 'bg-slate-200 text-slate-400'
                  : isVideo
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {isVideo ? <Play className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <p
                className={`font-bold text-sm transition-colors ${
                  isDisabled ? 'text-slate-500' : 'text-slate-800 group-hover:text-orange-600'
                }`}
              >
                {label}
              </p>
              <p className="text-xs text-slate-400">
                {isDisabled
                  ? isDraft
                    ? 'En attente de validation'
                    : 'Indisponible'
                  : `${fileName} • ${fileSize}`}
              </p>
            </div>
          </div>

          <div className="text-right">
            {isDisabled ? (
              isDraft ? (
                <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              ) : (
                <Lock className="w-5 h-5 text-slate-300" />
              )
            ) : (
              <>
                {status === 'idle' && (
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-orange-500" />
                )}
                {status === 'generating' && (
                  <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                )}
                {status === 'ready' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              </>
            )}
          </div>
        </div>

        {/* Status Bar */}
        {status === 'generating' && (
          <div className="absolute bottom-0 left-0 h-1 bg-orange-500 animate-[loading_1.5s_ease-in-out_infinite] w-full"></div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="mt-2 text-xs text-red-500 font-medium animate-fade-in">{errorMsg}</div>
        )}

        {/* Success Message */}
        {status === 'ready' && (
          <div className="mt-2 text-xs text-green-600 font-medium animate-fade-in">
            Téléchargement lancé ! Lien valide 15 min.
          </div>
        )}
      </div>
    </>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateToCourse }) => {
  const { products } = useProducts();
  const ownedProducts = products.filter((p) => user.purchasedProductIds.includes(p.id));
  const showDoorHelper = user.purchasedProductIds.some((id) =>
    ['p3_cylinder_replace', 'p4_security_pack'].includes(id)
  );

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pb-12 relative overflow-hidden">
      <div className="bg-slate-900 pb-32 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg">
                <img
                  src={LOGO_URL}
                  alt={APP_NAME}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Espace Membre</h1>
                <p className="text-slate-400">
                  Bienvenue, {user.name}. Voici vos guides et outils d'intervention.
                </p>
              </div>
            </div>

            {/* Bouton Avis */}
            {ownedProducts.length > 0 && (
              <button
                onClick={() => setShowTestimonialModal(true)}
                className="hidden md:flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-700 transition"
              >
                <Star className="w-4 h-4 text-orange-500 mr-2" />
                Donner mon avis
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 space-y-8">
        {showDoorHelper && (
          <div className="animate-[slideUp_0.5s_ease-out]">
            <DoorDirectionHelper />
          </div>
        )}

        <div className="grid gap-8">
          {ownedProducts.length > 0 ? (
            ownedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
              >
                <div className="bg-slate-900 p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center">
                        {product.title}
                        <span className="ml-3 bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/30 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acquis
                        </span>
                      </h2>
                      <p className="text-slate-400 text-sm">{product.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <SecureFileDownload
                      label="Plan PDF"
                      product={product}
                      user={user}
                      variant="button"
                    />

                    <a
                      href="https://wa.me/33757570389"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-sm font-medium border border-slate-700 group"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
                      Assistance Pro
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Fichiers disponibles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <SecureFileDownload label="Guide Complet (PDF)" product={product} user={user} />

                    {(product.type === 'VIDEO' || product.type === 'BUNDLE') && (
                      <SecureFileDownload
                        label="Tutoriel Vidéo 4K"
                        product={product}
                        user={user}
                        isVideo={true}
                      />
                    )}

                    <div
                      className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-center text-slate-400 text-sm hover:bg-slate-100 transition cursor-help"
                      title="Bientôt disponible"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Outil Bonus (À venir)
                    </div>
                  </div>
                </div>

                {/* Navigation vers le CoursePlayer si applicable */}
                <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => onNavigateToCourse && onNavigateToCourse(product.id)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                  >
                    Accéder à l'espace e-learning
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Aucun guide accessible</h3>
              <p className="text-slate-600 mt-2">Vous n'avez pas encore acheté de plan d'action.</p>
              <button className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition">
                Voir le catalogue
              </button>
            </div>
          )}
        </div>

        {/* Mobile Testimonial Button */}
        {ownedProducts.length > 0 && (
          <button
            onClick={() => setShowTestimonialModal(true)}
            className="md:hidden w-full bg-slate-800 text-white p-4 rounded-xl flex items-center justify-center font-bold"
          >
            <Star className="w-4 h-4 text-orange-500 mr-2" />
            Donner mon avis sur les guides
          </button>
        )}
      </div>
      <DynamicWatermark userId={user.id} />

      {/* Testimonial Modal */}
      <ConfirmationModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        title="Votre avis nous intéresse"
      >
        <TestimonialForm user={user} onClose={() => setShowTestimonialModal(false)} />
      </ConfirmationModal>
    </div>
  );
};
