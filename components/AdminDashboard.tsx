import React, { useEffect, useState, useRef } from 'react';
import { User, AdminLog, DailySales, Product } from '../types';
import { getAdminStats } from '../services/adminService';
import { useProducts } from '../contexts/ProductContext';
// import { useSettings } from '../contexts/SettingsContext';
import { useTestimonials } from '../contexts/TestimonialContext';
import { LOGO_URL } from '../constants';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ShieldAlert,
  AlertTriangle,
  FileText,
  LogOut,
  ShoppingBag,
  Upload,
  Save,
  Check,
  Loader2,
  XCircle,
  MessageSquare,
  Star,
  Trash2,
  Eye,
  EyeOff,
  FileCheck,
  FileWarning,
  Video,
  Plus,
  PlayCircle,
} from 'lucide-react';

// Fonction utilitaire de compression d'image optimisée pour LocalStorage
const compressAndResizeImage = (
  file: File,
  width = 800,
  height = 600,
  quality = 0.6
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas context error');
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scaleFactor = Math.max(width / img.width, height / img.height);
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;
        const offsetX = (width - newWidth) / 2;
        const offsetY = (height - newHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const SimpleLineChart: React.FC<{ data: DailySales[] }> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.amount)) || 100;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.amount / maxVal) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-40 relative mt-4">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          stroke="#334155"
          strokeWidth="0.5"
          strokeDasharray="2"
        />
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="#334155"
          strokeWidth="0.5"
          strokeDasharray="2"
        />
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="100"
          stroke="#334155"
          strokeWidth="0.5"
          strokeDasharray="2"
        />
        <polyline
          fill="none"
          stroke="#818cf8"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        <polygon fill="url(#gradient)" stroke="none" points={`0,100 ${points} 100,100`} />
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400 mt-2">
        {data
          .filter((_, i) => i % 3 === 0)
          .map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
      </div>
    </div>
  );
};

