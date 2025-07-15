import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      <span className="font-semibold">
        {language === 'en' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;