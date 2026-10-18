import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

const OPTIONS: { id: Language; label: string; name: string }[] = [
  { id: 'fr', label: 'FR', name: 'Français' },
  { id: 'en', label: 'EN', name: 'English' }
];

/** Two-state FR / EN switch used on the public site and in the admin. */
export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useApp();

  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className={`inline-flex rounded-lg border border-slate-300 overflow-hidden text-xs font-semibold ${className}`}
    >
      {OPTIONS.map((opt) => {
        const active = language === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLanguage(opt.id)}
            aria-pressed={active}
            title={opt.name}
            className={`px-3 py-1.5 cursor-pointer transition-colors ${
              active ? 'bg-[#1C295E] text-white' : 'bg-white text-slate-600 hover:text-[#1C295E]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
