import React from 'react';
import { useApp } from '../context/AppContext';
import { CommunityMembers } from '../components/CommunityMembers';
import { UserCheck, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export const MembershipView: React.FC = () => {
  const { t, language, setActivePage } = useApp();

  return (
    <div className="space-y-16 py-8 pb-20 text-slate-800 bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-white py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1C295E]">
            {language === 'fr' ? "Devenir Membre de l'Association" : "Becoming a Member"}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-scripture italic">
            {language === 'fr'
              ? "« Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. » — Matthieu 18:20"
              : "“For where two or three gather in my name, there am I with them.” — Matthew 18:20"}
          </p>
        </div>
      </section>

      {/* 2. Clear Professional Paragraphs: What It Means To Be a Member */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? "L'Appel à la Communion et au Service" : "Our Calling to Fellowship and Service"}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? "Une famille spirituelle dévouée à l'Évangile et à l'amour du prochain"
                : "A spiritual household devoted to the Gospel and neighborly love"}
            </p>
          </div>

          {/* Blocks of paragraphs without borders */}
          <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed text-justify sm:text-left">
            <p>
              {language === 'fr'
                ? "Devenir membre de l'association et de l'église « La Gloire de Dieu », c'est avant tout répondre à un appel divin à la communion fraternelle. Ce n'est pas un acte administratif froid ou une simple démarche protocolaire, mais l'intégration vivante au sein d'une communauté de foi où chaque frère et chaque sœur trouve sa place, grandit dans la connaissance des Écritures et partage les bénédictions du Seigneur."
                : "Becoming a member of the 'La Gloire de Dieu' church and association is first and foremost answering a sacred calling to fellowship. It is never a cold administrative formality, but rather a vital integration into a living community of faith where each brother and sister finds their place, matures in Scripture, and shares in the abundant grace of the Lord."}
            </p>

            <p>
              {language === 'fr'
                ? "En tant que membre, vous bénéficiez d'un accompagnement pastoral continu, d'une couverture dans la prière par nos chaînes d'intercession et d'un cadre bienveillant pour exercer vos dons spirituels. Que vous soyez appelé à l'enseignement, au chant, à l'accueil, à l'action caritative ou au soutien logistique, l'association offre un terrain fertile pour mettre vos talents au service du Royaume de Dieu."
                : "As a member, you receive steadfast pastoral guidance, continuous prayer covering from our intercession teams, and a supportive atmosphere in which to cultivate and exercise your spiritual gifts. Whether you feel called to teaching, praise and worship, hospitality, charitable outreach, or administrative service, our association offers fertile ground to honor God with your talents."}
            </p>

            <p>
              {language === 'fr'
                ? "L'appartenance à notre assemblée implique également une solidarité concrète envers les plus démunis. Ensemble, nous soutenons les orphelins, venons en aide aux chrétiens persécutés et déplacés, et participons à l'édification de lieux de culte dans les régions reculées. Chaque membre est une pierre vivante de cet édifice spirituel qui rayonne la gloire de Dieu à travers le monde."
                : "Membership also embodies practical compassion toward the suffering. Together, we comfort the orphan, provide emergency aid to displaced and persecuted Christians, and construct safe sanctuaries in remote regions. Every member is a living stone in this spiritual temple, manifesting God’s glory across nations."}
            </p>
          </div>

          {/* Centered Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('login')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'fr' ? 'Créer mon Compte Membre' : 'Create Member Account'}</span>
            </button>

            <button
              onClick={() => setActivePage('login')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'fr' ? 'Déjà Membre ? Se Connecter' : 'Already a Member? Sign In'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. The Criteria: Clean & Explicit ("the criteria is that to be a member you can create an account") */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? "Le Critère d'Adhésion : La Création d'un Compte" : "Membership Criteria: Creating Your Account"}
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {language === 'fr'
                ? "Une adhésion simple, transparente et ouverte à tous les cœurs sincères"
                : "Open, transparent, and welcoming to all sincere hearts"}
            </p>
          </div>

          {/* Blocks of paragraphs without borders */}
          <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed text-justify sm:text-left">
            <p>
              {language === 'fr'
                ? "Dans l'Église « La Gloire de Dieu », nous croyons fermement que l'accès à la communauté chrétienne ne doit être entravé par aucune barrière financière, sociale ou bureaucratique inutile. La grâce de notre Seigneur Jésus-Christ est offerte librement à quiconque la reçoit avec foi et droiture de cœur."
                : "At 'La Gloire de Dieu', we firmly believe that access to the Christian fellowship should never be obstructed by financial hurdles, social barriers, or unnecessary bureaucratic burdens. The grace of our Lord Jesus Christ is freely offered to all who receive it with faith and sincerity of heart."}
            </p>

            <p>
              {language === 'fr'
                ? "Le critère fondamental et direct pour être reconnu comme membre officiel de l'association est simplement de créer votre compte. En créant votre compte membre, vous officialisez votre désir d'appartenir à notre famille d'alliance, vous vous inscrivez dans notre registre communautaire et vous recevez votre identifiant unique de membre ainsi que votre carte officielle."
                : "The fundamental and direct criterion to be recognized as an official member is simply to create an account. By creating your member account, you formalize your heartfelt desire to belong to our covenant family, register within our community directory, and receive your unique member identification along with your official digital card."}
            </p>

            <p>
              {language === 'fr'
                ? "La création de ce compte vous permet de rester connecté à toutes les assemblées générales, de recevoir les lettres pastorales confidentielles, de déposer des requêtes de prière prioritaires et de participer activement à la vie démocratique et spirituelle de l'œuvre. Aucune cotisation obligatoire n'est exigée pour devenir membre : seule compte votre volonté sincère de vous joindre à cette belle mission de réveil et de foi."
                : "Creating your account allows you to stay connected to all general assemblies, receive pastoral communications, submit priority prayer requests, and actively participate in the spiritual and democratic life of the work. No mandatory fee is required to become a member: what matters is your sincere commitment to join this mission of revival, love, and truth."}
            </p>
          </div>

          {/* Centered Button taking user to login/signin page */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('login')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{language === 'fr' ? 'Accéder à la Page de Connexion / Inscription' : 'Go to Sign In / Registration Page'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Community members */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <CommunityMembers />
      </section>

      {/* 4. Action Section: Direct link to the dedicated Login / Sign-In Page */}
      <section className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-50/70 rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-12 h-12 bg-white text-[#1C295E] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <UserCheck className="w-6 h-6 text-[#1C295E]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1C295E]">
              {language === 'fr' ? 'Rejoindre la Communauté' : 'Join Our Fellowship'}
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              {language === 'fr'
                ? "Créez votre compte membre dès aujourd'hui pour officialiser votre engagement, recevoir votre carte d'adhérent et accéder à votre espace personnel."
                : "Create your member account today to formalize your covenant, receive your official membership card, and access your personal portal."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActivePage('login')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'fr' ? 'Créer mon Compte Membre' : 'Create Member Account'}</span>
            </button>

            <button
              onClick={() => setActivePage('login')}
              className="btn-translucent-hero px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'fr' ? 'Se Connecter' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Additional Centered Navigation Links */}
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
            onClick={() => setActivePage('contact')}
            className="btn-translucent-hero px-6 py-2.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center"
          >
            {t.nav.contact}
          </button>
        </div>
      </section>

    </div>
  );
};
