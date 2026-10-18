import React from 'react';
import { useApp } from '../context/AppContext';


// Turn a pasted video link into something we can embed, or fall back to a plain player / link.
const getEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url, window.location.origin);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith('youtube.com')) {
      if (u.pathname === '/watch' && u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/') || u.pathname.startsWith('/live/')) {
        return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`;
      }
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
};

const isDirectVideo = (url: string) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url);

export const FollowUsView: React.FC = () => {
  const { setActivePage, language, mediaList } = useApp();
  const videos = mediaList.filter((m) => m.type === 'video');
  const pdfs = mediaList.filter((m) => m.type === 'pdf');

  const editorialSections = [
    {
      titleFr: "Directs & Rassemblements en Ligne",
      titleEn: "Live Broadcasts & Online Services",
      descFr: "Diffusion en direct des cultes d'action de grâce, des veillées d'intercession, des conventions spirituelles et des temps de prière communautaire. Ces retransmissions permettent aux fidèles et aux membres de la diaspora de demeurer unis dans la communion fraternelle, où qu'ils se trouvent dans le monde.",
      descEn: "Live broadcasts of thanksgiving services, intercessory vigils, spiritual conferences, and fellowship prayer gatherings, allowing believers and diaspora members to remain united in fraternal communion worldwide.",
      tagFr: "Diffusion Directe",
      tagEn: "Live Streaming"
    },
    {
      titleFr: "Vidéos, Prédications & Enseignements Bibliques",
      titleEn: "Videos, Sermons & Biblical Teachings",
      descFr: "Archives vidéo et enregistrements thématiques guidés par les Saintes Écritures : prédications dominicales, études bibliques approfondies, exhortations pastorales et séries d'édification spirituelle destinées à fortifier chaque croyant dans la saine doctrine du Christ.",
      descEn: "Video archives and scripture-grounded teachings: Sunday sermons, in-depth biblical studies, pastoral exhortations, and discipleship series designed to strengthen believers in the sound doctrine of Christ.",
      tagFr: "Médiathèque Pastorale",
      tagEn: "Video Library"
    },
    {
      titleFr: "Livres Clés & Publications Chrétiennes",
      titleEn: "Key Books & Spiritual Publications",
      descFr: "Ouvrages théologiques, manuels de prière et de délivrance, guides de croissance spirituelle et publications d'édification rédigés par la direction de l'église. Ces écrits fournissent des repères bibliques solides face aux défis contemporains de la vie chrétienne.",
      descEn: "Theological volumes, prayer and deliverance manuals, spiritual growth guides, and Christian discipleship literature authored by pastoral leadership to provide solid biblical compasses for contemporary Christian life.",
      tagFr: "Littérature Chrétienne",
      tagEn: "Books & Literature"
    },
    {
      titleFr: "Conférences, Séminaires & Agenda d'Événements",
      titleEn: "Conferences, Seminars & Events Schedule",
      descFr: "Calendrier officiel des grands rendez-vous annuels : séminaires de formation des serviteurs et ouvriers du Seigneur, retraites spirituelles de jeûne et prière, conventions internationales et ateliers thématiques pour l'affermissement des familles.",
      descEn: "Official calendar of key ministry gatherings: leadership training seminars for church workers, fasting and prayer spiritual retreats, international conventions, and family discipleship workshops.",
      tagFr: "Calendrier Ministériel",
      tagEn: "Events Schedule"
    }
  ];

  return (
    <div className="space-y-16 py-8 pb-24 text-slate-800 bg-white">
      
      {/* 1. Header Banner (Clean, Minimal, Pure White) */}
      <section className="bg-white py-12 lg:py-16 text-center space-y-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
            {language === 'fr'
              ? 'Ressources Spirituelles & Médias'
              : 'Spiritual Resources & Media'}
          </p>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1C295E]">
            {language === 'fr' ? 'Suivez-Nous' : 'Follow Us'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'fr'
              ? "Accédez aux prédications, enseignements bibliques, livres clés, cultes en direct et conférences de l'association 'La Gloire de Dieu'."
              : "Access sermons, biblical teachings, key books, live services, and ministry conferences from the 'La Gloire de Dieu' association."}
          </p>
        </div>
      </section>

      {/* 2. Editorial Introduction (Clean, Simple, No Icons) */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center space-y-3">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
            {language === 'fr' ? 'Espace Multimédia & Diffusion' : 'Multimedia & Media Channels'}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
            {language === 'fr'
              ? "Notre mission s'étend au-delà des sanctuaires physiques. À travers nos canaux de diffusion, nous mettons la Parole vivante de Dieu et la louange chrétienne à la portée de chaque âme, chaque foyer et chaque communauté à travers le monde."
              : "Our divine commission extends beyond physical church walls. Through our media channels, we bring God’s living Word, solid discipleship, and prayer to every heart, home, and community across the globe."}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto italic">
            {language === 'fr'
              ? "Les prochains directs, vidéos d'enseignements, ouvrages pastoraux et programmes de conférences sont continuellement mis à jour par le secrétariat pastoral."
              : "Upcoming live broadcasts, video sermons, pastoral literature, and conference programs are updated continuously by the ministry coordination team."}
          </p>
        </div>
      </section>

      {/* 3. Media Sections in Clean, Dignified Blocks (NO Icons) */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {editorialSections.map((item, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-100 pb-8 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1C295E]">
                  {item.titleFr ? (language === 'fr' ? item.titleFr : item.titleEn) : ''}
                </h3>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {language === 'fr' ? item.tagFr : item.tagEn}
                </span>
              </div>
              <p className="text-base text-slate-700 leading-relaxed pt-1">
                {language === 'fr' ? item.descFr : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Published videos (embedded, played, or linked) */}
      {videos.length > 0 && (
        <section className="bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-cinzel text-2xl font-bold text-[#1C295E] text-center">
            {language === 'fr' ? 'Vidéos' : 'Videos'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((item) => {
              const title = language === 'fr' ? item.titleFr : item.titleEn;
              const desc = language === 'fr' ? item.descriptionFr : item.descriptionEn;
              const embed = getEmbedUrl(item.url);
              const direct = item.url.startsWith('/uploads/') || isDirectVideo(item.url);
              return (
                <div key={item.id} className="space-y-3">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                    {embed ? (
                      <iframe
                        src={embed}
                        title={title}
                        className="w-full h-full"
                        loading="lazy"
                        allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                      />
                    ) : direct ? (
                      <video src={item.url} controls preload="metadata" className="w-full h-full bg-black" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-translucent-hero px-6 py-2.5 rounded-lg text-sm font-semibold"
                        >
                          {language === 'fr' ? 'Regarder la vidéo' : 'Watch video'}
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-[#1C295E]">{title}</h3>
                    {desc && <p className="text-sm text-slate-600 leading-relaxed mt-1">{desc}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Published PDFs */}
      {pdfs.length > 0 && (
        <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-cinzel text-2xl font-bold text-[#1C295E] text-center">
            {language === 'fr' ? 'Livres & Documents PDF' : 'Books & PDF Documents'}
          </h2>
          <ul className="divide-y divide-slate-200 border border-slate-200 rounded-xl">
            {pdfs.map((item) => {
              const title = language === 'fr' ? item.titleFr : item.titleEn;
              const desc = language === 'fr' ? item.descriptionFr : item.descriptionEn;
              return (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <h3 className="font-cinzel text-base font-bold text-[#1C295E]">{title}</h3>
                    {desc && <p className="text-sm text-slate-600 mt-0.5">{desc}</p>}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-translucent-hero px-5 py-2 rounded-lg text-xs font-semibold shrink-0"
                  >
                    {language === 'fr' ? 'Lire / Télécharger' : 'Read / Download'}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 5. Centered Translucent Navigation Buttons */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('home')}
            className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {language === 'fr' ? 'Retour à l’Accueil' : 'Return to Home'}
          </button>
          <button
            onClick={() => setActivePage('who-we-are')}
            className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {language === 'fr' ? 'Qui Sommes-Nous' : 'Who We Are'}
          </button>
          <button
            onClick={() => setActivePage('donate')}
            className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {language === 'fr' ? 'Faire un Don' : 'Make a Donation'}
          </button>
          <button
            onClick={() => setActivePage('contact')}
            className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {language === 'fr' ? 'Nous Contacter' : 'Contact Us'}
          </button>
        </div>
      </section>

    </div>
  );
};
