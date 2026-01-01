import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  logo: string | null;
  heroImage: string | null;
  updateLogo: (newLogo: string) => void;
  updateHeroImage: (newImage: string) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('serrure_master_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.logo) setLogo(parsed.logo);
        if (parsed.heroImage) setHeroImage(parsed.heroImage);
      } catch (e) {
        console.error('Erreur chargement paramètres', e);
      }
    }
  }, []);

  const saveSettings = (newSettings: any) => {
    localStorage.setItem('serrure_master_settings', JSON.stringify(newSettings));
  };

  const updateLogo = (newLogo: string) => {
    setLogo(newLogo);
    saveSettings({ logo: newLogo, heroImage });
  };

  const updateHeroImage = (newImage: string) => {
    setHeroImage(newImage);
    saveSettings({ logo, heroImage: newImage });
  };

  const resetSettings = () => {
    setLogo(null);
    setHeroImage(null);
    localStorage.removeItem('serrure_master_settings');
  };

  return (
    <SettingsContext.Provider
      value={{ logo, heroImage, updateLogo, updateHeroImage, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
