import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Testimonial } from '../types';
import { supabase } from '../services/supabaseClient';

interface TestimonialContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'date'>) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  toggleApproval: (id: string) => void;
  resetTestimonials: () => void;
}

// Données de secours si la base de données n'est pas connectée
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sophie M.',
    role: 'Paris 15ème',
    text: "J'ai économisé 450€ un dimanche soir. Le guide vidéo sur la radio est incroyable, porte ouverte en 3 minutes !",
    rating: 5,
    approved: true,
    date: '2023-11-01',
    source: 'trustpilot',
  },
  {
    id: 't2',
    name: 'Karim B.',
    role: 'Lyon',
    text: "Sceptique au début, mais la méthode du kit de survie fonctionne. Merci pour l'honnêteté.",
    rating: 5,
    approved: true,
    date: '2023-11-05',
    source: 'google',
  },
  {
    id: 't3',
    name: 'Julie D.',
    role: 'Marseille',
    text: "Le support WhatsApp m'a sauvé. J'étais paniquée, Thomas m'a calmée et guidée.",
    rating: 4,
    approved: true,
    date: '2023-10-20',
    source: 'email',
  },
];

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);

  // Fetch from DB
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err: any) {
        console.warn(
          'Info: Utilisation des témoignages locaux (DB non connectée).',
          err.message || err
        );
        // On garde MOCK_TESTIMONIALS
      }
    };

    fetchTestimonials();
  }, []);

  const addTestimonial = async (data: Omit<Testimonial, 'id' | 'date'>) => {
    // 1. Optimistic UI update (Ajout local immédiat pour l'utilisateur)
    const optimisticId = 'temp_' + Date.now();
    const newT: Testimonial = {
      ...data,
      id: optimisticId,
      date: new Date().toISOString(),
      approved: false, // IMPORTANT: Toujours faux par défaut pour modération
    };

    // On ajoute au début de la liste localement
    setTestimonials((prev) => [newT, ...prev]);

    try {
      // 2. Insert into Supabase
      const { data: newRow, error } = await supabase
        .from('testimonials')
        .insert([
          {
            name: data.name,
            role: data.role,
            text: data.text,
            rating: data.rating,
            approved: false,
            source: data.source,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (newRow) {
        // 3. Replace temp with real data from DB
        setTestimonials((prev) => prev.map((t) => (t.id === optimisticId ? newRow : t)));
      }
    } catch (e) {
      console.error('Error adding testimonial to DB', e);
      // Optionnel: Rollback si erreur critique, mais pour un avis ce n'est pas bloquant
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await supabase.from('testimonials').update(updates).eq('id', id);
    } catch (e) {
      console.error('Error update', e);
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await supabase.from('testimonials').delete().eq('id', id);
    } catch (e) {
      console.error('Error delete', e);
    }
  };

  const toggleApproval = async (id: string) => {
    const current = testimonials.find((t) => t.id === id);
    if (!current) return;
    const newStatus = !current.approved;

    // Optimistic Update
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, approved: newStatus } : t)));

    try {
      await supabase.from('testimonials').update({ approved: newStatus }).eq('id', id);
    } catch (e) {
      console.error('Error toggling approval', e);
      // Rollback
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, approved: !newStatus } : t))
      );
    }
  };

  const resetTestimonials = () => {
    setTestimonials(MOCK_TESTIMONIALS);
  };

  return (
    <TestimonialContext.Provider
      value={{
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleApproval,
        resetTestimonials,
      }}
    >
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (context === undefined) {
    throw new Error('useTestimonials must be used within a TestimonialProvider');
  }
  return context;
};
