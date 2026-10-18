import React from 'react';
import { useApp } from '../context/AppContext';

export const WhoWeAreView: React.FC = () => {
  const { t, setActivePage, language } = useApp();

  const leaders = [
    {
      name: "Révérend Pasteur Principal",
      nameEn: "Senior Reverend Pastor",
      roleFr: "Visionnaire & Président Fondateur",
      roleEn: "Visionary & Founding President",
      descFr: "Consacré au ministère pastoral et évangélique, passionné par la prédication inaltérable de la Parole de Dieu, le réveil spirituel et la solidarité chrétienne mondiale.",
      descEn: "Consecrated minister of the Gospel, passionate about preaching God’s unchanging Word, spiritual revival, and worldwide Christian solidarity."
    },
    {
      name: "Direction des Missions & Secours",
      nameEn: "Missions & Relief Directorate",
      roleFr: "Coordination Humanitaire & Terrain",
      roleEn: "Humanitarian Relief & Field Missions",
      descFr: "Supervise l'acheminement des vivres, des bibles et la logistique médicale dans les pays d'intervention.",
      descEn: "Directs food distribution relief, Bible shipments, and medical aid across partner mission countries."
    },
    {
      name: "Conseil des Anciens & Enseignants",
      nameEn: "Council of Elders & Teachers",
      roleFr: "Doctrine, Formation & Évangélisation",
      roleEn: "Doctrine, Training & Evangelism",
      descFr: "Veille à la fidélité biblique des enseignements et organise les séminaires de formation chrétienne.",
      descEn: "Guards biblical integrity, coordinates regional training institutes, and leads spiritual conferences."
    }
  ];

  return (
    <div className="space-y-16 py-8 pb-20 text-slate-800 bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
            {t.meta.tagline}
          </p>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1C295E]">
            {t.whoWeAre.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            {t.whoWeAre.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Presentation of Association & Story (Blocks of paragraphs, no picture, no borders, centered buttons) */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {t.whoWeAre.historyTitle}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? "Une mission fondée sur l'amour du Christ et la fidélité aux Écritures"
                : "A ministry rooted in Christ’s love and scriptural fidelity"}
            </p>
          </div>

          {/* Blocks of paragraphs */}
          <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed">
            <p>
              {t.whoWeAre.historyParagraph1}
            </p>
            <p>
              {t.whoWeAre.historyParagraph2}
            </p>
            <p>
              {language === 'fr'
                ? "L'association 'La Gloire de Dieu' n'est pas une simple œuvre humanitaire : nous sommes une assemblée de croyants engagés dont le cœur bat pour l'avancement du Royaume céleste. Chaque action que nous entreprenons est précédée par la prière, ancrée dans la saine doctrine et portée par le désir ardent de voir des âmes sauvées, délivrées et affermies dans la foi."
                : "The 'La Gloire de Dieu' association is more than a humanitarian initiative: we are an assembly of passionate believers whose hearts beat for the advancement of God's Kingdom. Every endeavor we undertake is preceded by prayer, anchored in sound doctrine, and driven by an earnest longing to see souls saved, delivered, and strengthened in Christ."}
            </p>
            <p className="italic text-slate-800 text-center py-2 max-w-3xl mx-auto">
              {language === 'fr' 
                ? "« Notre mission ne s'arrête pas aux paroles : elle s'exprime dans chaque bol de nourriture distribué, chaque Bible remise entre des mains assoiffées et chaque chapelle érigée pour adorer le Seigneur. »"
                : "“Our mission does not stop at words: it is realized in every bowl of food shared, every Bible placed into longing hands, and every chapel erected to glorify the Lord.”"}
            </p>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <img
              src="/demo/prayer-bible.jpg"
              alt={language === 'fr' ? 'Prière autour de la Bible' : 'Prayer around the Bible'}
              loading="lazy"
              className="w-full h-64 object-cover rounded-2xl"
            />
            <img
              src="/demo/globe-hands.jpg"
              alt={language === 'fr' ? 'Des mains unies autour du monde' : 'Hands united around the world'}
              loading="lazy"
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>

          {/* Centered Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={() => setActivePage('donate')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {t.nav.donateNowBtn}
            </button>
            <button
              onClick={() => setActivePage('membership')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {t.nav.membership}
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
            >
              {t.nav.contact}
            </button>
          </div>

        </div>
      </section>

      {/* 3. Core Ministry Pillars (Blocks of paragraphs, no border around text) */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {t.whoWeAre.objectivesTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {language === 'fr'
                ? 'Nos actions concrètes pour prêcher la Parole de Dieu, manifester l’amour du Christ et secourir Son peuple.'
                : 'Our dedicated initiatives to preach God’s Word, demonstrate Christ’s love, and support His people worldwide.'}
            </p>
          </div>

          <div className="space-y-8">
            {t.whoWeAre.objectives.map((obj, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1C295E]">
                  {obj.title}
                </h3>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Leadership & Stewardship (Blocks of paragraphs, no borders around text) */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
            {t.whoWeAre.leadershipTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.whoWeAre.leadershipSubtitle}
          </p>
        </div>

        <div className="space-y-8">
          {leaders.map((leader, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C295E]">
                {language === 'fr' ? leader.name : leader.nameEn}
              </h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                {language === 'fr' ? leader.roleFr : leader.roleEn}
              </p>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {language === 'fr' ? leader.descFr : leader.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Transparency (Blocks of paragraphs, no borders around text) */}
        <div className="space-y-4 pt-6">
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1C295E]">
            {t.whoWeAre.transparencyTitle}
          </h3>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            {t.whoWeAre.transparencyText}
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {language === 'fr'
              ? "Notre engagement éthique repose sur un audit annuel rigoureux, l'émission conforme de reçus fiscaux et la publication régulière de rapports photographiques et comptables détaillant l'impact réel de chaque don sur le terrain."
              : "Our ethical commitment rests upon rigorous annual independent audits, compliant tax receipt issuance, and regular publishing of field photographic and financial reports detailing the concrete impact of every contribution."}
          </p>
        </div>

        {/* Centered Action Buttons at Bottom */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('donate')}
            className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {t.nav.donateNowBtn}
          </button>
          <button
            onClick={() => setActivePage('contact')}
            className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {t.nav.contact}
          </button>
        </div>

      </section>

    </div>
  );
};
