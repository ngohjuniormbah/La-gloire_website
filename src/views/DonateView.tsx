import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonationRecord } from '../types';
import { CheckCircle2, Heart, Printer, RefreshCw, Send, PhoneCall, Mail, MapPin } from 'lucide-react';

export const DonateView: React.FC = () => {
  const {
    campaigns,
    processDonation,
    language,
    setActivePage
  } = useApp();

  // Contact & Donation details state (no currency, no payment method selector)
  const [donorName, setDonorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('Cameroun');
  const [campaignId, setCampaignId] = useState<string>('general');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<DonationRecord | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setSubmitError(false);

    const selectedCampaignObj = campaigns.find(c => c.id === campaignId);
    const campaignTitle = selectedCampaignObj
      ? (language === 'fr' ? selectedCampaignObj.titleFr : selectedCampaignObj.titleEn)
      : (language === 'fr' ? 'Fonds Général & Prédication de la Parole' : 'General Fund & Gospel Preaching');

    setTimeout(async () => {
      try {
      const record = await processDonation({
        donorName: isAnonymous ? (language === 'fr' ? 'Donateur Anonyme' : 'Anonymous Donor') : donorName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        amount: 0,
        currency: 'XAF',
        paymentMethod: 'direct_contact',
        campaignId,
        campaignTitle,
        isAnonymous,
        message: donorMessage.trim() || undefined
      });

      setIsSubmitting(false);
      setCompletedDonation(record);
      } catch {
        setIsSubmitting(false);
        setSubmitError(true);
      }
    }, 600);
  };

  return (
    <div className="space-y-16 py-8 pb-24 text-slate-800 bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-white py-12 lg:py-16 text-center space-y-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
            {language === 'fr' ? 'Soutien Spirituel & Solidarité Chrétienne' : 'Spiritual Support & Christian Solidarity'}
          </p>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1C295E]">
            {language === 'fr' ? 'Faire un Don' : 'Make a Donation'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto italic font-scripture">
            {language === 'fr'
              ? "« Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie. » — 2 Corinthiens 9:7"
              : "“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7"}
          </p>
        </div>
      </section>

      {/* 2. Blocks of Paragraphs: Why it is important & What donations are for */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Why it is important to make a donation */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
            {language === 'fr'
              ? 'Pourquoi votre offrande est essentielle'
              : 'Why Your Giving is Essential'}
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            <p>
              {language === 'fr'
                ? "Dans les Saintes Écritures, la générosité chrétienne n'est pas considérée comme une simple transaction financière, mais comme un acte d'adoration, une réponse de reconnaissance envers l'amour incommensurable de Dieu manifesté en Jésus-Christ. Donner, c'est participer directement à l'avancement du Royaume céleste, en devenant les mains et les pieds du Seigneur sur cette terre pour soulager les peines et proclamer l'espérance de la résurrection."
                : "Throughout Holy Scripture, Christian giving is never seen as a mere financial transaction, but as an act of worship and a joyful response of gratitude for God's boundless love in Jesus Christ. To give is to participate directly in the expansion of God's Kingdom, serving as His hands and feet on earth to comfort the brokenhearted and proclaim the living hope of the Gospel."}
            </p>
            <p>
              {language === 'fr'
                ? "Nombreuses sont les communautés de croyants qui affrontent l'épreuve dans la plus grande détresse : persécutions violentes, isolement géographique, précarité extrême ou manque cruel d'enseignements solides. Votre soutien financier permet d'abattre ces barrières et d'assurer que la lumière de la Parole de Dieu ne s'éteigne jamais dans les régions les plus vulnérables."
                : "Across the world, countless Christian assemblies endure severe hardship: persecution, extreme poverty, geographical isolation, and an acute lack of sound biblical resources. Your giving tears down these barriers, ensuring that the light of God's Word burns brightly even in the most vulnerable regions."}
            </p>
          </div>
        </div>

        {/* What the donations are for */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
            {language === 'fr'
              ? 'À quoi sont concrètement consacrés vos dons'
              : 'What Your Contributions Accomplish'}
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            <p>
              {language === 'fr'
                ? "Chaque don que nous recevons est rigoureusement alloué aux œuvres prioritaires du ministère, guidées par la prière et la volonté du Seigneur :"
                : "Every donation entrusted to our care is dedicated strictly to gospel priorities, directed by prayer and pastoral vigilance:"}
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? '1. La Prédication de la Parole et la Diffusion des Bibles' : '1. Preaching the Word and Bible Distribution'}
                </h3>
                <p>
                  {language === 'fr'
                    ? "Financement de campagnes d'évangélisation, impression et distribution gratuite de Bibles complètes en langues locales pour des milliers d'âmes en soif de vérité, et formation théologique de pasteurs dévoués."
                    : "Funding evangelistic campaigns, printing and freely distributing complete Bibles in native languages, and equipping pioneer pastors through theological training."}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? '2. Le Secours Alimentaire et Médical d’Urgence' : '2. Emergency Food and Medical Relief'}
                </h3>
                <p>
                  {language === 'fr'
                    ? "Acheminement direct de denrées alimentaires vitales, de kits d'hygiène et de soins d'urgence aux familles chrétiennes déplacées, aux veuves et aux frères persécutés pour leur foi."
                    : "Direct distribution of vital food staples, hygiene supplies, and urgent medical assistance to displaced Christian families, widows, and believers facing persecution."}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? '3. La Construction de Sanctuaires et les Forages d’Eau Potable' : '3. Building Sanctuaries and Clean Water Wells'}
                </h3>
                <p>
                  {language === 'fr'
                    ? "Érection de lieux de culte solides pour que les fidèles puissent se réunir en paix et en sécurité pour adorer Dieu, accompagnés de forages d'eau potable durables offerts gratuitement aux populations voisines."
                    : "Constructing durable sanctuaries where believers can worship safely in peace, combined with solar freshwater boreholes provided freely to neighboring communities."}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? '4. Le Parrainage Holistique des Orphelins' : '4. Orphan Sponsorship and Care'}
                </h3>
                <p>
                  {language === 'fr'
                    ? "Prise en charge intégrale des frais de scolarité, des repas quotidiens, des soins de santé et du suivi spirituel des enfants orphelins confiés à nos églises partenaires."
                    : "Covering full school tuition, balanced nutrition, medical care, and spiritual mentorship for orphans cared for by partner Christian churches."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical commitment */}
        <div className="space-y-3 pt-2">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
            {language === 'fr'
              ? 'Notre engagement de rigueur et de transparence'
              : 'Our Commitment to Integrity and Stewardship'}
          </h2>
          <div className="space-y-3 text-base sm:text-lg text-slate-700 leading-relaxed">
            <p>
              {language === 'fr'
                ? "L'association 'La Gloire de Dieu' s'engage à administrer chaque offrande dans la crainte de Dieu et la transparence la plus totale. Plus de 85% de nos ressources sont directement investies sur le terrain. Nos comptes font l'objet d'un suivi comptable rigoureux et des rapports réguliers documentent l'avancée concrète de chaque mission."
                : "The 'La Gloire de Dieu' association commits to managing every contribution in the fear of God and with complete accountability. Over 85% of our resources directly reach frontline field projects, verified through rigorous bookkeeping and regular published mission reports."}
            </p>
          </div>
        </div>

      </section>

      {/* 3. Clean, Professional Donation Contact Form */}
      <section className="bg-white max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="space-y-6">
          
          <div className="text-center space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Formulaire de Don & Prise de Contact' : 'Donation Details & Contact Form'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Remplissez simplement vos informations ci-dessous. Dès réception de votre message, notre équipe vous contactera directement avec les coordonnées précises pour finaliser votre don en toute sécurité.'
                : 'Simply leave your details below. Once we receive your message, our team will promptly reach out to you with the exact details to complete your donation safely.'}
            </p>
          </div>

          {completedDonation ? (
            
            /* Success confirmation */
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 bg-slate-50 text-[#1C295E] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
                  {language === 'fr' ? 'Message Reçu avec Gratitude' : 'Message Received with Gratitude'}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
                  {language === 'fr'
                    ? `Merci infiniment ${completedDonation.donorName}. Votre demande a été enregistrée avec la référence ${completedDonation.receiptNumber}. Notre équipe vous contactera très rapidement avec les détails pour la réalisation de votre don.`
                    : `Thank you warmly ${completedDonation.donorName}. Your inquiry has been registered under reference ${completedDonation.receiptNumber}. Our team will contact you shortly with the details to complete your gift.`}
                </p>
              </div>

              {/* Summary box */}
              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 text-left text-xs sm:text-sm text-slate-700 space-y-2 border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{language === 'fr' ? 'Référence :' : 'Reference:'}</span>
                  <span className="font-mono font-bold text-[#1C295E]">{completedDonation.receiptNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{language === 'fr' ? 'Nom :' : 'Name:'}</span>
                  <span className="font-medium text-slate-900">{completedDonation.donorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{language === 'fr' ? 'Email :' : 'Email:'}</span>
                  <span className="font-medium text-slate-900">{completedDonation.email}</span>
                </div>
                {completedDonation.phone && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">{language === 'fr' ? 'Téléphone :' : 'Phone:'}</span>
                    <span className="font-medium text-slate-900">{completedDonation.phone}</span>
                  </div>
                )}
                {completedDonation.city && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">{language === 'fr' ? 'Localisation :' : 'Location:'}</span>
                    <span className="font-medium text-slate-900">{completedDonation.city}, {completedDonation.country}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{language === 'fr' ? 'Affectation :' : 'Designation:'}</span>
                  <span className="font-medium text-slate-900">{completedDonation.campaignTitle}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-translucent-hero px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Imprimer le Récapitulatif' : 'Print Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedDonation(null);
                    setDonorName('');
                    setEmail('');
                    setPhone('');
                    setCity('');
                    setDonorMessage('');
                  }}
                  className="btn-translucent-hero px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Nouvelle Demande de Don' : 'Submit Another Inquiry'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('home')}
                  className="btn-translucent-hero px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{language === 'fr' ? 'Retour à l’Accueil' : 'Return Home'}</span>
                </button>
              </div>
            </div>

          ) : (

            /* The clean form with no currency and no payment method */
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'fr' ? 'Nom et Prénom' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'fr' ? 'Adresse Email' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E]"
                  />
                </div>
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'fr' ? 'Téléphone (WhatsApp / Appel)' : 'Phone (WhatsApp / Call)'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'fr' ? 'Ville' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Yaoundé / Douala"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'fr' ? 'Pays de résidence' : 'Country'}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Cameroun"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E]"
                  />
                </div>
              </div>

              {/* Destination / Campaign */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {language === 'fr' ? 'Projet ou œuvre que vous souhaitez soutenir' : 'Project or Mission you wish to support'}
                </label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E] cursor-pointer"
                >
                  <option value="general">
                    {language === 'fr' ? 'Fonds Général & Prédication de l’Évangile' : 'General Kingdom Fund & Gospel Preaching'}
                  </option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'fr' ? c.titleFr : c.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional message or note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {language === 'fr' ? 'Message, précisions ou sujet de prière (optionnel)' : 'Message, notes or prayer intention (optional)'}
                </label>
                <textarea
                  rows={3}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  placeholder={language === 'fr' ? 'Précisez votre intention, disponibilité pour vous contacter, ou sujet de prière...' : 'Any details, best time to reach you, or prayer requests...'}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1C295E]"
                />
              </div>

              {/* Anonymous checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1C295E] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-slate-600 cursor-pointer">
                  {language === 'fr'
                    ? 'Garder mon don confidentiel lors des rapports généraux'
                    : 'Keep my donation confidential in general reports'}
                </label>
              </div>

              {/* Centered Submit Button */}
              <div className="pt-4 text-center space-y-3">
                {submitError && (
                  <p role="alert" className="text-sm text-[#1C295E]">
                    {language === 'fr' ? "L'envoi a échoué. Veuillez réessayer." : 'Sending failed. Please try again.'}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-translucent-hero w-full sm:w-auto px-10 py-3.5 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (language === 'fr' ? 'Transmission en cours...' : 'Sending details...')
                      : (language === 'fr' ? 'Transmettre mes Coordonnées pour le Don' : 'Submit My Details for the Donation')}
                  </span>
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

    </div>
  );
};
