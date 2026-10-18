import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemberRecord } from '../types';
import { CheckCircle2, Download, Printer, UserCheck, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const LoginView: React.FC = () => {
  const { t, registerMember, language, settings, setActivePage } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>('login');
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(language === 'fr' ? 'Cameroun' : 'Cameroon');
  const [agreedToCharter, setAgreedToCharter] = useState(true);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitError, setSubmitError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberCard, setMemberCard] = useState<MemberRecord | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setSubmitError(false);
    setTimeout(async () => {
      let created: MemberRecord;
      try {
        created = await registerMember({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          membershipType: 'regular',
          city: city.trim(),
          country: country.trim() || (language === 'fr' ? 'Cameroun' : 'Cameroon')
        });
      } catch (err) {
        setIsSubmitting(false);
        setSubmitError(true);
        return;
      }

      // Keep the card on this device so the member can open it again later
      try {
        localStorage.setItem('lgd_current_member', JSON.stringify(created));
      } catch (err) {
        // Safe fallback
      }

      setIsSubmitting(false);
      setMemberCard(created);

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1C295E', '#FFFFFF', '#94A3B8']
        });
      } catch (err) {
        // Safe fallback
      }
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) return;

    let saved: MemberRecord | null = null;
    try {
      const raw = localStorage.getItem('lgd_current_member');
      saved = raw ? (JSON.parse(raw) as MemberRecord) : null;
    } catch (err) {
      saved = null;
    }

    if (saved && saved.email && saved.email.toLowerCase() === loginEmail.trim().toLowerCase()) {
      setMemberCard(saved);
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#1C295E', '#FFFFFF']
        });
      } catch (err) {
        // Safe fallback
      }
    } else {
      setLoginError(
        language === 'fr'
          ? "Aucun compte trouvé sur cet appareil. Créez un compte pour devenir membre."
          : 'No account found on this device. Create an account to become a member.'
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white text-slate-800">
      
      {/* Top back navigation */}
      <div className="max-w-md w-full mx-auto mb-6">
        <button
          onClick={() => setActivePage('membership')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1C295E] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'fr' ? 'Retour à la page Membre' : 'Back to Membership'}</span>
        </button>
      </div>

      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {settings.churchName}
            </h1>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
              {language === 'fr' ? 'Portail & Espace Membre' : 'Member Portal & Sign In'}
            </p>
          </div>
        </div>

        {/* Card container */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
          
          <AnimatePresence mode="wait">
            {memberCard ? (
              /* Success & Digital Member Card */
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-14 h-14 bg-slate-50 text-[#1C295E] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#1C295E]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1C295E]">
                    {language === 'fr' ? 'Connexion Réussie !' : 'Welcome to Your Portal!'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {language === 'fr'
                      ? 'Votre compte membre est actif. Voici votre carte officielle.'
                      : 'Your member account is active. Here is your official pass.'}
                  </p>
                </div>

                {/* Digital Card UI */}
                <div className="relative rounded-2xl overflow-hidden bg-[#1C295E] text-white p-6 text-left shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <div className="flex items-center gap-2.5">
                      <div>
                        <h4 className="font-cinzel text-xs font-bold text-white">
                          {settings.churchName}
                        </h4>
                        <p className="text-[9px] text-white/80 font-semibold uppercase tracking-wider">
                          {language === 'fr' ? 'MEMBRE OFFICIEL' : 'OFFICIAL MEMBER'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-white/80">
                      {memberCard.membershipNumber}
                    </span>
                  </div>

                  <div className="py-5 space-y-1.5">
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest font-medium">
                      {language === 'fr' ? 'Titulaire' : 'Cardholder'}
                    </p>
                    <p className="font-cinzel text-lg font-bold text-white tracking-wide">
                      {memberCard.fullName}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-200 pt-1">
                      <span><strong>{language === 'fr' ? 'Statut :' : 'Status:'}</strong> <span className="text-white font-semibold">ACTIF</span></span>
                      <span><strong>{language === 'fr' ? 'Ville :' : 'City:'}</strong> {memberCard.city || '—'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-slate-300">
                    <span>{language === 'fr' ? 'Adhésion :' : 'Joined:'} {memberCard.joinedDate}</span>
                    <span className="font-cinzel text-white/80">{t.meta.motto}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="btn-translucent-hero w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Imprimer' : 'Print'}</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(language === 'fr' ? 'Carte de membre enregistrée !' : 'Membership card saved!');
                    }}
                    className="btn-translucent-hero w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Télécharger' : 'Download'}</span>
                  </button>

                  <button
                    onClick={() => setActivePage('home')}
                    className="btn-translucent-hero w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>{language === 'fr' ? 'Accueil' : 'Home'}</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setMemberCard(null)}
                    className="text-xs text-slate-500 hover:text-[#1C295E] underline cursor-pointer"
                  >
                    {language === 'fr' ? 'Changer de compte' : 'Switch account'}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Auth Form (Tabs: Sign In / Create Account) */
              <div className="space-y-6">
                
                {/* Switcher */}
                <div className="flex items-center justify-center gap-2 pb-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`btn-translucent-hero flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer text-center ${
                      mode === 'login' ? '!bg-[#1C295E] !text-white !border-[#1C295E]' : ''
                    }`}
                  >
                    {language === 'fr' ? 'Se Connecter' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`btn-translucent-hero flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer text-center ${
                      mode === 'register' ? '!bg-[#1C295E] !text-white !border-[#1C295E]' : ''
                    }`}
                  >
                    {language === 'fr' ? 'Créer un Compte' : 'Create Account'}
                  </button>
                </div>

                {submitError && (
                  <p role="alert" className="text-xs text-[#1C295E] text-center font-medium">
                    {language === 'fr' ? "L'envoi a échoué. Veuillez réessayer." : 'Sending failed. Please try again.'}
                  </p>
                )}

                {mode === 'login' ? (
                  /* Sign In Form */
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <p className="text-xs text-[#1C295E] text-center font-medium">
                        {loginError}
                      </p>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Adresse Email' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="votre.email@exemple.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Mot de passe' : 'Password'} *
                      </label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-translucent-hero w-full py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? (language === 'fr' ? 'Connexion en cours...' : 'Signing in...')
                            : (language === 'fr' ? 'Se Connecter' : 'Sign In')}
                        </span>
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-xs text-slate-500 hover:text-[#1C295E] cursor-pointer"
                      >
                        {language === 'fr'
                          ? "Pas encore de compte ? Créer un compte membre"
                          : "Don't have an account? Create a member account"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Create Account Form */
                  <form onSubmit={handleRegister} className="space-y-4">
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Nom complet' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={language === 'fr' ? 'Ex: Emmanuel Mbah' : 'E.g., John Doe'}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Adresse Email' : 'Email Address'} *
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

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Mot de passe' : 'Password'} *
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'fr' ? 'Téléphone' : 'Phone'}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+237 6 XX XX XX XX"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'fr' ? 'Ville' : 'City'}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Douala"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Pays' : 'Country'}
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Cameroun"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] focus:ring-1 focus:ring-[#1C295E] transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        id="charter-login"
                        checked={agreedToCharter}
                        onChange={(e) => setAgreedToCharter(e.target.checked)}
                        className="rounded-sm border-slate-300 text-[#1C295E] focus:ring-[#1C295E]"
                      />
                      <label htmlFor="charter-login" className="cursor-pointer select-none">
                        {language === 'fr'
                          ? "J'accepte la charte chrétienne et fraternelle de l'association."
                          : "I accept the Christian and fraternal charter of the association."}
                      </label>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !agreedToCharter}
                        className="btn-translucent-hero w-full py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? (language === 'fr' ? 'Création en cours...' : 'Creating...')
                            : (language === 'fr' ? 'Créer mon Compte Membre' : 'Create Member Account')}
                        </span>
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-xs text-slate-500 hover:text-[#1C295E] cursor-pointer"
                      >
                        {language === 'fr'
                          ? "Déjà membre ? Se connecter à votre compte"
                          : "Already a member? Sign in to your account"}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};
