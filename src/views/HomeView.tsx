import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../assets/images';
import { CommunityMembers } from '../components/CommunityMembers';
import { Campaign } from '../types';
import { Star, ChevronLeft, ChevronRight, Send, CheckCircle2, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { t, setActivePage, campaigns, setSelectedCampaignForDonation, language, reviews, addReview, addContactMessage, gallery, settings } = useApp();

  // Background slideshow for global Christian support
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery slideshow state
  const [gallerySlide, setGallerySlide] = useState(0);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gallery.length < 2) return;
    const timer = setInterval(() => {
      setGallerySlide((prev) => (prev + 1) % gallery.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  // Keep the current slide valid when photos are added or removed
  const activeGallerySlide = gallery.length ? gallerySlide % gallery.length : 0;

  const handleDonateToCampaign = (campaign: Campaign) => {
    setSelectedCampaignForDonation(campaign);
    setActivePage('donate');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    setFormError(false);
    try {
      await addReview({
        name: revName.trim(),
        roleOrCity: revRole.trim() || undefined,
        rating: revRating,
        comment: revComment.trim()
      });
    } catch {
      setFormError(true);
      return;
    }
    setRevName('');
    setRevRole('');
    setRevComment('');
    setRevRating(5);
    setRevSuccess(true);
    setTimeout(() => {
      setRevSuccess(false);
      setShowReviewForm(false);
    }, 3500);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;
    setFormError(false);
    try {
      await addContactMessage({
        name: contactName.trim(),
        email: contactEmail.trim(),
        subject: contactSubject.trim(),
        message: contactMsg.trim()
      });
    } catch {
      setFormError(true);
      return;
    }
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMsg('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="space-y-20 pb-24 text-slate-800 bg-white">
      
      {/* HERO SECTION: WELCOME TO LA GLOIRE DE DIEU WITH 3 FADING BACKGROUND PHOTOS */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-900">
        
        {/* Slideshow: 3 background photos fading in and out */}
        <div className="absolute inset-0 z-0">
          {IMAGES.heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={typeof slide === "string" ? slide : slide.src}
                alt="Soutien aux communautés chrétiennes dans le monde"
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Clean dark overlay for text legibility */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Centered Hero Content (Clean, No Logo, No Icons, No Shadows) */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-white">
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {language === 'fr'
              ? "Bienvenue à La Gloire de Dieu"
              : "Welcome to La Gloire de Dieu"}
          </h1>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal">
            {language === 'fr'
              ? "Une association chrétienne engagée pour lever des fonds et apporter un secours direct, spirituel et matériel aux communautés chrétiennes démunies et persécutées dans le monde."
              : "A Christian association committed to raising funds and delivering tangible spiritual and humanitarian relief to vulnerable and persecuted Christian communities worldwide."}
          </p>

          {/* 2 CTA Buttons: Qui Sommes-Nous & Contact */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setActivePage('who-we-are')}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold text-white bg-[#1C295E] hover:bg-[#152048] transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Qui Sommes-Nous' : 'Who We Are'}
            </button>

            <button
              onClick={() => setActivePage('contact')}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-colors cursor-pointer backdrop-blur-xs"
            >
              {language === 'fr' ? 'Contact' : 'Contact Us'}
            </button>
          </div>

          {/* Slide Indicator Dots */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {IMAGES.heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION: QUI SOMMES-NOUS ? (PRÉSENTATION DE L'ASSOCIATION ET MINISTÈRES EN BLOCS DE PARAGRAPHES) */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Qui Sommes-Nous ?' : 'Who We Are'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {language === 'fr'
                ? 'Une organisation chrétienne dédiée à la prédication de la Parole et à la solidarité'
                : 'A Christian organization dedicated to preaching God’s Word and compassionate action'}
            </p>
          </div>

          {/* Clean, Simple Blocks of Paragraphs */}
          <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed">
            <p>
              {language === 'fr'
                ? "L'association 'La Gloire de Dieu' est une communauté chrétienne évangélique vouée corps et âme à prêcher la Parole vivante, inaltérable et souveraine de Dieu. Fondés sur la foi en notre Seigneur Jésus-Christ et conduits par le Saint-Esprit, nous proclamons le message du salut, de la vérité et de la grâce aux nations pour transformer les vies et enraciner les croyants dans la saine doctrine biblique."
                : "The 'La Gloire de Dieu' association is a Bible-believing Christian ministry wholeheartedly dedicated to preaching the living, unchanging Word of God. Grounded in faith in our Lord Jesus Christ and led by the Holy Spirit, we proclaim the Gospel of salvation, truth, and grace across the nations to transform lives and establish believers in sound biblical doctrine."}
            </p>

            <p>
              {language === 'fr'
                ? "Notre mission première est la proclamation inlassable des Saintes Écritures. Par l'organisation de campagnes d'évangélisation, la formation théologique approfondie de pasteurs et serviteurs de Dieu, et la distribution gratuite de Bibles complètes en langues locales, nous veillons à ce que la lumière de l'Évangile brille avec puissance dans les zones les plus isolées."
                : "Our central mission is the faithful proclamation of Holy Scripture. Through evangelistic crusades, thorough biblical training for pastors and Christian workers, and the free distribution of complete Bibles in native tongues, we ensure that the light of the Gospel shines brightly even in the most remote areas."}
            </p>

            <p>
              {language === 'fr'
                ? "Cette vocation spirituelle s'accompagne d'une solidarité active sans frontières. Nous apportons un secours d'urgence vital—denrées alimentaires, vêtements, soins médicaux et abris—aux communautés chrétiennes persécutées, aux réfugiés et aux familles éprouvées, manifestant ainsi de manière tangible la miséricorde vivante du Christ."
                : "This spiritual calling is matched by compassionate global solidarity. We provide vital emergency relief—nutritional supplies, clothing, urgent medical assistance, and shelter—to persecuted Christian communities, displaced refugees, and suffering families, demonstrating the living compassion of Christ."}
            </p>

            <p>
              {language === 'fr'
                ? "Enfin, nous bâtissons des sanctuaires solides où les fidèles peuvent s'assembler en paix pour louer et entendre la Parole, nous forons des puits d'eau potable durables offerts gratuitement aux populations avoisinantes, et nous prenons en charge de manière holistique les orphelins (scolarité, repas, santé et suivi spirituel) pour leur offrir une espérance certaine en Jésus-Christ."
                : "Furthermore, we construct sturdy sanctuaries where believers gather peacefully to worship, drill long-lasting solar freshwater wells provided freely to neighboring villages, and provide holistic orphan sponsorship (schooling, balanced meals, medical care, and discipleship) ensuring a hopeful future in Jesus Christ."}
            </p>
          </div>

          {/* Action to Full Presentation */}
          <div className="text-center pt-2">
            <button
              onClick={() => setActivePage('who-we-are')}
              className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {language === 'fr' ? 'En savoir plus sur notre vision et gouvernance' : 'Learn more about our vision and governance'}
            </button>
          </div>

        </div>
      </section>

      {/* SECTION: NOUS SUIVRE (VIDÉOS, LIVRES CLEFS, DIRECTS, CONFÉRENCES, SÉMINAIRES, PRIÈRES, ENSEIGNEMENT ETC) */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Nous Suivre' : 'Follow Us'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? 'Vidéos, livres clefs, directs, conférences, séminaires, prières, enseignements'
                : 'Videos, key books, live broadcasts, conferences, seminars, prayers, teachings'}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              {language === 'fr'
                ? 'Accédez aux ressources spirituelles produites par l’église pour fortifier votre marche avec Dieu et demeurer connectés à nos activités.'
                : 'Access anointed spiritual content produced by the ministry to strengthen your walk with God and stay connected.'}
            </p>
          </div>

          {/* Content Highlights (Pure white cards, no borders around text, no demo text or days) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Live Broadcast Card */}
            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'fr' ? 'Direct & Culte en ligne' : 'Live Broadcast'}
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? 'Événements & Cultes en Direct' : 'Live Events & Broadcasts'}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {language === 'fr'
                    ? 'Les cultes en direct, rassemblements et événements apparaîtront ici.'
                    : 'Live events, services, and broadcasts will appear here.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActivePage('follow-us')}
                  className="btn-translucent-hero w-full py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer text-center"
                >
                  {language === 'fr' ? 'Rejoindre le Direct' : 'Watch Live'}
                </button>
              </div>
            </div>

            {/* Video / Teaching Card */}
            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'fr' ? 'Vidéos & Prédications' : 'Videos & Sermons'}
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? 'Vidéos & Enseignements' : 'Videos & Teachings'}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {language === 'fr'
                    ? 'Les vidéos, prédications et enseignements bibliques apparaîtront ici.'
                    : 'Videos, sermons, and biblical teachings will appear here.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActivePage('follow-us')}
                  className="btn-translucent-hero w-full py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer text-center"
                >
                  {language === 'fr' ? 'Voir les Vidéos' : 'Watch Videos'}
                </button>
              </div>
            </div>

            {/* Key Books Card */}
            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'fr' ? 'Livres Clefs' : 'Key Books'}
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                  {language === 'fr' ? 'Livres & Publications' : 'Books & Publications'}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {language === 'fr'
                    ? 'Les livres clefs, manuels et publications spirituelles apparaîtront ici.'
                    : 'Key books, manuals, and spiritual publications will appear here.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActivePage('follow-us')}
                  className="btn-translucent-hero w-full py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer text-center"
                >
                  {language === 'fr' ? 'Consulter les Livres' : 'Browse Books'}
                </button>
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActivePage('follow-us')}
              className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {language === 'fr' ? 'Voir toutes les vidéos, livres, conférences et prières' : 'Browse all videos, books, conferences, and prayers'}
            </button>
          </div>

        </div>
      </section>

      {/* SECTION: MISSIONS PRIORITAIRES & ACTIONS DE SOUTIEN */}
      {campaigns.length > 0 && (
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Missions & Projets Prioritaires' : 'Priority Missions & Projects'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {language === 'fr'
                ? 'Soutenez concrètement les œuvres d’évangélisation et de miséricorde'
                : 'Directly support active evangelism and compassion works'}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              {language === 'fr'
                ? "Chaque projet répond à un besoin vital sur le terrain : secours d'urgence, distribution de Bibles, construction de sanctuaires durables et parrainage d'enfants."
                : "Each initiative meets a vital frontline need: emergency food relief, Bible distribution, rural sanctuaries, and orphan care."}
            </p>
          </div>

          {/* Clean, Mobile Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign) => {
              const title = language === 'fr' ? campaign.titleFr : campaign.titleEn;
              const desc = language === 'fr' ? campaign.descriptionFr : campaign.descriptionEn;

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-2xl flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform duration-200"
                >
                  <div className="space-y-3">
                    {/* Picture */}
                    {campaign.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={campaign.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Title & Description */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        {campaign.location}
                      </span>
                      <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1C295E] leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                    {/* Progress Bar - Prominently Displayed */}
                    {(() => {
                      const percentage = Math.min(
                        100,
                        Math.max(
                          0,
                          Math.round(((campaign.currentAmount || 0) / (campaign.targetAmount || 1)) * 100)
                        )
                      );
                      return (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#1C295E]">
                              {percentage}% {language === 'fr' ? 'collecté' : 'funded'}
                            </span>
                            <span className="text-slate-500 text-[11px] font-medium">
                              {campaign.donorsCount} {language === 'fr' ? 'donateurs' : 'donors'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#1C295E] to-[#2B3F8C] h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Support this Mission Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleDonateToCampaign(campaign)}
                      className="btn-translucent-hero w-full py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer text-center inline-flex items-center justify-center"
                    >
                      {language === 'fr' ? 'Soutenir cette Action' : 'Support this Project'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActivePage('donate')}
              className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {language === 'fr' ? 'Faire un Don' : 'Make a Donation'}
            </button>
          </div>

        </div>
      </section>
      )}

      {/* SECTION: DEVENIR MEMBRE */}
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Devenir Membre' : 'Become a Member'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? 'Engagement, communion fraternelle et service divin'
                : 'Commitment, fellowship, and divine service'}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              {language === 'fr'
                ? 'Prenez une part active dans la mission de La Gloire de Dieu et rejoignez une alliance fraternelle mondiale.'
                : 'Take an active part in our Kingdom mission and join a worldwide Christian alliance.'}
            </p>
          </div>

          <CommunityMembers />

          {/* Clean Message Box */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl text-center max-w-3xl mx-auto space-y-4">
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              {language === 'fr'
                ? "Devenir membre, c'est prendre part à une famille de foi, de prière et de service, et soutenir concrètement la mission de La Gloire de Dieu."
                : 'Becoming a member means joining a family of faith, prayer and service, and supporting the mission of La Gloire de Dieu in a concrete way.'}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'fr'
                ? 'Vous pouvez dès à présent soumettre votre engagement chrétien ou contacter le secrétariat pastoral.'
                : 'You may already explore membership terms or connect with the pastoral secretariat.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActivePage('membership')}
                className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
              >
                {language === 'fr' ? 'Créer mon Compte & Devenir Membre' : 'Create Account & Become a Member'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: GALERIE PHOTOS & MISSIONS */}
      {gallery.length > 0 && (
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Galerie Photos & Missions' : 'Photo Gallery & Missions'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? 'Nos rassemblements, cultes, chantiers et actions de solidarité en images'
                : 'Our fellowship, worship, relief missions, and church planting in pictures'}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              {language === 'fr'
                ? 'Découvrez en images la gloire de Dieu en action à travers nos cultes d’adoration, réunions de prière et secours sur le terrain.'
                : 'See God’s glory in action through our worship services, prayer gatherings, and compassionate field missions.'}
            </p>
          </div>

          {/* Slideshow Display */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-16/9 sm:aspect-21/9 max-h-[500px] w-full">
            {gallery.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  index === activeGallerySlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {item.fit === 'contain' && (
                  <img
                    src={item.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
                  />
                )}
                <img
                  src={item.src}
                  alt={language === 'fr' ? item.titleFr : item.titleEn}
                  className={`relative w-full h-full ${item.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white max-w-2xl">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                    {language === 'fr' ? item.titleFr : item.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2">
                    {language === 'fr' ? item.descFr : item.descEn}
                  </p>
                </div>
              </div>
            ))}

            {/* Previous Button */}
            <button
              onClick={() => setGallerySlide((activeGallerySlide - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Button */}
            <button
              onClick={() => setGallerySlide((activeGallerySlide + 1) % gallery.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Gallery Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
            {gallery.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setGallerySlide(idx)}
                className={`relative h-14 sm:h-16 w-20 sm:w-24 rounded-lg overflow-hidden transition-all cursor-pointer ${
                  activeGallerySlide === idx
                    ? 'ring-2 ring-[#1C295E] scale-105 opacity-100'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={item.src}
                  alt={language === 'fr' ? item.titleFr : item.titleEn}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

        </div>
      </section>
      )}

      {/* SECTION: TÉMOIGNAGES & AVIS */}
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Témoignages & Avis' : 'Testimonials & Reviews'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? 'L’impact de l’œuvre de Dieu dans la vie des fidèles et des partenaires'
                : 'The impact of God’s work in the lives of believers and partners'}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              {language === 'fr'
                ? 'Découvrez ce que disent les membres et soutiens de La Gloire de Dieu, ou laissez votre propre témoignage.'
                : 'Discover reflections from members and supporters of La Gloire de Dieu, or leave your own review.'}
            </p>
          </div>

          {/* Action button to open review form */}
          <div className="text-center">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-translucent-hero px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {showReviewForm
                  ? (language === 'fr' ? 'Fermer le formulaire' : 'Close Form')
                  : (language === 'fr' ? 'Laisser un Avis / Témoignage' : 'Leave a Review')}
              </span>
            </button>
          </div>

          {/* Interactive Review Form */}
          {showReviewForm && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto space-y-4">
              <h3 className="font-cinzel text-lg font-bold text-[#1C295E]">
                {language === 'fr' ? 'Partager votre Témoignage' : 'Share Your Testimonial'}
              </h3>
              {revSuccess ? (
                <div className="p-4 bg-slate-50 text-[#1C295E] rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1C295E] shrink-0" />
                  <span>
                    {language === 'fr'
                      ? 'Merci ! Votre témoignage a été envoyé. Il sera publié après validation.'
                      : 'Thank you! Your testimonial was sent and will be published after review.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Votre Nom & Prénom' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Ville ou Rôle' : 'City or Role'}
                      </label>
                      <input
                        type="text"
                        value={revRole}
                        onChange={(e) => setRevRole(e.target.value)}
                        placeholder={language === 'fr' ? 'ex. Yaoundé, Cameroun' : 'e.g. Yaoundé, Cameroon'}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'fr' ? 'Votre Note' : 'Your Rating'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRevRating(star)}
                          className="cursor-pointer p-1"
                          aria-label={`${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= revRating ? 'text-[#1C295E] fill-[#1C295E]' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'fr' ? 'Votre Témoignage' : 'Your Testimonial'} *
                    </label>
                    <textarea
                      rows={3}
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      required
                      placeholder={language === 'fr' ? 'Partagez comment l’œuvre de Dieu vous a touché...' : 'Share how God’s ministry has impacted you...'}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-sm text-[#1C295E]">
                      {language === 'fr' ? "L'envoi a échoué. Veuillez réessayer." : 'Sending failed. Please try again.'}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-translucent-hero px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    {language === 'fr' ? 'Publier le Témoignage' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Reviews Grid */}
          <div className={reviews.length ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'hidden'}>
            {reviews.slice(0, 6).map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#1C295E]">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#1C295E]" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
                    « {language === 'en' && rev.commentEn ? rev.commentEn : rev.comment} »
                  </p>
                </div>
                <div className="pt-2">
                  <p className="font-cinzel text-base font-bold text-[#1C295E]">{rev.name}</p>
                  {rev.roleOrCity && (
                    <p className="text-xs text-slate-500">{rev.roleOrCity}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">{rev.date}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION: CONTACTEZ-NOUS */}
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Contactez-Nous' : 'Contact Us'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? 'Une question, un besoin de prière ou d’information ?'
                : 'Questions, prayer requests, or fellowship inquiries'}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              {language === 'fr'
                ? 'Notre équipe pastorale et administrative est à votre écoute pour vous répondre et prier avec vous.'
                : 'Our pastoral and administrative team is available to assist and pray with you.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Details */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-[#1C295E]">
                {settings.churchName}
              </h3>
              <ul className="space-y-4 text-sm text-slate-700">
                {(settings.address || settings.cityCountry) && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1C295E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{language === 'fr' ? 'Adresse' : 'Address'}</p>
                      <p className="text-slate-600">{[settings.address, settings.cityCountry].filter(Boolean).join(', ')}</p>
                    </div>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#1C295E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{language === 'fr' ? 'Téléphone & Ligne Pastorale' : 'Phone'}</p>
                      <p className="text-slate-600">{settings.phone}</p>
                    </div>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#1C295E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{language === 'fr' ? 'Email Officiel' : 'Email'}</p>
                      <p className="text-slate-600">{settings.email}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-[#1C295E]">
                {language === 'fr' ? 'Envoyez-nous un Message' : 'Send Us a Message'}
              </h3>
              {contactSuccess ? (
                <div className="p-4 bg-slate-50 text-[#1C295E] rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1C295E] shrink-0" />
                  <span>
                    {language === 'fr'
                      ? 'Votre message a été transmis avec succès ! Nous vous répondrons rapidement.'
                      : 'Your message has been sent successfully! We will get back to you shortly.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Nom et Prénom' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'fr' ? 'Adresse Email' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'fr' ? 'Sujet' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder={language === 'fr' ? 'Objet de votre message' : 'Message subject'}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'fr' ? 'Votre Message' : 'Your Message'} *
                    </label>
                    <textarea
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      required
                      placeholder={language === 'fr' ? 'Écrivez votre message ici...' : 'Write your message here...'}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-[#1C295E]"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-sm text-[#1C295E]">
                      {language === 'fr' ? "L'envoi a échoué. Veuillez réessayer." : 'Sending failed. Please try again.'}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Envoyer le Message' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
