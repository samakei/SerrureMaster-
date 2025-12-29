import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductResource, ResourceStatus, CourseContent, Module, Lesson } from '../types';
import { supabase } from '../services/supabaseClient';
import {
  PRODUCTS as FALLBACK_PRODUCTS,
  COURSE_CONTENT as INITIAL_COURSE_CONTENT,
} from '../constants';

interface ProductContextType {
  products: Product[];
  courses: Record<string, CourseContent>;
  updateProductImage: (productId: string, newImageUrl: string) => void;
  updateProductDetails: (productId: string, updates: Partial<Product>) => void;
  resetProducts: () => void;
  // Gestion PDF
  uploadProductResource: (productId: string, file: File) => Promise<void>;
  updateResourceStatus: (productId: string, status: ResourceStatus) => void;
  // Gestion Vidéo (LMS)
  addModule: (productId: string, title: string) => void;
  addLesson: (productId: string, moduleId: string, lesson: Omit<Lesson, 'id' | 'status'>) => void;
  updateLessonStatus: (
    productId: string,
    moduleId: string,
    lessonId: string,
    status: ResourceStatus
  ) => void;
  updateLessonDetails: (
    productId: string,
    moduleId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [courses, setCourses] = useState<Record<string, CourseContent>>(INITIAL_COURSE_CONTENT);

  // Charger les produits depuis Supabase au montage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Chargement des produits depuis Supabase...');
        const { data, error } = await supabase.from('products').select('*');

        console.log('📥 Réponse Supabase:', { data, error });

        if (error) throw error;

        if (data && data.length > 0) {
          console.log('🔧 Mapping des produits:', data);

          // Mapper les colonnes snake_case de Supabase vers camelCase TypeScript
          const mappedProducts = data.map((dbProduct: any) => ({
            id: dbProduct.id,
            title: dbProduct.title,
            description: dbProduct.description || '',
            price: dbProduct.price,
            originalPrice: dbProduct.original_price,
            image: dbProduct.image,
            stripePriceId: dbProduct.stripe_price_id, // ⚡ MAPPING IMPORTANT
            type: dbProduct.type || 'bundle',
            features: dbProduct.features || [],
            compatibility: dbProduct.compatibility,
            currentResource: null, // Les ressources sont gérées séparément
          }));

          console.log('✅ Produits mappés:', mappedProducts);
          console.log(
            '🔍 Vérification Price IDs:',
            mappedProducts.map((p) => ({ id: p.id, stripePriceId: p.stripePriceId }))
          );

          setProducts(mappedProducts as Product[]);
        }
      } catch (err: any) {
        console.error('❌ Erreur chargement produits:', err);
        // En cas d'erreur, utiliser les données par défaut
      }
    };

    fetchProducts();
  }, []);

  const updateProductImage = async (productId: string, newImageUrl: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, image: newImageUrl } : p)));
    try {
      await supabase.from('products').update({ image: newImageUrl }).eq('id', productId);
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  const updateProductDetails = async (productId: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    try {
      await supabase.from('products').update(updates).eq('id', productId);
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  const resetProducts = async () => {
    console.warn('Reset products not implemented for DB');
  };

  // --- GESTION DES RESSOURCES PDF (Mockée pour le prototype Frontend) ---

  const uploadProductResource = async (productId: string, file: File) => {
    // 1. Simulation d'upload vers Supabase Storage
    console.log(`Uploading ${file.name} for product ${productId}...`);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake latency

    // 2. Création de l'objet Ressource
    const newResource: ProductResource = {
      id: 'res_' + Date.now(),
      productId: productId,
      fileName: file.name,
      filePath: `secure-pdfs/${productId}/${file.name}`,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'draft', // Par défaut en brouillon pour validation
      version: 1,
      lastUpdated: new Date().toISOString(),
    };

    // 3. Mise à jour de l'état local (et DB théorique)
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, currentResource: newResource };
        }
        return p;
      })
    );
  };

  const updateResourceStatus = (productId: string, status: ResourceStatus) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId && p.currentResource) {
          return {
            ...p,
            currentResource: { ...p.currentResource, status },
          };
        }
        return p;
      })
    );
  };

  // --- GESTION DES COURS VIDEO (LMS) ---

  const addModule = (productId: string, title: string) => {
    setCourses((prev) => {
      const currentCourse = prev[productId] || { productId, modules: [] };
      const newModule: Module = {
        id: `mod_${Date.now()}`,
        title,
        status: 'draft',
        lessons: [],
      };
      return {
        ...prev,
        [productId]: {
          ...currentCourse,
          modules: [...currentCourse.modules, newModule],
        },
      };
    });
  };

  const addLesson = (
    productId: string,
    moduleId: string,
    lessonData: Omit<Lesson, 'id' | 'status'>
  ) => {
    setCourses((prev) => {
      const currentCourse = prev[productId];
      if (!currentCourse) return prev;

      const newLesson: Lesson = {
        ...lessonData,
        id: `les_${Date.now()}`,
        status: 'draft',
      };

      return {
        ...prev,
        [productId]: {
          ...currentCourse,
          modules: currentCourse.modules.map((mod) =>
            mod.id === moduleId ? { ...mod, lessons: [...mod.lessons, newLesson] } : mod
          ),
        },
      };
    });
  };

  const updateLessonStatus = (
    productId: string,
    moduleId: string,
    lessonId: string,
    status: ResourceStatus
  ) => {
    setCourses((prev) => {
      const currentCourse = prev[productId];
      if (!currentCourse) return prev;

      return {
        ...prev,
        [productId]: {
          ...currentCourse,
          modules: currentCourse.modules.map((mod) =>
            mod.id === moduleId
              ? {
                  ...mod,
                  lessons: mod.lessons.map((l) => (l.id === lessonId ? { ...l, status } : l)),
                }
              : mod
          ),
        },
      };
    });
  };

  const updateLessonDetails = (
    productId: string,
    moduleId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ) => {
    setCourses((prev) => {
      const currentCourse = prev[productId];
      if (!currentCourse) return prev;

      return {
        ...prev,
        [productId]: {
          ...currentCourse,
          modules: currentCourse.modules.map((mod) =>
            mod.id === moduleId
              ? {
                  ...mod,
                  lessons: mod.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
                }
              : mod
          ),
        },
      };
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        courses,
        updateProductImage,
        updateProductDetails,
        resetProducts,
        uploadProductResource,
        updateResourceStatus,
        addModule,
        addLesson,
        updateLessonStatus,
        updateLessonDetails,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
