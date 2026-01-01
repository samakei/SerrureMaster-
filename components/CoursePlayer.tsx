import React, { useState, useEffect } from 'react';
import { User, CourseContent, Lesson } from '../types';
import { useProducts } from '../contexts/ProductContext';
import { PRODUCTS } from '../constants';
import {
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface CoursePlayerProps {
  user: User;
  productId: string;
  onBack: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ user, productId, onBack }) => {
  const { courses } = useProducts();
  const [activeCourse, setActiveCourse] = useState<CourseContent | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [hasAcceptedLegal, setHasAcceptedLegal] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Charger le contenu du cours dynamiquement
  useEffect(() => {
    // Récupération depuis le contexte dynamique au lieu de la constante statique
    const content = courses[productId];

    if (content) {
      // FILTRAGE SECURITÉ :
      // Si l'utilisateur n'est pas admin, on filtre les modules et leçons en "draft"
      const isAdmin = user.role === 'admin';

      const filteredModules = content.modules
        .map((mod) => ({
          ...mod,
          lessons: mod.lessons.filter((l) => isAdmin || l.status === 'published'),
        }))
        .filter((mod) => mod.lessons.length > 0 || isAdmin); // On garde les modules vides seulement pour l'admin

      const filteredContent = { ...content, modules: filteredModules };

      setActiveCourse(filteredContent);

      // Ouvrir le premier module par défaut
      if (filteredContent.modules.length > 0) {
        const firstMod = filteredContent.modules[0];
        setExpandedModules({ [firstMod.id]: true });
        // Sélectionner la première leçon
        if (firstMod.lessons.length > 0) {
          setActiveLesson(firstMod.lessons[0]);
        }
      }
    }
  }, [productId, courses, user.role]);

  const productInfo = PRODUCTS.find((p) => p.id === productId);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleLessonChange = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setHasAcceptedLegal(false); // Réinitialiser l'acceptation légale à chaque nouvelle vidéo
    setVideoError(false);
  };

  if (!activeCourse || !activeLesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Contenu non disponible</h2>
          <p className="text-slate-400 mt-2">
            Le contenu pédagogique pour ce produit est en cours de mise en ligne ou ne contient
            aucune leçon publiée.
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION (Modules) */}
      <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-[50vh] md:h-screen sticky top-0 z-20">
        <div className="p-4 border-b border-slate-800 flex items-center bg-slate-900">
          <button
            onClick={onBack}
            className="mr-3 text-slate-400 hover:text-white transition"
            aria-label="Retour à la liste des formations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              Formation
            </h2>
            <p className="text-sm font-bold text-white truncate w-48">{productInfo?.title}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {activeCourse.modules.map((module, mIdx) => (
            <div
              key={module.id}
              className="bg-slate-950/50 rounded-lg overflow-hidden border border-slate-800/50"
            >
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition text-left"
              >
                <span className="text-sm font-bold text-slate-200 flex-1">
                  <span className="text-slate-500 mr-2 text-xs">0{mIdx + 1}.</span>
                  {module.title}
                </span>
                {expandedModules[module.id] ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {expandedModules[module.id] && (
                <div className="border-t border-slate-800/50">
                  {module.lessons.map((lesson) => {
                    const isActive = activeLesson.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonChange(lesson)}
                        className={`w-full px-4 py-3 flex items-start text-left text-sm transition border-l-2 ${
                          isActive
                            ? 'bg-orange-500/10 border-orange-500 text-orange-100'
                            : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 mr-3">
                          {isActive ? (
                            <PlayCircle className="w-4 h-4 text-orange-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${isActive ? 'text-white' : ''}`}>
                              {lesson.title}
                            </p>
                            {lesson.status === 'draft' && (
                              <span className="text-[9px] px-1 bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded uppercase">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] opacity-60 mt-0.5">{lesson.duration}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Sticky Button in Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <a
            href="https://wa.me/33757570389"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm transition shadow-lg shadow-green-900/20"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            SOS WhatsApp (24/7)
          </a>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[50vh] md:h-screen overflow-y-auto bg-slate-950">
        {/* Video Player Section */}
        <div className="w-full bg-black relative aspect-video flex items-center justify-center">
          {/* LEGAL OVERLAY (Before Play) */}
          {!hasAcceptedLegal ? (
            <div className="absolute inset-0 z-10 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <ShieldCheck className="w-16 h-16 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Avertissement de Sécurité</h3>
              <p className="text-slate-300 max-w-lg mb-6 leading-relaxed">
                Vous allez visionner une technique professionnelle. <br />
                En cliquant sur "J'accepte", vous certifiez être l'occupant légitime du logement et
                comprenez que SerrureMaster décline toute responsabilité en cas de mauvaise
                manipulation.
              </p>
              <button
                onClick={() => setHasAcceptedLegal(true)}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                J'accepte et je visionne
              </button>
              <p className="mt-4 text-[10px] text-slate-500">
                ID Utilisateur: {user.id} • IP Loggée
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                src={activeLesson.videoUrl}
                controls
                className="w-full h-full"
                poster={activeLesson.thumbnail || productInfo?.image}
                onError={() => setVideoError(true)}
                onContextMenu={(e) => e.preventDefault()} // Anti-Right Click
                controlsList="nodownload" // Chrome attribute
              />
              {/* Dynamic Watermark Overlay on Video */}
              <div className="absolute top-4 right-4 opacity-30 pointer-events-none select-none">
                <p className="text-[10px] text-white font-mono">{user.id}</p>
              </div>

              {videoError && (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-white">
                  <div className="text-center">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                    <p>Erreur de chargement vidéo.</p>
                    <p className="text-sm text-slate-400">Vérifiez votre connexion.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lesson Content Below Video */}
        <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{activeLesson.title}</h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                {activeLesson.description}
              </p>
            </div>
            <div className="bg-slate-900 px-4 py-2 rounded border border-slate-800 text-xs font-mono text-slate-500">
              Durée: {activeLesson.duration}
            </div>
          </div>

          {/* Checklist Contextuelle */}
          {activeLesson.checklist && activeLesson.checklist.length > 0 && (
            <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-6 mb-8">
              <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Points Clés à retenir
              </h3>
              <div className="grid gap-3">
                {activeLesson.checklist.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-orange-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-orange-500" />
                    </div>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources / Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition flex items-center justify-center border border-slate-700">
              <FileText className="w-4 h-4 mr-2 text-slate-400" />
              Télécharger le PDF Résumé
            </button>
            {/* Next Lesson Button (Logic to find next) */}
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition flex items-center justify-center shadow-lg shadow-indigo-900/20">
              Leçon suivante
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
