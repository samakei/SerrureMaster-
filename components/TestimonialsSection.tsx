import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTestimonials } from '../contexts/TestimonialContext';

export const TestimonialsSection = () => {
  const { testimonials } = useTestimonials();
  // Filter approved and take only first 3
  const visibleTestimonials = testimonials.filter((t) => t.approved).slice(0, 3);

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Ils ont ouvert leur porte seuls</h2>
          <p className="text-slate-300 mt-4">
            Plus de 5000 clients satisfaits. Voici leurs retours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTestimonials.map((t) => (
            <div key={t.id} className="bg-slate-800 rounded-2xl p-8 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-700 opacity-50" />

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < t.rating ? 'fill-orange-500 text-orange-500' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-slate-300 mb-6 italic min-h-[80px]">"{t.text}"</p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm text-slate-300">
                  {t.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-bold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
