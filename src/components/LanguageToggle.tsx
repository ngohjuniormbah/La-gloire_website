import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, toggleLanguage } = useApp();

  const handleSelect = (e: React.MouseEvent, target: Language) => {
    e.preventDefault();
    e.stopPropagation();
    if (target === language) {
      toggleLanguage();
    } else {
      setLanguage(target);
    }
  };

  return (
    <div
      role="group"
      translate="no"
      aria-label="Langue / Language"
      className={`notranslate inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs font-semibold shadow-xs select-none ${className}`}
    >
      <button
        type="button"
        onClick={(e) => handleSelect(e, 'fr')}
        aria-pressed={language === 'fr'}
        title="Passer en Français"
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold notranslate ${
          language === 'fr'
            ? '!bg-[#1C295E] !text-white shadow-xs'
            : '!bg-transparent !text-slate-600 hover:!text-[#1C295E]'
        }`}
      >
        FR
      </button>

      <button
        type="button"
        onClick={(e) => handleSelect(e, 'en')}
        aria-pressed={language === 'en'}
        title="Switch to English"
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold notranslate ${
          language === 'en'
            ? '!bg-[#1C295E] !text-white shadow-xs'
            : '!bg-transparent !text-slate-600 hover:!text-[#1C295E]'
        }`}
      >
        EN
      </button>
    </div>
  );
};
