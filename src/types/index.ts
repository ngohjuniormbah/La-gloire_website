export type Language = 'fr' | 'en';

export type PageId =
  | 'home'
  | 'who-we-are'
  | 'follow-us'
  | 'donate'
  | 'membership'
  | 'contact'
  | 'admin'
  | 'login';

export interface Campaign {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  category: 'humanitarian' | 'bibles' | 'church-building' | 'education' | 'urgent';
  targetAmount: number;
  currentAmount: number;
  donorsCount: number;
  imageUrl?: string;
  urgent?: boolean;
  location: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  amount?: number;
  currency?: string;
  frequency?: 'once' | 'monthly';
  paymentMethod?: 'card' | 'paypal' | 'mobile_money' | 'bank_transfer' | 'direct_contact';
  campaignId?: string;
  campaignTitle?: string;
  date: string;
  receiptNumber: string;
  status: 'completed' | 'processing' | 'pending_contact';
  message?: string;
  isAnonymous?: boolean;
}

export type MembershipTier = 'regular' | 'benefactor' | 'honorary' | 'youth';

export interface MemberRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipType: MembershipTier;
  city: string;
  country: string;
  joinedDate: string;
  status: 'active' | 'pending';
  spiritualGifts?: string;
  membershipNumber: string;
}

export type MediaType = 'video' | 'pdf';

export interface MediaItem {
  id: string;
  type: MediaType;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  url: string;
  source: 'link' | 'upload';
  date: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  city?: string;
  request: string;
  isPublic: boolean;
  date: string;
  prayedCount: number;
  isAnswered: boolean;
}

export interface Review {
  id: string;
  name: string;
  authorName?: string;
  roleOrCity?: string;
  rating: number; // 1 to 5
  comment: string;
  /** Optional English version shown when the site is in English */
  commentEn?: string;
  date: string;
  approved?: boolean;
}

export type ReviewRecord = Review;

export interface SiteSettings {
  churchName: string;
  address: string;
  cityCountry: string;
  phone: string;
  prayerLine: string;
  email: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'replied' | 'archived';
}

export interface GalleryItem {
  id: string;
  titleFr: string;
  titleEn: string;
  src: string;
  source: 'link' | 'upload';
  descFr?: string;
  descEn?: string;
  /** 'contain' keeps tall images (posters) fully visible instead of cropping them */
  fit?: 'cover' | 'contain';
  date: string;
}

