import React, { useMemo } from 'react';
import {
  CheckCircle,
  Play,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Lock,
  MessageCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { PRODUCTS } from '../constants';

export const Hero: React.FC<{ onCtaClick: () => void }> = React.memo(({ onCtaClick }) => {
  const { heroImage } = useSettings();

  // Mémoiser l'image du produit
  const featuredProductImage = useMemo(() => PRODUCTS[0].image, []);

  return (
    <div className="relative bg-slate-950 overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        {heroImage && (
          <img
            src={heroImage}
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            alt="Background Texture"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content - COPYWRITING UX EXPERT & LÉGAL */}
          <div className="text-left space-y-8 animate-fade-in-up">
            {/* Trust Badge - Réassurance Expertise */}
            <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-700 rounded-full px-4 py-1.5 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span className="text-slate-300 text-xs font-bold tracking-wider uppercase">
                Protocole Certifié • Non Destructif
              </span>
            </div>

            {/* TITRE PRINCIPAL : Impact + Bénéfice + Sécurité */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Porte claquée ? <br />
              La méthode officielle pour <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                agir sans tout casser.
              </span>
            </h1>

            {/* SOUS-TITRE : Clarté + Légal + Immédiateté */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Avant d'appeler un dépanneur, accédez au <strong>plan d'action vidéo</strong> utilisé
              par les professionnels. Une solution légale et guidée pas à pas pour tenter
              l'ouverture vous-même.
            </p>

            {/* BLOC PÉRIMÈTRE (DO'S & DON'TS) - CRUCIAL POUR LA CONVERSION & LES CGV */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden grid sm:grid-cols-2 text-sm shadow-xl">
              <div className="p-5 border-b sm:border-b-0 sm:border-r border-slate-800 bg-green-900/20">
                <p className="text-green-400 font-bold text-xs uppercase mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Situation Compatible
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> Porte claquée (Clé oubliée à
                    l'intérieur)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> Porte blindée claquée (non
                    verrouillée)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> Clé cassée (morceau visible)
                  </li>
                </ul>
              </div>
              <div className="p-5 bg-red-900/10">
                <p className="text-red-400 font-bold text-xs uppercase mb-3 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  Strictement Impossible
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">•</span> Porte fermée à clé (Verrouillée)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">•</span> Serrure bloquée / vandalisée
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">•</span> Perte de clé totale (si fermé à
                    clé)
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onCtaClick}
                className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/40 transition-all hover:scale-[1.02] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm">Obtenir le Protocole Vidéo</span>
                  <span className="text-[10px] font-normal opacity-90">
                    Accès immédiat sécurisé
                  </span>
                </div>
                <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm text-slate-300">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Un doute ?</span>
                  <span className="text-[10px] text-slate-300">Diagnostic IA Gratuit</span>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer Micro-copy */}
            <div className="flex items-start gap-2 opacity-60 max-w-lg">
              <AlertTriangle className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 leading-tight">
                <strong>Cadre légal :</strong> Service pédagogique avec obligation de moyens. Ne
                constitue pas une garantie d'ouverture. L'utilisateur certifie être l'occupant
                légitime du logement.
              </p>
            </div>
          </div>

          {/* Right Visual (Premium Smartphone Mockup) */}
          <div className="relative hidden lg:block perspective-1000 group">
            {/* Neon Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-gradient-to-tr from-orange-600/30 to-blue-600/30 rounded-full blur-[60px] animate-pulse-slow"></div>

            {/* Phone Chassis */}
            <div className="relative w-[300px] mx-auto transform rotate-y-12 rotate-z-2 group-hover:rotate-y-0 group-hover:rotate-z-0 transition-all duration-700 ease-out z-10">
              {/* Frame */}
              <div className="relative h-[620px] rounded-[3rem] bg-slate-900 border-[6px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-slate-950 flex flex-col">
                  {/* Status Bar */}
                  <div className="h-14 w-full flex justify-between items-end px-6 pb-2 text-white/80 text-[10px] font-medium z-20">
                    <span>09:41</span>
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 bg-white/20 rounded-full"></div>
                      <div className="h-2.5 w-2.5 bg-white/20 rounded-full"></div>
                      <div className="h-2.5 w-4 bg-white/80 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-6 py-4 border-b border-slate-800/50 flex justify-between items-center z-20 bg-slate-950/80 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-white text-sm tracking-tight">
                        SerrureMaster
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                  </div>

                  {/* Main Content Scrollable */}
                  <div className="flex-1 overflow-hidden relative">
                    {/* Hero Card inside App */}
                    <div className="relative h-64 bg-slate-900 m-4 rounded-2xl overflow-hidden border border-slate-800 group-hover:border-orange-500/30 transition-colors">
                      <img
                        src={featuredProductImage}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                        alt="Secure Content"
                        {...({ fetchpriority: 'high' } as any)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur border border-orange-500/50 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse">
                          <Lock className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Guide : Porte Claquée</h3>
                        <p className="text-orange-400 text-xs font-mono tracking-wider uppercase">
                          Contenu Sécurisé
                        </p>
                      </div>

                      {/* Timeline */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                        <div className="h-full w-1/3 bg-orange-500"></div>
                      </div>
                    </div>

                    {/* List Items */}
                    <div className="px-4 space-y-3">
                      <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center px-4 gap-3 opacity-60">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-24 bg-slate-700 rounded mb-1.5"></div>
                          <div className="h-1.5 w-16 bg-slate-800 rounded"></div>
                        </div>
                        <Lock className="w-3 h-3 text-slate-600" />
                      </div>
                      <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center px-4 gap-3 opacity-40">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                          <Play className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-20 bg-slate-700 rounded mb-1.5"></div>
                          <div className="h-1.5 w-12 bg-slate-800 rounded"></div>
                        </div>
                        <Lock className="w-3 h-3 text-slate-600" />
                      </div>
                    </div>

                    {/* Unlock Button Mockup */}
                    <div className="absolute bottom-8 left-4 right-4">
                      <div className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl text-center text-white text-xs font-bold shadow-lg shadow-orange-900/40 opacity-90">
                        Débloquer le Plan d'Action
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reflection Gloss */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-[2.5rem] z-30"></div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-[20%] -right-6 z-40 bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-xl animate-float delay-0">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full text-green-500 border border-green-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Légal & Éthique</p>
                  <p className="text-[10px] text-slate-400">Sans effraction</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[25%] -left-8 z-40 bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-xl animate-float delay-2000">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 border border-blue-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Méthode Pro</p>
                  <p className="text-[10px] text-slate-400">Accès immédiat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .rotate-y-12 { transform: rotateY(-12deg); }
        .rotate-z-2 { transform: rotateZ(2deg); }
      `}</style>
    </div>
  );
});

Hero.displayName = 'Hero';
