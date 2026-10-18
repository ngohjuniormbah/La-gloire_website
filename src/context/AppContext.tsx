import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Campaign,
  DonationRecord,
  MemberRecord,
  MediaItem,
  Review,
  SiteSettings,
  Language,
  PageId,
  GalleryItem
} from '../types';
import { translations } from '../i18n/translations';
import { api } from '../api';
import { SHOW_DEMO, DEMO_GALLERY, DEMO_CAMPAIGNS, DEMO_REVIEWS, DEMO_MEMBERS, CommunityMember } from '../data/demo';

const EMPTY_SETTINGS: SiteSettings = {
  churchName: 'La Gloire de Dieu',
  address: '',
  cityCountry: '',
  phone: '',
  prayerLine: '',
  email: ''
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  /** Public content published from the admin page (starts empty). */
  campaigns: Campaign[];
  mediaList: MediaItem[];
  gallery: GalleryItem[];
  reviews: Review[];
  settings: SiteSettings;
  /** Members shown as profile icons (demo content only, hidden when demo is off). */
  communityMembers: CommunityMember[];
  refreshContent: () => Promise<void>;
  /** Public form submissions (stored on the server, visible in the admin inbox). */
  processDonation: (donation: Omit<DonationRecord, 'id' | 'receiptNumber' | 'date' | 'status'>) => Promise<DonationRecord>;
  registerMember: (member: Omit<MemberRecord, 'id' | 'membershipNumber' | 'joinedDate' | 'status'>) => Promise<MemberRecord>;
  addReview: (review: { name: string; roleOrCity?: string; rating: number; comment: string }) => Promise<void>;
  addContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  t: typeof translations.fr;
  selectedCampaignForDonation: Campaign | null;
  setSelectedCampaignForDonation: (c: Campaign | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const VALID_PAGES: PageId[] = ['home', 'who-we-are', 'follow-us', 'donate', 'membership', 'contact', 'admin', 'login'];

const getPageFromUrl = (): PageId => {
  if (typeof window === 'undefined') return 'home';

  // 1. Hash: #admin, #/admin
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (VALID_PAGES.includes(hash as PageId)) return hash as PageId;

  // 2. Query: ?page=admin
  const pageParam = new URLSearchParams(window.location.search).get('page')?.toLowerCase();
  if (pageParam && VALID_PAGES.includes(pageParam as PageId)) return pageParam as PageId;

  // 3. Path: /admin
  const path = window.location.pathname.replace(/^\//, '').trim().toLowerCase();
  if (VALID_PAGES.includes(path as PageId)) return path as PageId;

  return 'home';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stable server/client initial state prevents hydration mismatches in Next.js.
  const [language, setLanguageState] = useState<Language>('fr');
  const [activePage, setActivePageState] = useState<PageId>('home');
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<Campaign | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);

  const setActivePage = (page: PageId) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = `#${page}`;
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lgd_lang');
      if (saved === 'en' || saved === 'fr') setLanguageState(saved);
    } catch { /* storage may be disabled */ }
    setActivePageState(getPageFromUrl());
    const handleUrlChange = () => setActivePageState(getPageFromUrl());
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('lgd_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const refreshContent = useCallback(async () => {
    try {
      const data = await api.getPublic();
      setCampaigns(data.campaigns || []);
      setMediaList(data.media || []);
      setGallery(data.gallery || []);
      setReviews(data.reviews || []);
      setSettings({ ...EMPTY_SETTINGS, ...(data.settings || {}) });
    } catch {
      // Server unreachable: the site simply shows no published content.
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const processDonation: AppContextType['processDonation'] = async (donationData) => {
    const record = await api.sendDonation(donationData);
    refreshContent();
    return record as DonationRecord;
  };

  const registerMember: AppContextType['registerMember'] = async (memberData) => {
    const record = (await api.sendMember(memberData)) as MemberRecord;
    return record;
  };

  const addReview: AppContextType['addReview'] = async (review) => {
    await api.sendReview(review);
  };

  const addContactMessage: AppContextType['addContactMessage'] = async (msg) => {
    await api.sendMessage(msg);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activePage,
        setActivePage,
        campaigns: campaigns.length ? campaigns : SHOW_DEMO ? DEMO_CAMPAIGNS : [],
        mediaList,
        gallery: gallery.length ? gallery : SHOW_DEMO ? DEMO_GALLERY : [],
        reviews: reviews.length ? reviews : SHOW_DEMO ? DEMO_REVIEWS : [],
        settings,
        communityMembers: SHOW_DEMO ? DEMO_MEMBERS : [],
        refreshContent,
        processDonation,
        registerMember,
        addReview,
        addContactMessage,
        t,
        selectedCampaignForDonation,
        setSelectedCampaignForDonation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
