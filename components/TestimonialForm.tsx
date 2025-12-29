import React, { useState } from 'react';
import { Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { useTestimonials } from '../contexts/TestimonialContext';
import { User } from '../types';

interface TestimonialFormProps {
  user: User;
  onClose: () => void;
}

export const TestimonialForm: React.FC<TestimonialFormProps> = ({ user, onClose }) => {
  const { addTestimonial } = useTestimonials();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [city, setCity] = useState(''); // Pour le champ "role" ex: "Paris 12ème"
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus('submitting');

    // Simulation d'un délai réseau pour l'UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      addTestimonial({
        name: user.name || 'Client',
        role: city || 'Client Vérifié',
        text: text,
        rating: rating,
        approved: false, // Important : Doit être validé par l'admin
        source: 'email', // Indique que cela vient de l'app
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Avis envoyé !</h3>
        <p className="text-slate-600 text-sm max-w-xs mx-auto">
          Merci pour votre retour. Votre témoignage sera publié sur la page d'accueil après
          validation par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Votre avis compte</h3>
        <p className="text-sm text-slate-500">
          Aidez les futurs utilisateurs à faire le bon choix.
        </p>
      </div>

      {/* Rating Stars */}
      <div className="flex justify-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`Attribuer ${star} étoile${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating ? 'fill-orange-500 text-orange-500' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Votre Ville / Quartier (Optionnel)
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex: Lyon 6ème, Bordeaux..."
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:border-orange-500 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="testimonial-text"
          className="block text-xs font-bold text-slate-700 uppercase mb-1"
        >
          Votre expérience
        </label>
        <textarea
          id="testimonial-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
          placeholder="Le guide m'a-t-il aidé ? La méthode était-elle claire ?"
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:border-orange-500 outline-none resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting' || !text.trim()}
        className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center transition-all ${
          status === 'submitting' || !text.trim()
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-slate-900 hover:bg-orange-600 shadow-lg'
        }`}
      >
        {status === 'submitting' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Envoyer mon avis
          </>
        )}
      </button>
    </form>
  );
};
