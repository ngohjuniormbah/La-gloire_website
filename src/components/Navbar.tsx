import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageToggle } from './LanguageToggle';

export const Navbar: React.FC = () => {
  const { language, activePage, setActivePage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(!(currentScrollY > 60 && currentScrollY > lastScrollY));
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'who-we-are', label: t.nav.whoWeAre },
    { id: 'follow-us', label: t.nav.followUs },
    { id: 'donate', label: t.nav.donate },
    { id: 'membership', label: t.nav.membership },
    { id: 'contact', label: t.nav.contact }
  ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-100 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 xl:gap-4">
          {/* Brand emblem */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left shrink-0 cursor-pointer flex items-center gap-2"
            aria-label={t.nav.home}
          >
            <img src="/la-gloire-de-dieu-logo.webp" alt="La Gloire de Dieu" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover" />
            <span className="font-cinzel text-sm sm:text-base font-bold tracking-tight whitespace-nowrap text-[#1C295E]">
              La Gloire de Dieu
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 shrink-0">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-2.5 py-1.5 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    isActive ? 'text-[#1C295E] font-semibold' : 'text-slate-600 hover:text-[#1C295E]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#1C295E]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right zone: language toggle, member portal, mobile menu */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => handleNavClick('login')}
              className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activePage === 'login' ? '!bg-[#1C295E] !text-white' : 'btn-translucent-hero'
              }`}
            >
              <span>{language === 'fr' ? 'Espace Membre' : 'Member Portal'}</span>
            </button>

            <LanguageToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 cursor-pointer"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (language === 'fr' ? 'Fermer' : 'Close') : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t px-4 pt-3 pb-5 space-y-2 bg-white text-slate-800 border-slate-100 overflow-hidden"
          >
            {/* Mobile language switch inside drawer */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'fr' ? 'Langue' : 'Language'}
              </span>
              <LanguageToggle />
            </div>

            {[...navLinks, { id: 'login' as PageId, label: language === 'fr' ? 'Espace Membre' : 'Member Portal' }].map(
              (link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full px-3 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer rounded-lg ${
                    activePage === link.id ? 'bg-slate-50 text-[#1C295E] font-semibold' : 'text-slate-700'
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
