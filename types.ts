export enum ProductType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  BUNDLE = 'BUNDLE',
}

export type ResourceStatus = 'draft' | 'published' | 'archived';

export interface ProductResource {
  id: string;
  productId: string;
  fileName: string; // Nom d'affichage du fichier
  filePath: string; // Chemin storage
  fileSize: string;
  status: ResourceStatus;
  version: number;
  lastUpdated: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number; // Added for strike-through price
  features: string[]; // "Inclus" section
  compatibility?: {
    // New section for "Compatibilité"
    valid: string[];
    invalid: string[];
  };
  type: ProductType;
  image: string;
  stripePriceId: string;
  // Relation optionnelle vers la ressource active (le PDF)
  currentResource?: ProductResource | null;
}

// --- LMS STRUCTURE TYPES ---

export type VideoProvider = 'native' | 'vimeo' | 'mux' | 'youtube';

export interface Lesson {
  id: string;
  title: string;
  duration: string; // ex: "3:45"
  videoUrl: string; // URL ou ID de la vidéo
  provider: VideoProvider; // Nouveau : Type de fournisseur
  status: ResourceStatus; // Nouveau : Contrôle de visibilité
  thumbnail?: string;
  isCompleted?: boolean;
  isLocked?: boolean; // Pour le drip content ou l'upsell
  description?: string; // Petit texte sous la vidéo
  checklist?: string[]; // Points clés à vérifier
}

export interface Module {
  id: string;
  title: string;
  status: ResourceStatus; // Nouveau : Contrôle de visibilité au niveau module
  lessons: Lesson[];
}

export interface CourseContent {
  productId: string;
  modules: Module[];
}

// ---------------------------

export interface CartItem extends Product {
  quantity: number;
  addedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  purchasedProductIds: string[];
  role?: 'user' | 'admin'; // Added role for security check
  status?: 'active' | 'blocked'; // Added status for admin management
  joinedAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  ip: string;
  action: string;
  userId: string;
  details: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface DailySales {
  date: string;
  amount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // ex: "Paris 11ème" ou "Client Vérifié"
  text: string;
  rating: number; // 1-5
  approved: boolean;
  date: string;
  source?: 'google' | 'email' | 'trustpilot';
}
