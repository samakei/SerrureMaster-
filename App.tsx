import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ChatBot } from './components/ChatBot';
import { CookieBanner, CookiePreferences } from './components/CookieBanner';
import { LoginPage } from './components/LoginPage';
import { User } from './types';
import {
  ShieldCheck,
  Users,
  Zap,
  Loader2,
  BookOpen,
  Lock,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { CartProvider, useCart } from './contexts/CartContext';
import { BentoFeatures } from './components/BentoFeatures';
import { HowItWorksSection } from './components/HowItWorks';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { WhatsAppSupport } from './components/WhatsAppSupport';

// Lazy load uniquement des composants non-critiques (pages secondaires)
const Dashboard = lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const CoursePlayer = lazy(() =>
  import('./components/CoursePlayer').then((m) => ({ default: m.CoursePlayer }))
);
const CGV = lazy(() => import('./components/CGV').then((m) => ({ default: m.CGV })));
const PrivacyPolicy = lazy(() =>
  import('./components/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy }))
);
const CookiesPolicy = lazy(() =>
  import('./components/CookiesPolicy').then((m) => ({ default: m.CookiesPolicy }))
);

// Composant de chargement pour les lazy-loaded components
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
      <p className="text-slate-600">Chargement...</p>
    </div>
  </div>
);

import { ProductProvider, useProducts } from './contexts/ProductContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { TestimonialProvider } from './contexts/TestimonialContext';
import { supabase } from './services/supabaseClient';
import { createCheckoutSession } from './services/stripeService';
import { MOCK_USER_ID, APP_NAME } from './constants';

const PageTransition: React.FC<{
  children: React.ReactNode;
  pageKey: string;
}> = ({ children, pageKey }) => (
  <div key={pageKey} className="animate-fade-in w-full min-h-screen">
    {children}
  </div>
);

const SerrureMasterApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [, setCookieConsent] = useState<CookiePreferences | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Global Chat State for WhatsAppSupport integration
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { items, clearCart, toggleCart } = useCart();
  const { products } = useProducts();

  const devMode = (import.meta as any)?.env?.MODE === 'development';
  const supaUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL as string | undefined;
  let supaHost = '';
  try {
    supaHost = new URL(supaUrl || '').host;
  } catch {
    supaHost = supaUrl || '';
  }

  // --- SEO: Update Document Title ---
  useEffect(() => {
    let pageTitle = APP_NAME;
    switch (currentPage) {
      case 'dashboard':
        pageTitle = `Espace Membre | ${APP_NAME}`;
        break;
      case 'login':
        pageTitle = `Connexion | ${APP_NAME}`;
        break;
      case 'course':
        pageTitle = `Formation | ${APP_NAME}`;
        break;
      case 'about':
        pageTitle = `Notre Expertise | ${APP_NAME}`;
        break;
      case 'home':
        pageTitle = `${APP_NAME} : Ouvrez votre porte sans serrurier`;
        break;
      default:
        pageTitle = `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} | ${APP_NAME}`;
    }
    document.title = pageTitle;
    window.scrollTo(0, 0); // Reset scroll on page change
  }, [currentPage]);

  // --- HANDLERS ---
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchUserProfile = async (uid: string, email: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (profileError) {
        // console.error("Erreur profile:", profileError);
      }

      const { data: purchases, error: purchasesError } = await supabase
        .from('user_products')
        .select('product_id')
        .eq('user_id', uid);

      if (purchasesError) {
        // console.error("Erreur achats:", purchasesError);
      }

      const purchasedIds = purchases ? purchases.map((p) => p.product_id) : [];

      if (profile) {
        const mappedUser: User = {
          id: profile.id,
          email: profile.email || email,
          name: profile.full_name || email.split('@')[0],
          purchasedProductIds: purchasedIds,
          role: profile.role as 'user' | 'admin',
          status: profile.status as 'active' | 'blocked',
          joinedAt: profile.created_at,
        };
        setUser(mappedUser);
      } else {
        const newUser: User = {
          id: uid,
          email: email,
          name: email.split('@')[0],
          purchasedProductIds: purchasedIds,
          role: 'user',
          status: 'active',
        };
        setUser(newUser);
      }
    } catch (err) {
      console.warn('User profile fetch failed (offline/demo?):', err);
      // Fallback minimal user to prevent crash
      setUser({
        id: uid,
        email: email,
        name: email.split('@')[0],
        purchasedProductIds: [],
        role: 'user',
        status: 'active',
      });
    }
  };

  // --- INITIALIZATION & AUTH CHECK ---
  useEffect(() => {
    // 1. Check Cookies Consent
    const savedConsent = localStorage.getItem('serrure_master_consent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    } else {
      setTimeout(() => setShowCookieBanner(true), 1500);
    }

    // 2. Check Auth Session (Supabase) - ROBUST IMPLEMENTATION
    const initSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user?.email) {
          await fetchUserProfile(session.user.id, session.user.email);
        }
      } catch {
        console.warn(
          'Auth check skipped or failed (Offline/Demo mode). App will start in guest mode.'
        );
      }
    };
    initSession();

    // 3. Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      } else if (!user && session?.user) {
        fetchUserProfile(session.user.id, session.user.email!);
      }
    });

    // 4. Check URL Params for Stripe callbacks
    const query = new URLSearchParams(window.location.search);
    if (query.get('status') === 'success') {
      showNotification('✅ Paiement validé ! Bienvenue dans votre espace.');
      clearCart();
      if (!user) {
        setUser({
          id: MOCK_USER_ID,
          email: 'client@test.com',
          name: 'Nouveau Client',
          purchasedProductIds: ['p1_door_slammed'], // Grant access to one product
          role: 'user',
          status: 'active',
        });
      }
      setCurrentPage('dashboard');
      window.history.replaceState({}, '', '/');
    }

    if (query.get('status') === 'cancel') {
      showNotification('⚠️ Paiement annulé. Votre panier est conservé.');
      toggleCart();
      window.history.replaceState({}, '', '/');
    }

    // 5. Check URL hash params for Supabase auth errors (#error=...)
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const authErrorCode = hashParams.get('error_code');
    const authError = hashParams.get('error');

    if (authError || authErrorCode) {
      if (authErrorCode === 'otp_expired') {
        showNotification('⚠️ Le lien de connexion a expiré. Demandez un nouveau lien email.');
      } else {
        const authErrorDescription = hashParams
          .get('error_description')
          ?.replace(/\+/g, ' ')
          ?.trim();
        showNotification(
          `⚠️ Connexion impossible${authErrorDescription ? ` : ${authErrorDescription}` : '.'}`
        );
      }

      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }

    return () => subscription.unsubscribe();
  }, [clearCart, toggleCart]);

  const handleLogin = (email: string) => {
    if (email === 'demo@serruremaster.com' || email.includes('test')) {
      setUser({
        id: MOCK_USER_ID,
        email: email,
        name: 'Utilisateur Démo',
        purchasedProductIds: ['p1_door_slammed', 'p4_security_pack'],
        role: email.includes('admin') ? 'admin' : 'user',
        status: 'active',
      });
      setCurrentPage(email.includes('admin') ? 'admin' : 'dashboard');
      showNotification('👋 Bienvenue sur la démo !');
    } else {
      showNotification('📧 Lien de connexion envoyé !');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout error (offline):', e);
    }
    setUser(null);
    setCurrentPage('home');
    showNotification('Vous avez été déconnecté.');
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!user) {
      toggleCart();
      showNotification('Veuillez vous connecter pour sécuriser votre achat.');
      setCurrentPage('login');
      return;
    }

    setIsCheckingOut(true);
    try {
      console.log('🛒 Tentative de checkout avec:', { userId: user.id, items });
      await createCheckoutSession(user.id, items);
    } catch (err: any) {
      console.error('❌ Checkout failed:', err);
      console.error("Détails de l'erreur:", err.message, err);

      // Fallback for demo
      setTimeout(() => {
        setIsCheckingOut(false);
        if (
          window.confirm(
            'Mode Démo : Supabase/Stripe non connectés.\nVoulez-vous simuler un paiement RÉUSSI ?'
          )
        ) {
          window.location.href = '/?status=success';
        } else {
          showNotification('Paiement annulé (Simulation).');
        }
      }, 1000);
    }
  };

  const handleCookieChoice = (prefs: CookiePreferences) => {
    setCookieConsent(prefs);
    localStorage.setItem('serrure_master_consent', JSON.stringify(prefs));
    setShowCookieBanner(false);
  };

  const handleResetCookies = () => {
    localStorage.removeItem('serrure_master_consent');
    setCookieConsent(null);
    setShowCookieBanner(true);
    showNotification('Préférences cookies réinitialisées.');
  };

  // --- RENDER CONTENT SWITCH ---

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        if (!user)
          return <LoginPage onLoginSuccess={handleLogin} onBack={() => setCurrentPage('home')} />;
        if (user.role === 'admin')
          return (
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboard currentUser={user} onLogout={handleLogout} />
            </Suspense>
          );
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard
              user={user}
              onNavigateToCourse={(pid) => {
                setCurrentProductId(pid);
                setCurrentPage('course');
              }}
            />
          </Suspense>
        );
      case 'course':
        if (!user || !currentProductId)
          return (
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard user={user!} />
            </Suspense>
          );
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CoursePlayer
              user={user}
              productId={currentProductId}
              onBack={() => setCurrentPage('dashboard')}
            />
          </Suspense>
        );
      case 'admin':
        if (!user || user.role !== 'admin') {
          return <LoginPage onLoginSuccess={handleLogin} onBack={() => setCurrentPage('home')} />;
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard currentUser={user} onLogout={handleLogout} />
          </Suspense>
        );
      case 'login':
        return <LoginPage onLoginSuccess={handleLogin} onBack={() => setCurrentPage('home')} />;
      case 'cgv':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CGV onBack={() => setCurrentPage('home')} />
          </Suspense>
        );
      case 'privacy':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPolicy onBack={() => setCurrentPage('home')} />
          </Suspense>
        );
      case 'cookies':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CookiesPolicy onBack={() => setCurrentPage('home')} onReset={handleResetCookies} />
          </Suspense>
        );
      case 'about':
        return (
          <div className="pt-20 pb-20 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-3xl mx-auto px-6">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-slate-700" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                  Une expertise professionnelle, <br />
                  transmise à distance
                </h1>
                <div className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  <p>
                    Ce service repose sur une expérience professionnelle de terrain et sur une
                    approche pédagogique structurée. Les plans d’action proposés sont conçus pour
                    expliquer, guider et accompagner, dans un cadre strictement légal et non
                    destructif.
                  </p>
                </div>
              </div>

              {/* Content Grid */}
              <div className="space-y-10">
                {/* Block 1: Objectifs */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-lg mb-4">
                    Chaque contenu est pensé pour :
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Comprendre la mécanique concernée',
                      'Identifier si la situation est compatible',
                      'Éviter les erreurs courantes',
                      'Préserver l’intégrité de la porte et de la serrure',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Block 2: Responsabilité */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <ShieldCheck className="w-6 h-6 text-orange-600 mr-2" />
                    Une approche responsable et encadrée
                  </h2>
                  <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200">
                    <p className="text-slate-700 font-medium mb-3">Les méthodes présentées :</p>
                    <ul className="space-y-2 mb-6 text-slate-600">
                      <li className="flex items-center">
                        <XCircle className="w-4 h-4 text-slate-400 mr-2" /> Ne constituent pas un
                        dépannage physique
                      </li>
                      <li className="flex items-center">
                        <XCircle className="w-4 h-4 text-slate-400 mr-2" /> Ne garantissent pas un
                        résultat
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Ne s’appliquent que
                        dans des situations autorisées
                      </li>
                    </ul>
                    <p className="text-sm text-slate-500 border-t border-slate-200 pt-4 italic">
                      "Avant toute action, l’utilisateur est invité à analyser sa situation, à
                      respecter les conditions de compatibilité, et à interrompre immédiatement en
                      cas de doute."
                    </p>
                  </div>
                </div>

                {/* Block 3: Pédagogie */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                    Des contenus pédagogiques, pas des interventions
                  </h2>
                  <div className="text-slate-600 leading-relaxed space-y-4">
                    <p>Les guides fournis (PDF et vidéos) ont une vocation :</p>
                    <div className="flex flex-wrap gap-3">
                      {['Éducative', 'Préventive', 'Informative'].map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-1.5 bg-white text-slate-700 rounded-full text-sm font-bold border border-slate-200 shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="pt-2">
                      Ils permettent de prendre une décision éclairée, que ce soit pour agir
                      soi-même lorsque c’est possible, ou pour comprendre quand une intervention
                      extérieure est nécessaire.
                    </p>
                  </div>
                </div>

                {/* Block 4: Sécurité */}
                <div className="bg-slate-900 rounded-2xl p-8 text-center md:text-left md:flex md:items-center md:justify-between shadow-xl shadow-slate-900/10">
                  <div className="mb-6 md:mb-0 md:mr-6">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <Lock className="w-5 h-5 text-green-400 mr-2" />
                      <h2 className="text-lg font-bold text-white">
                        Sécurité, légalité et transparence
                      </h2>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                      L’accès aux contenus est sécurisé. Les supports sont protégés et réservés à un
                      usage personnel.{' '}
                      <span className="text-slate-200">
                        Aucune information n’est destinée à contourner un dispositif de sécurité ou
                        à faciliter une utilisation illégale.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-16 text-center">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="inline-flex items-center text-slate-900 font-bold border-2 border-slate-200 px-8 py-3 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition duration-300"
                >
                  Retour au catalogue
                </button>
              </div>
            </div>
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <Hero
              onCtaClick={() => {
                requestAnimationFrame(() => {
                  const element = document.getElementById('products-section');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
              }}
            />

            <div className="bg-slate-900 border-y border-slate-800 py-6">
              <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400 text-sm font-medium uppercase tracking-widest">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-slate-600" /> 100% Légal
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-slate-600" /> +5000 Clients aidés
                </div>
                <div className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-slate-600" /> Accès Immédiat
                </div>
              </div>
            </div>

            <div id="products-section" className="py-20 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    Choisissez votre solution
                  </h2>
                  <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                    Identifiez votre problème. Nous avons le plan d'action correspondant.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isOwned={user?.purchasedProductIds.includes(product.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <BentoFeatures />

            {/* NEW SECTION: WhatsApp Support Integration */}
            <WhatsAppSupport onOpenChat={() => setIsChatOpen(true)} />

            <HowItWorksSection />

            <TestimonialsSection />

            <FAQSection />
          </>
        );
    }
  };

  return (
    <Layout
      user={user}
      onNavigate={setCurrentPage}
      currentPage={currentPage}
      onLogout={handleLogout}
      onLoginClick={() => setCurrentPage('login')}
      onCheckout={handleCheckout}
    >
      {notification && (
        <div className="fixed top-24 right-4 z-[160] bg-slate-800 text-white px-6 py-4 rounded-lg shadow-2xl border border-slate-700 animate-fade-in-down flex items-center">
          <div className="mr-3">
            {notification.includes('✅') ? (
              <ShieldCheck className="text-green-500" />
            ) : (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
          <div>{notification}</div>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-slate-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {isCheckingOut && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center text-white">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
          <h3 className="text-xl font-bold">Redirection vers le paiement sécurisé...</h3>
          <p className="text-slate-400 mt-2 text-sm">Veuillez patienter</p>
        </div>
      )}

      <PageTransition pageKey={currentPage}>{renderContent()}</PageTransition>

      <ChatBot user={user} isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />

      {showCookieBanner && (
        <CookieBanner
          onAcceptAll={() =>
            handleCookieChoice({
              necessary: true,
              analytics: true,
              marketing: true,
            })
          }
          onRefuseAll={() =>
            handleCookieChoice({
              necessary: true,
              analytics: false,
              marketing: false,
            })
          }
          onSavePreferences={handleCookieChoice}
          onLearnMore={() => setCurrentPage('privacy')}
        />
      )}

      {devMode && (
        <div className="fixed bottom-2 left-2 z-[300] px-3 py-2 text-xs rounded bg-slate-900/80 text-slate-100 border border-slate-700 shadow">
          Dev • Supabase: {supaHost || 'non défini'}
        </div>
      )}
    </Layout>
  );
};

const App = () => (
  <SettingsProvider>
    <ProductProvider>
      <TestimonialProvider>
        <CartProvider>
          <SerrureMasterApp />
        </CartProvider>
      </TestimonialProvider>
    </ProductProvider>
  </SettingsProvider>
);

export default App;
