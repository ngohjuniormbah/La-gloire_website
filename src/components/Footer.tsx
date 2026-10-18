import React from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';

export const Footer: React.FC = () => {
  const { setActivePage, settings, language } = useApp();

  const navTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C295E] text-white pt-16 pb-12 border-t border-[#2A3B7D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid (Logical, Professional, Simple) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Identity & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/la-gloire-de-dieu-logo.webp" alt="La Gloire de Dieu" className="h-14 w-14 rounded-full object-cover border border-white/30" />
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  La Gloire de Dieu
                </h3>
                <p className="text-[11px] text-white/70 font-medium tracking-wider uppercase">
                  {language === 'fr' ? 'Foi • Vérité • Amour • Solidarité' : 'Faith • Truth • Love • Solidarity'}
                </p>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
              {language === 'fr'
                ? "Organisation chrétienne évangélique vouée à la proclamation fidèle des Saintes Écritures, à l'édification spirituelle des croyants et à la solidarité envers les communautés dans le besoin."
                : "A Bible-grounded Christian organization dedicated to faithfully proclaiming the Scriptures, nurturing believers, and extending compassionate relief to communities in hardship."}
            </p>

            <p className="text-xs text-white/60 italic">
              {language === 'fr'
                ? "« À Dieu seul soit la gloire, aux siècles des siècles. »"
                : "“To God alone be the glory forever and ever.”"}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm font-cinzel uppercase tracking-wider">
              {language === 'fr' ? 'Navigation' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <button
                  onClick={() => navTo('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {language === 'fr' ? 'Accueil' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navTo('who-we-are')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {language === 'fr' ? 'Qui Sommes-Nous' : 'Who We Are'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navTo('follow-us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {language === 'fr' ? 'Nous Suivre (Médias)' : 'Follow Us (Media)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navTo('donate')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {language === 'fr' ? 'Faire un Don' : 'Make a Donation'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navTo('membership')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {language === 'fr' ? 'Devenir Membre' : 'Become a Member'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {language === 'fr' ? 'Contactez-Nous' : 'Contact Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Weekly Worship Services */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm font-cinzel uppercase tracking-wider">
              {language === 'fr' ? 'Cultes & Réunions' : 'Weekly Services'}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <div>
                <p className="font-semibold text-white">
                  {language === 'fr' ? 'Culte Dominical' : 'Sunday Worship'}
                </p>
                <p className="text-white/70">
                  {language === 'fr' ? 'Dimanche : 09h00 – 12h00' : 'Sunday: 9:00 AM – 12:00 PM'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {language === 'fr' ? 'Étude Biblique & Enseignement' : 'Bible Study & Discipleship'}
                </p>
                <p className="text-white/70">
                  {language === 'fr' ? 'Mercredi : 18h00 – 19h30' : 'Wednesday: 6:00 PM – 7:30 PM'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {language === 'fr' ? 'Veillée de Prière & Intercession' : 'Prayer & Intercession Vigil'}
                </p>
                <p className="text-white/70">
                  {language === 'fr' ? 'Vendredi : 21h00 – 00h00' : 'Friday: 9:00 PM – 12:00 AM'}
                </p>
              </div>
            </ul>
          </div>

          {/* Col 4: Official Secretariat & Location */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm font-cinzel uppercase tracking-wider">
              {language === 'fr' ? 'Secrétariat & Siège' : 'Office & Secretariat'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {(settings.address || settings.cityCountry) && (
                <li>
                  <span className="block text-white/60 text-xs">
                    {language === 'fr' ? 'Adresse :' : 'Address:'}
                  </span>
                  <span className="text-white font-medium">
                    {[settings.address, settings.cityCountry].filter(Boolean).join(', ')}
                  </span>
                </li>
              )}
              {settings.phone && (
                <li>
                  <span className="block text-white/60 text-xs">
                    {language === 'fr' ? 'Ligne Pastorale & WhatsApp :' : 'Pastoral Line & WhatsApp:'}
                  </span>
                  <span className="text-white font-medium">
                    {settings.phone}
                  </span>
                </li>
              )}
              {settings.email && (
                <li>
                  <span className="block text-white/60 text-xs">
                    {language === 'fr' ? 'Courriel officiel :' : 'Official Email:'}
                  </span>
                  <span className="text-white font-medium">
                    {settings.email}
                  </span>
                </li>
              )}
              <li className="pt-2">
                <button
                  onClick={() => navTo('contact')}
                  className="inline-block text-xs font-semibold text-white hover:text-white/80 transition-colors underline cursor-pointer"
                >
                  {language === 'fr' ? 'Envoyer une demande ou intention de prière →' : 'Send a prayer or contact inquiry →'}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar (Clean, Dignified, Simple) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {settings.churchName}. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <div className="font-cinzel text-white/80 tracking-widest text-center text-xs">
            {language === 'fr' ? 'À Dieu Seul soit la Gloire • Soli Deo Gloria' : 'To God Alone be the Glory • Soli Deo Gloria'}
          </div>
          <button
            onClick={() => navTo('admin')}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-white/50 hover:text-white"
            title="Espace réservé à l'administration"
          >
            <span>{language === 'fr' ? 'Administration' : 'Admin'}</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
