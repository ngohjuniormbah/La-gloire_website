import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../assets/images';
import { CommunityMembers } from '../components/CommunityMembers';
import { Campaign } from '../types';
import { FadeIn } from '../components/FadeIn';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Send, CheckCircle2, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { t, setActivePage, campaigns, setSelectedCampaignForDonation, language, reviews, addReview, addContactMessage, gallery, settings } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [gallerySlide, setGallerySlide] = useState(0);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

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
      
      {/* 1. HERO SECTION WITH FADING SLIDESHOW & SMOOTH INTRO */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {IMAGES.heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transition: 'opacity 1.2s ease-in-out, transform 6s ease-out' }}
            >
              <img
                src={typeof slide === "string" ? slide : slide.src}
                alt="Soutien aux communautés chrétiennes dans le monde"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            {language === 'fr' ? "Bienvenue à La Gloire de Dieu" : "Welcome to La Gloire de Dieu"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {language === 'fr'
              ? "Une association chrétienne engagée pour lever des fonds et apporter un secours direct, spirituel et matériel aux communautés chrétiennes démunies et persécutées dans le monde."
              : "A Christian association committed to raising funds and delivering tangible spiritual and humanitarian relief to vulnerable and persecuted Christian communities worldwide."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <button
              onClick={() => setActivePage('who-we-are')}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold text-white bg-[#1C295E] hover:bg-[#152048] transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {language === 'fr' ? 'Qui Sommes-Nous' : 'Who We Are'}
            </button>

            <button
              onClick={() => setActivePage('contact')}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-all cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95"
            >
              {language === 'fr' ? 'Contact' : 'Contact Us'}
            </button>
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-2">
            {IMAGES.heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SECTION: QUI SOMMES-NOUS ? (FADE IN ON SCROLL) */}
      <FadeIn className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
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

          <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed text-justify sm:text-left">
            <p>
              {language === 'fr'
                ? "L'association « La Gloire de Dieu » est une communauté chrétienne évangélique vouée à proclamer fidèlement la Parole vivante de Dieu et le salut en Jésus-Christ. À travers l'évangélisation, la formation pastorale et la distribution gratuite de Bibles en langues locales, nous œuvrons pour fortifier la foi et apporter la lumière de l'Évangile jusqu'aux régions les plus isolées."
                : "The “La Gloire de Dieu” association is a Bible-grounded Christian ministry dedicated to faithfully proclaiming God’s living Word and salvation in Jesus Christ. Through evangelistic outreach, pastoral training, and free Bible distribution in native languages, we work to build up believers and bring the light of the Gospel to the most remote communities."}
            </p>

            <p>
              {language === 'fr'
                ? "Notre foi s'incarne dans une solidarité active sans frontières : nous apportons un secours d'urgence vital (vivres, soins et abris) aux chrétiens persécutés et réfugiés, tout en réalisant des forages d'eau potable, des sanctuaires communautaires et la prise en charge complète des orphelins pour manifester concrètement l'amour du Christ."
                : "Our faith is put into decisive action worldwide: providing urgent humanitarian relief (food, medical aid, and shelter) to persecuted and displaced believers, alongside building community sanctuaries, drilling clean freshwater wells, and offering full orphan sponsorship to tangibly demonstrate Christ's love."}
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActivePage('who-we-are')}
              className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {language === 'fr' ? 'En savoir plus sur notre vision et gouvernance' : 'Learn more about our vision and governance'}
            </button>
          </div>
        </div>
      </FadeIn>

      {/* 3. SECTION: NOUS SUIVRE (STAGGERED FADE-IN CARDS) */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn className="text-center max-w-3xl mx-auto space-y-2">
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
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: language === 'fr' ? 'Direct & Culte en ligne' : 'Live Broadcast',
                title: language === 'fr' ? 'Événements & Cultes en Direct' : 'Live Events & Broadcasts',
                desc: language === 'fr' ? 'Les cultes en direct, rassemblements et événements apparaîtront ici.' : 'Live events, services, and broadcasts will appear here.',
                btn: language === 'fr' ? 'Rejoindre le Direct' : 'Watch Live'
              },
              {
                tag: language === 'fr' ? 'Vidéos & Prédications' : 'Videos & Sermons',
                title: language === 'fr' ? 'Vidéos & Enseignements' : 'Videos & Teachings',
                desc: language === 'fr' ? 'Les vidéos, prédications et enseignements bibliques apparaîtront ici.' : 'Videos, sermons, and biblical teachings will appear here.',
                btn: language === 'fr' ? 'Voir les Vidéos' : 'Watch Videos'
              },
              {
                tag: language === 'fr' ? 'Livres Clefs' : 'Key Books',
                title: language === 'fr' ? 'Livres & Publications' : 'Books & Publications',
                desc: language === 'fr' ? 'Les livres clefs, manuels et publications spirituelles apparaîtront ici.' : 'Key books, manuals, and spiritual publications will appear here.',
                btn: language === 'fr' ? 'Consulter les Livres' : 'Browse Books'
              }
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.12} className="h-full">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between h-full space-y-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {card.tag}
                    </span>
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setActivePage('follow-us')}
                      className="btn-translucent-hero w-full py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer text-center"
                    >
                      {card.btn}
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center pt-2">
            <button
              onClick={() => setActivePage('follow-us')}
              className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {language === 'fr' ? 'Voir toutes les vidéos, livres, conférences et prières' : 'Browse all videos, books, conferences, and prayers'}
            </button>
          </FadeIn>
        </div>
      </section>

      {/* 4. SECTION: MISSIONS PRIORITAIRES (WITH SMOOTH REVEAL) */}
      {campaigns.length > 0 && (
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <FadeIn className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Missions & Projets Prioritaires' : 'Priority Missions & Projects'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {language === 'fr'
                ? 'Soutenez concrètement les œuvres d’évangélisation et de miséricorde'
                : 'Directly support active evangelism and compassion works'}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((campaign, i) => {
              const title = language === 'fr' ? campaign.titleFr : campaign.titleEn;
              const desc = language === 'fr' ? campaign.descriptionFr : campaign.descriptionEn;

              return (
                <FadeIn key={campaign.id} delay={i * 0.1}>
                  <div
                    className="bg-white rounded-2xl flex flex-col justify-between h-full space-y-4 border border-slate-100 p-3 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      {campaign.imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                          <img
                            src={campaign.imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
                          />
                        </div>
                      )}

                      <div className="space-y-2 pt-1 px-1">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                          {campaign.location}
                        </span>
                        <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1C295E] leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {desc}
                        </p>
                      </div>

                      {(() => {
                        const percentage = Math.min(
                          100,
                          Math.max(
                            0,
                            Math.round(((campaign.currentAmount || 0) / (campaign.targetAmount || 1)) * 100)
                          )
                        );
                        return (
                          <div className="space-y-1.5 pt-2 px-1">
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
                                className="bg-gradient-to-r from-[#1C295E] to-[#2B3F8C] h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleDonateToCampaign(campaign)}
                        className="btn-translucent-hero w-full py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer text-center inline-flex items-center justify-center"
                      >
                        {language === 'fr' ? 'Soutenir cette Action' : 'Support this Project'}
                      </button>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="text-center pt-2">
            <button
              onClick={() => setActivePage('donate')}
              className="btn-translucent-hero w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {language === 'fr' ? 'Faire un Don' : 'Make a Donation'}
            </button>
          </FadeIn>
        </div>
      </section>
      )}

      {/* 5. SECTION: DEVENIR MEMBRE (FADE IN) */}
      <FadeIn className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

          <CommunityMembers />

          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 text-center max-w-3xl mx-auto space-y-4 shadow-xs">
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              {language === 'fr'
                ? "Devenir membre, c'est prendre part à une famille de foi, de prière et de service, et soutenir concrètement la mission de La Gloire de Dieu."
                : 'Becoming a member means joining a family of faith, prayer and service, and supporting the mission of La Gloire de Dieu in a concrete way.'}
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
      </FadeIn>

      {/* 6. SECTION: GALERIE (FADE IN) */}
      {gallery.length > 0 && (
      <FadeIn className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-16/9 sm:aspect-21/9 max-h-[500px] w-full shadow-lg">
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

            <button
              onClick={() => setGallerySlide((activeGallerySlide - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setGallerySlide((activeGallerySlide + 1) % gallery.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
            {gallery.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setGallerySlide(idx)}
                className={`relative h-14 sm:h-16 w-20 sm:w-24 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
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
      </FadeIn>
      )}

      {/* 7. SECTION: TÉMOIGNAGES (FADE IN) */}
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <FadeIn className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Témoignages & Avis' : 'Testimonials & Reviews'}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? 'L’impact de l’œuvre de Dieu dans la vie des fidèles et des partenaires'
                : 'The impact of God’s work in the lives of believers and partners'}
            </p>
          </FadeIn>

          <FadeIn className="text-center">
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
          </FadeIn>

          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto space-y-4 border border-slate-100 shadow-sm"
            >
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
            </motion.div>
          )}

          <div className={reviews.length ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'hidden'}>
            {reviews.slice(0, 6).map((rev, i) => (
              <FadeIn key={rev.id} delay={i * 0.08} className="h-full">
                <div
                  className="bg-white p-6 rounded-2xl flex flex-col justify-between h-full space-y-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#1C295E]">
                      {[...Array(rev.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#1C295E]" />
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SECTION: CONTACTEZ-NOUS (FADE IN) */}
      <FadeIn className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl space-y-6 border border-slate-100 shadow-xs">
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

            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-100 shadow-xs">
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
      </FadeIn>

    </div>
  );
};
