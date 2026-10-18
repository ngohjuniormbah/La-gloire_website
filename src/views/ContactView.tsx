import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { t, settings, language, setActivePage, addContactMessage } = useApp();

  // Contact message state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subjectIndex, setSubjectIndex] = useState(0);
  const subject = t.contact.subjectOptions[subjectIndex] ?? t.contact.subjectOptions[0];
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSendError(false);
    try {
      await addContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject || 'Message de Contact',
        message: message.trim()
      });
    } catch {
      setSendError(true);
      return;
    }
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="space-y-16 py-8 pb-20 text-slate-800 bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-white py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1C295E]">
            {t.contact.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-scripture italic">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Contact Cards Grid (Cool, Professional & Simple) */}
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Headquarters */}
          {(settings.address || settings.cityCountry) && (
          <div className="bg-slate-50/70 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1C295E] shadow-xs flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1C295E]" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#1C295E]">
              {t.contact.headquarters}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.address}
              <br />
              {settings.cityCountry}
            </p>
          </div>

          
          )}

          {/* Phone */}
          {settings.prayerLine && (
          <div className="bg-slate-50/70 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1C295E] shadow-xs flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#1C295E]" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#1C295E]">
              {language === 'fr' ? 'Ligne Téléphonique' : 'Pastoral Phone'}
            </h3>
            <p className="text-xs font-bold text-slate-800">
              {settings.prayerLine}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'fr' ? 'Écoute pastorale & prière' : 'Pastoral care & intercession'}
            </p>
          </div>

          
          )}

          {/* Email */}
          {settings.email && (
          <div className="bg-slate-50/70 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1C295E] shadow-xs flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#1C295E]" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#1C295E]">
              {language === 'fr' ? 'Courriel & Secrétariat' : 'Email & Office'}
            </h3>
            <p className="text-xs font-semibold text-slate-800 break-all">
              {settings.email}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'fr' ? 'Réponse sous 24 à 48 heures' : 'Response within 24 to 48 hours'}
            </p>
          </div>

          
          )}

          {/* Gatherings */}
          <div className="bg-slate-50/70 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1C295E] shadow-xs flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#1C295E]" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#1C295E]">
              {t.contact.servicesTitle}
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>{language === 'fr' ? 'Dimanche :' : 'Sunday:'}</strong> {language === 'fr' ? '09h00 – 12h00' : '9:00 AM – 12:00 PM'}</p>
              <p><strong>{language === 'fr' ? 'Mercredi :' : 'Wednesday:'}</strong> {language === 'fr' ? '18h00 – 19h30' : '6:00 PM – 7:30 PM'}</p>
              <p><strong>{language === 'fr' ? 'Vendredi :' : 'Friday:'}</strong> {language === 'fr' ? '21h00 – 00h00' : '9:00 PM – 12:00 AM'}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Send Message Form (Simple, Professional, Centered Button) */}
      <section className="bg-white max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          
          <div className="text-center space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {t.contact.formTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {language === 'fr'
                ? 'Laissez-nous votre message. Notre équipe vous répondra avec soin et discrétion.'
                : 'Send us your message. Our team will respond with care and discretion.'}
            </p>
          </div>

          {sent ? (
            <div className="p-5 bg-slate-50 text-[#1C295E] rounded-xl text-xs flex items-center justify-center gap-2 text-center max-w-lg mx-auto">
              <CheckCircle2 className="w-5 h-5 text-[#1C295E] shrink-0" />
              <span>{t.contact.sentSuccess}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-4 max-w-xl mx-auto pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contact.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'fr' ? 'Ex: Emmanuel Mbah' : 'E.g., John Doe'}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contact.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.contact.subject}
                </label>
                <select
                  value={subjectIndex}
                  onChange={(e) => setSubjectIndex(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                >
                  {t.contact.subjectOptions.map((opt, i) => (
                    <option key={i} value={i}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.contact.message} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'fr' ? 'Écrivez votre message ici...' : 'Write your message here...'}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                />
              </div>

              {/* Centered Translucent Button */}
              <div className="flex flex-col items-center gap-3 pt-2">
                {sendError && (
                  <p role="alert" className="text-xs text-[#1C295E] text-center font-medium">
                    {language === 'fr' ? "L'envoi a échoué. Veuillez réessayer." : 'Sending failed. Please try again.'}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn-translucent-hero px-10 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contact.sendBtn}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* 4. Centered Navigation Footer Links */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('who-we-are')}
            className="btn-translucent-hero px-6 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {t.nav.whoWeAre}
          </button>
          <button
            onClick={() => setActivePage('donate')}
            className="btn-translucent-hero px-6 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {t.nav.donateNowBtn}
          </button>
          <button
            onClick={() => setActivePage('membership')}
            className="btn-translucent-hero px-6 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {t.nav.membership}
          </button>
        </div>
      </section>

    </div>
  );
};