// --- COMPOSANT GESTION COURS VIDEO (LMS) ---
const CourseManager: React.FC<{ product: Product }> = ({ product }) => {
  const { courses, addModule, addLesson, updateLessonStatus } = useProducts();
  const courseContent = courses[product.id];
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);

  // Lesson Form State
  const [lTitle, setLTitle] = useState('');
  const [lUrl, setLUrl] = useState('');
  const [lDuration, setLDuration] = useState('');
  const [lDesc, setLDesc] = useState('');

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      addModule(product.id, newModuleTitle);
      setNewModuleTitle('');
    }
  };

  const handleAddLesson = () => {
    if (addingLessonTo && lTitle && lUrl) {
      addLesson(product.id, addingLessonTo, {
        title: lTitle,
        videoUrl: lUrl,
        duration: lDuration || '00:00',
        provider: 'native', // Simplified for demo
        description: lDesc,
      });
      setAddingLessonTo(null);
      setLTitle('');
      setLUrl('');
      setLDuration('');
      setLDesc('');
    }
  };

  return (
    <div className="mt-6 bg-slate-900/50 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold flex items-center">
          <Video className="w-5 h-5 mr-2 text-indigo-500" />
          Programme Vidéo (LMS)
        </h4>
        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
          {product.title}
        </span>
      </div>

      {/* Add Module */}
      <div className="flex gap-2 mb-6">
        <label htmlFor="new-module-title" className="sr-only">
          Titre du nouveau module
        </label>
        <input
          id="new-module-title"
          type="text"
          placeholder="Titre du nouveau module..."
          className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
        />
        <button
          onClick={handleAddModule}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-sm font-bold flex items-center shadow-lg shadow-indigo-900/20"
        >
          <Plus className="w-4 h-4 mr-1" /> Module
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {courseContent?.modules?.map((mod, mIdx) => (
          <div
            key={mod.id}
            className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
          >
            <div className="p-3 bg-slate-700/50 flex justify-between items-center border-b border-slate-700">
              <span className="text-sm font-bold text-white flex items-center">
                <span className="bg-slate-600 text-slate-300 w-5 h-5 flex items-center justify-center rounded-full text-[10px] mr-2">
                  {mIdx + 1}
                </span>
                {mod.title}
              </span>
              <button
                onClick={() => setAddingLessonTo(addingLessonTo === mod.id ? null : mod.id)}
                className={`text-xs px-3 py-1.5 rounded transition font-bold flex items-center ${
                  addingLessonTo === mod.id
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-slate-600 hover:bg-slate-500 text-white'
                }`}
              >
                {addingLessonTo === mod.id ? (
                  <XCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Plus className="w-3 h-3 mr-1" />
                )}
                {addingLessonTo === mod.id ? 'Annuler' : 'Ajouter Leçon'}
              </button>
            </div>

            {/* Add Lesson Form */}
            {addingLessonTo === mod.id && (
              <div className="p-4 bg-slate-900/50 border-b border-slate-700 animate-fade-in shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                    Nouvelle Leçon
                  </h5>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    Brouillon par défaut
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label
                        htmlFor="lesson-title"
                        className="block text-[10px] uppercase text-slate-400 font-bold mb-1"
                      >
                        Titre de la leçon *
                      </label>
                      <input
                        id="lesson-title"
                        value={lTitle}
                        onChange={(e) => setLTitle(e.target.value)}
                        placeholder="Ex: Introduction au crochetage..."
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lesson-duration"
                        className="block text-[10px] uppercase text-slate-400 font-bold mb-1"
                      >
                        Durée (MM:SS)
                      </label>
                      <input
                        id="lesson-duration"
                        value={lDuration}
                        onChange={(e) => setLDuration(e.target.value)}
                        placeholder="00:00"
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lesson-url"
                      className="block text-[10px] uppercase text-slate-400 font-bold mb-1"
                    >
                      URL Vidéo * (Mp4 / Vimeo / Mux)
                    </label>
                    <input
                      id="lesson-url"
                      value={lUrl}
                      onChange={(e) => setLUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lesson-description"
                      className="block text-[10px] uppercase text-slate-400 font-bold mb-1"
                    >
                      Description / Notes
                    </label>
                    <textarea
                      id="lesson-description"
                      value={lDesc}
                      onChange={(e) => setLDesc(e.target.value)}
                      placeholder="Description visible sous la vidéo..."
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white focus:border-indigo-500 outline-none placeholder-slate-600 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 mt-2">
                    <button
                      onClick={() => setAddingLessonTo(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddLesson}
                      disabled={!lTitle || !lUrl}
                      className={`px-4 py-1.5 rounded text-xs font-bold text-white transition flex items-center shadow-md ${
                        lTitle && lUrl
                          ? 'bg-green-600 hover:bg-green-500'
                          : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Enregistrer la leçon
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lessons List */}
            <div className="divide-y divide-slate-700/50">
              {mod.lessons.map((les) => (
                <div
                  key={les.id}
                  className="p-3 flex items-center justify-between hover:bg-slate-700/30 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        les.status === 'published' ? 'bg-green-500/10' : 'bg-slate-700'
                      }`}
                    >
                      <PlayCircle
                        className={`w-4 h-4 ${
                          les.status === 'published' ? 'text-green-500' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-200 font-medium group-hover:text-white">
                        {les.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{les.duration || '--:--'}</span>
                        <span>•</span>
                        <span className="uppercase">{les.provider}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider ${
                        les.status === 'published'
                          ? 'bg-green-500/10 text-green-500 border-green-500/30'
                          : 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                      }`}
                    >
                      {les.status === 'published' ? 'Publié' : 'Brouillon'}
                    </div>
                    <button
                      onClick={() =>
                        updateLessonStatus(
                          product.id,
                          mod.id,
                          les.id,
                          les.status === 'published' ? 'draft' : 'published'
                        )
                      }
                      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
                      title={les.status === 'published' ? 'Dépublier' : 'Publier'}
                    >
                      {les.status === 'published' ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {mod.lessons.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-600 italic mb-2">Aucune leçon dans ce module</p>
                  <button
                    onClick={() => setAddingLessonTo(mod.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Ajouter la première leçon
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {(!courseContent?.modules || courseContent.modules.length === 0) && (
          <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg bg-slate-900/30">
            <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Ce produit n'a pas encore de structure vidéo.</p>
            <p className="text-slate-600 text-xs mt-1">
              Commencez par ajouter un module ci-dessus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductEditRow: React.FC<{ product: Product }> = ({ product }) => {
  const { updateProductDetails, uploadProductResource, updateResourceStatus } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [features, setFeatures] = useState(product.features.join('\n'));
  const [currentImage, setCurrentImage] = useState(product.image);

  const [isDirty, setIsDirty] = useState(false);
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCourseManager, setShowCourseManager] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setTitle(product.title);
    setDescription(product.description);
    setPrice(product.price);
    setFeatures(product.features.join('\n'));
    setCurrentImage(product.image);
    setIsDirty(false);
  }, [product]);

  const handleTextChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setIsDirty(true);
    setSuccessMsg('');
  };

  const handleSave = () => {
    updateProductDetails(product.id, {
      title,
      description,
      price: Number(price),
      features: features.split('\n').filter((f) => f.trim() !== ''),
      image: currentImage,
    });

    setIsDirty(false);
    setSuccessMsg('Sauvegardé !');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const processFile = async (file: File) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }
      setIsProcessingImg(true);
      try {
        const compressedBase64 = await compressAndResizeImage(file, 800, 600, 0.6);
        setCurrentImage(compressedBase64);
        setIsDirty(true);
        setSuccessMsg('');
      } catch (err) {
        console.error('Erreur compression', err);
        alert("Impossible de traiter l'image.");
      } finally {
        setIsProcessingImg(false);
        setIsDragging(false);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Format PDF uniquement.');
      return;
    }

    setIsUploadingPdf(true);
    try {
      await uploadProductResource(product.id, file);
      setSuccessMsg('PDF téléversé !');
    } catch (e) {
      console.error(e);
      alert('Erreur upload PDF');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const toggleResourceStatus = () => {
    if (!product.currentResource) return;
    const newStatus = product.currentResource.status === 'draft' ? 'published' : 'draft';
    updateResourceStatus(product.id, newStatus);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
      <div className="flex gap-6">
        {/* Image Uploader */}
        <div className="w-1/3 space-y-2">
          <div
            className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed transition-all group cursor-pointer ${
              isDragging
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-slate-600 bg-slate-900 hover:border-slate-500'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              processFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-xs font-bold uppercase">Changer l'image</span>
            </div>
            {isProcessingImg && (
              <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
            aria-label="Télécharger l'image du produit"
            title="Télécharger l'image du produit"
          />
        </div>

        {/* Text Fields */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="product-title"
                className="text-xs text-slate-400 font-bold uppercase mb-1 block"
              >
                Titre du produit
              </label>
              <input
                id="product-title"
                value={title}
                onChange={(e) => handleTextChange(setTitle, e.target.value)}
                aria-label="Titre du produit"
                title="Titre du produit"
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-orange-500 outline-none font-bold"
              />
            </div>
            <div className="w-24">
              <label
                htmlFor="product-price"
                className="text-xs text-slate-400 font-bold uppercase mb-1 block"
              >
                Prix (€)
              </label>
              <input
                id="product-price"
                type="number"
                value={price}
                onChange={(e) => handleTextChange(setPrice, e.target.value)}
                aria-label="Prix en euros"
                title="Prix du produit en euros"
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-orange-500 outline-none text-right"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">
              Description courte
            </label>
            <textarea
              value={description}
              onChange={(e) => handleTextChange(setDescription, e.target.value)}
              rows={2}
              aria-label="Description du produit"
              title="Description courte du produit"
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-300 focus:border-orange-500 outline-none resize-none"
            />
          </div>

          {/* --- GESTION RESSOURCE PDF --- */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <label className="text-xs text-slate-400 font-bold uppercase mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Ressource PDF Associée
            </label>

            {product.currentResource ? (
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-600">
                <div className="flex items-center">
                  {product.currentResource.status === 'published' ? (
                    <FileCheck className="w-5 h-5 text-green-500 mr-3" />
                  ) : (
                    <FileWarning className="w-5 h-5 text-orange-500 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-white font-medium">
                      {product.currentResource.fileName}
                    </p>
                    <p className="text-xs text-slate-500">
                      v{product.currentResource.version} • {product.currentResource.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      product.currentResource.status === 'published'
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                        : 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                    }`}
                  >
                    {product.currentResource.status === 'published' ? 'PUBLIÉ' : 'BROUILLON'}
                  </div>

                  <button
                    onClick={toggleResourceStatus}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    {product.currentResource.status === 'published'
                      ? 'Passer en brouillon'
                      : 'Publier'}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border border-dashed border-slate-600 rounded p-4 text-center hover:bg-slate-800 transition cursor-pointer"
                onClick={() => pdfInputRef.current?.click()}
              >
                {isUploadingPdf ? (
                  <div className="flex items-center justify-center text-orange-500">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Téléversement...
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm">
                    <Upload className="w-4 h-4 mx-auto mb-1" />
                    Cliquez pour ajouter un PDF
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              ref={pdfInputRef}
              onChange={handlePdfUpload}
              className="hidden"
              accept="application/pdf"
              aria-label="Télécharger le PDF du produit"
              title="Télécharger le PDF du produit"
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-700 mt-4">
            <button
              onClick={() => setShowCourseManager(!showCourseManager)}
              className="text-indigo-400 text-sm font-bold flex items-center hover:text-indigo-300"
            >
              <Video className="w-4 h-4 mr-2" />
              {showCourseManager ? 'Masquer le Programme Vidéo' : 'Gérer le Programme Vidéo'}
            </button>

            <div className="flex items-center gap-4">
              <span className="text-green-500 text-sm font-bold animate-fade-in">{successMsg}</span>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`px-4 py-2 rounded font-bold text-sm flex items-center transition ${
                  isDirty
                    ? 'bg-orange-600 text-white hover:bg-orange-500'
                    : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Manager Panel */}
      {showCourseManager && <CourseManager product={product} />}
    </div>
  );
};

export const AdminDashboard: React.FC<{
  currentUser: User;
  onLogout: () => void;
}> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'settings'>(
    'overview'
  );
  const [stats, setStats] = useState<any>(null);
  const { products } = useProducts();
  const { testimonials, toggleApproval, deleteTestimonial } = useTestimonials();

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <img src={LOGO_URL} className="w-8 h-8 mr-3" alt="Logo" />
          <span className="font-bold text-white tracking-wider">
            MASTER<span className="text-orange-500">ADMIN</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" /> Produits & PDF
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
              activeTab === 'users'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 mr-3" /> Clients
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-3" /> Avis & Config
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-green-500 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> En ligne
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <DollarSign className="w-16 h-16 text-emerald-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Chiffre d'affaires
                </p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.revenue} €</h3>
                <div className="mt-4 flex items-center text-emerald-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" /> +12% cette semaine
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Users className="w-16 h-16 text-blue-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Clients Actifs
                </p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.clients}</h3>
                <div className="mt-4 flex items-center text-blue-400 text-sm">
                  <Activity className="w-4 h-4 mr-1" /> 5 nouveaux aujourd'hui
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <ShieldAlert className="w-16 h-16 text-orange-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Sécurité
                </p>
                <h3 className="text-3xl font-bold text-white mt-1">Sécurisé</h3>
                <div className="mt-4 flex items-center text-orange-400 text-sm">
                  <ShieldAlert className="w-4 h-4 mr-1" /> 0 tentative d'intrusion
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Évolution des Ventes (14 jours)</h3>
              <SimpleLineChart data={stats.salesTrend} />
            </div>

            {/* Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Logs Système Récents</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950/50 text-slate-400 uppercase font-bold text-xs">
                    <tr>
                      <th className="p-4">Horodatage</th>
                      <th className="p-4">Utilisateur</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">IP</th>
                      <th className="p-4">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {stats.logs.map((log: AdminLog) => (
                      <tr key={log.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-white font-medium">{log.userId}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              log.severity === 'danger'
                                ? 'bg-red-500/10 text-red-500'
                                : log.severity === 'warning'
                                  ? 'bg-orange-500/10 text-orange-500'
                                  : 'bg-blue-500/10 text-blue-500'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400">{log.ip}</td>
                        <td className="p-4">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Gestion du Catalogue</h1>
              <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-sm flex items-center">
                <Upload className="w-4 h-4 mr-2" /> Nouveau Produit
              </button>
            </div>

            <div className="space-y-8">
              {products.map((product) => (
                <ProductEditRow key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Settings / Testimonials */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-indigo-500" />
              Modération & Configuration
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  Avis Clients ({testimonials.length})
                </h3>
                <div className="flex gap-2 text-xs">
                  <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded border border-orange-500/30">
                    {testimonials.filter((t) => !t.approved).length} En attente
                  </span>
                  <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/30">
                    {testimonials.filter((t) => t.approved).length} Publiés
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-800">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className={`p-6 flex items-start justify-between transition ${
                      t.approved ? 'bg-slate-900' : 'bg-orange-950/10 hover:bg-orange-900/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-bold ${t.approved ? 'text-white' : 'text-orange-200'}`}
                        >
                          {t.name}
                        </span>
                        {t.role && (
                          <span className="text-xs text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {t.role}
                          </span>
                        )}
                        <div className="flex text-orange-500 ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < t.rating ? 'fill-current' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm italic mb-2">"{t.text}"</p>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>{new Date(t.date).toLocaleDateString()}</span>
                        <span className="uppercase tracking-wider">{t.source}</span>
                        {!t.approved && (
                          <span className="text-orange-500 font-bold flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Validation requise
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleApproval(t.id)}
                        className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition text-xs font-bold ${
                          t.approved
                            ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20'
                            : 'bg-orange-500 text-white border-orange-600 hover:bg-orange-400 shadow-lg shadow-orange-900/20'
                        }`}
                      >
                        {t.approved ? (
                          <>
                            <Eye className="w-3 h-3" /> Publié
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" /> Valider
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="p-2 rounded-lg border border-red-900/30 text-red-500 hover:bg-red-900/20 transition hover:text-red-400"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    Aucun avis pour le moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
