import { Campaign, GalleryItem, Review } from '../types';

/**
 * Demo content shown for client presentations.
 * - It only fills a section while that section has NO real content in the database,
 *   so as soon as something is published from the admin page, the demo for that section disappears.
 * - To turn all demo content off, set NEXT_PUBLIC_SHOW_DEMO=false in the environment and redeploy.
 */
export const SHOW_DEMO = process.env.NEXT_PUBLIC_SHOW_DEMO !== 'false';

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
}

export const DEMO_GALLERY: GalleryItem[] = [
  {
    id: 'demo-gal-1',
    titleFr: 'Unis pour les nations',
    titleEn: 'United for the Nations',
    descFr: 'Des mains levées ensemble pour la paix, la foi et la solidarité entre les peuples.',
    descEn: 'Hands raised together for peace, faith and solidarity among all peoples.',
    src: '/demo/globe-hands.jpg',
    source: 'link',
    date: '2026-10-12'
  },
  {
    id: 'demo-gal-2',
    titleFr: 'Prière autour de la Parole',
    titleEn: 'Prayer around the Word',
    descFr: 'Des familles rassemblées en prière autour de la Bible, au cœur du village.',
    descEn: 'Families gathered in prayer around the Bible in the heart of the village.',
    src: '/demo/prayer-bible.jpg',
    source: 'link',
    date: '2026-10-08'
  },
  {
    id: 'demo-gal-3',
    titleFr: 'Espérance pour les familles',
    titleEn: 'Hope for Families',
    descFr: 'Accompagnement et protection des mères, des enfants et des orphelins.',
    descEn: 'Loving support and protection for mothers, children and orphans.',
    src: '/demo/hope-family.jpg',
    source: 'link',
    date: '2026-10-04'
  },
  {
    id: 'demo-gal-4',
    titleFr: 'Secours humanitaire',
    titleEn: 'Humanitarian Relief',
    descFr: 'Distribution de vivres, d’eau potable et de soins aux plus vulnérables.',
    descEn: 'Delivering food, clean water and care to those most in need.',
    src: '/demo/humanitarian-aid.jpg',
    source: 'link',
    date: '2026-09-28'
  },
  {
    id: 'demo-gal-5',
    titleFr: 'Appel à l’action 2024',
    titleEn: 'God’s Call to Action',
    descFr: 'Notre engagement face au racisme et à la pauvreté : Dieu nous appelle à répondre.',
    descEn: 'Our commitment against racism and poverty: God is calling us to respond.',
    src: '/demo/call-to-action.jpg',
    fit: 'contain',
    source: 'link',
    date: '2026-09-20'
  },
  {
    id: 'demo-gal-6',
    titleFr: 'Mission sans frontières',
    titleEn: 'Mission Without Borders',
    descFr: 'Soutien direct aux communautés chrétiennes isolées à travers le monde.',
    descEn: 'Direct support for isolated Christian communities around the world.',
    src: '/demo/global-mission.jpg',
    source: 'link',
    date: '2026-09-12'
  }
];

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: 'demo-camp-1',
    titleFr: 'Secours Alimentaire & Abri pour Chrétiens Déplacés',
    titleEn: 'Emergency Food & Shelter for Displaced Christians',
    descriptionFr: 'Kits alimentaires d’urgence, tentes résistantes et eau potable pour des familles chrétiennes déplacées.',
    descriptionEn: 'Emergency food rations, weather-resistant tents and safe drinking water for displaced Christian families.',
    category: 'urgent',
    targetAmount: 50000,
    currentAmount: 38750,
    donorsCount: 412,
    imageUrl: '/demo/humanitarian-aid.jpg',
    urgent: true,
    location: 'Sahel & RDC'
  },
  {
    id: 'demo-camp-2',
    titleFr: 'Distribution de Bibles dans les Villages Isolés',
    titleEn: 'Bible Distribution in Remote Villages',
    descriptionFr: 'Impression et acheminement de Bibles complètes en langues locales pour les jeunes assemblées.',
    descriptionEn: 'Printing and delivery of complete Bibles in local languages for young village congregations.',
    category: 'bibles',
    targetAmount: 25000,
    currentAmount: 19800,
    donorsCount: 230,
    imageUrl: '/demo/prayer-bible.jpg',
    location: 'Afrique de l’Ouest & Centrale'
  },
  {
    id: 'demo-camp-3',
    titleFr: 'Mission Mondiale & Soutien aux Églises',
    titleEn: 'Global Mission & Church Support',
    descriptionFr: 'Soutien aux églises et aux communautés chrétiennes qui ont besoin de prière et de moyens.',
    descriptionEn: 'Support for churches and Christian communities in need of prayer and resources.',
    category: 'church-building',
    targetAmount: 80000,
    currentAmount: 52400,
    donorsCount: 318,
    imageUrl: '/demo/globe-hands.jpg',
    location: 'International'
  },
  {
    id: 'demo-camp-4',
    titleFr: 'Bourses Scolaires & Soutien aux Orphelins',
    titleEn: 'School Scholarships & Care for Orphans',
    descriptionFr: 'Frais de scolarité, repas et suivi médical pour des enfants pris en charge par nos églises partenaires.',
    descriptionEn: 'School fees, daily meals and medical care for children supported by our partner churches.',
    category: 'education',
    targetAmount: 35000,
    currentAmount: 28900,
    donorsCount: 195,
    imageUrl: '/demo/hope-family.jpg',
    urgent: true,
    location: 'Cameroun'
  }
];

export const DEMO_REVIEWS: Review[] = [
  {
    id: 'demo-rev-1',
    name: 'Pasteur Daniel Mbarga',
    roleOrCity: 'Yaoundé, Cameroun',
    rating: 5,
    comment:
      'Grâce à La Gloire de Dieu, notre petite assemblée a reçu des Bibles et un soutien précieux. Un ministère sérieux, transparent et plein d’amour.',
    commentEn:
      'Thanks to La Gloire de Dieu, our small congregation received Bibles and precious support. A serious, transparent and loving ministry.',
    date: '2026-10-10',
    approved: true
  },
  {
    id: 'demo-rev-2',
    name: 'Sœur Chantal Ayissi',
    roleOrCity: 'Douala, Cameroun',
    rating: 5,
    comment:
      'Les enseignements et les temps de prière m’ont fortifiée dans la foi. Que le Seigneur bénisse abondamment cette œuvre.',
    commentEn:
      'The teachings and prayer times have strengthened my faith. May the Lord richly bless this work.',
    date: '2026-10-05',
    approved: true
  },
  {
    id: 'demo-rev-3',
    name: 'Frère Samuel Fotso',
    roleOrCity: 'Bruxelles, Belgique',
    rating: 5,
    comment:
      'Voir l’aide arriver jusqu’aux familles dans le besoin m’a profondément touché. Merci pour votre fidélité et votre dévouement.',
    commentEn:
      'Seeing the help reach families in need touched me deeply. Thank you for your faithfulness and dedication.',
    date: '2026-09-28',
    approved: true
  },
  {
    id: 'demo-rev-4',
    name: 'Esther Ndzana',
    roleOrCity: 'Paris, France',
    rating: 5,
    comment:
      'Une communauté accueillante, une vision claire et une vraie transparence. Je suis fière de soutenir cette mission chaque mois.',
    commentEn:
      'A welcoming community, a clear vision and real transparency. I am proud to support this mission every month.',
    date: '2026-09-19',
    approved: true
  }
];

export const DEMO_MEMBERS: CommunityMember[] = [
  { id: 'm1', name: 'Marie-Claire Nguema', avatar: '/demo/members/marie-claire.png' },
  { id: 'm2', name: 'Emmanuel Tchoumi', avatar: '/demo/members/emmanuel.png' },
  { id: 'm3', name: 'Grâce Mbarga', avatar: '/demo/members/grace.png' },
  { id: 'm4', name: 'Jean-Paul Kouam', avatar: '/demo/members/jean-paul.png' },
  { id: 'm5', name: 'Esther Ndzana', avatar: '/demo/members/esther.png' },
  { id: 'm6', name: 'Samuel Fotso', avatar: '/demo/members/samuel.png' },
  { id: 'm7', name: 'Chantal Ayissi', avatar: '/demo/members/chantal.png' },
  { id: 'm8', name: 'David Onana', avatar: '/demo/members/david.png' }
];
