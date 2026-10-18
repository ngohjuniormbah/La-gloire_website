// Admin page texts (French / English).
const fr = {
  brand: 'Administration',
  viewSite: 'Voir le site',
  logout: 'Se déconnecter',

  loginTitle: 'Espace administration',
  loginIntro: 'Saisissez le mot de passe administrateur.',
  password: 'Mot de passe',
  unlock: 'Se connecter',
  wrongPassword: 'Mot de passe incorrect.',
  tooManyAttempts: 'Trop de tentatives. Réessayez dans quelques minutes.',

  tabs: {
    photos: 'Photos',
    videos: 'Vidéos',
    pdfs: 'PDF',
    missions: 'Missions',
    reviews: 'Témoignages',
    inbox: 'Réception',
    settings: 'Coordonnées'
  },

  loading: 'Chargement…',
  save: 'Enregistrer',
  saved: 'Enregistré.',
  publish: 'Publier',
  publishing: 'Publication…',
  published: 'Publié.',
  deleted: 'Supprimé.',
  remove: 'Supprimer',
  confirmDelete: 'Supprimer définitivement cet élément ?',
  exportCsv: 'Exporter en CSV',
  open: 'Ouvrir',
  optional: 'facultatif',

  titleFr: 'Titre (français)',
  titleEn: 'Titre (anglais)',
  descFr: 'Description (français)',
  descEn: 'Description (anglais)',
  englishFallback: 'Si vide, le titre français est utilisé.',

  sourceLink: 'Lien',
  sourceDevice: 'Depuis l’appareil',
  linkLabel: 'Adresse du lien',
  linkPlaceholder: 'https://…',
  chooseFile: 'Choisir un fichier',
  changeFile: 'Changer de fichier',
  uploading: 'Envoi en cours…',
  uploadDone: 'Fichier envoyé',
  noFile: 'Aucun fichier choisi',
  fromLink: 'Lien',
  fromUpload: 'Fichier envoyé',

  errNetwork: 'Connexion au serveur impossible.',
  errTooLarge: (mb: number) => `Fichier trop volumineux (maximum ${mb} Mo).`,
  errType: 'Ce type de fichier n’est pas accepté.',
  errGeneric: 'Une erreur est survenue. Réessayez.',
  errNeedSource: 'Ajoutez un lien ou un fichier.',
  errSessionExpired: 'Session expirée. Reconnectez-vous.',

  photos: {
    title: 'Photos',
    intro: 'Les photos publiées apparaissent dans la galerie de la page d’accueil.',
    addTitle: 'Ajouter une photo',
    listTitle: 'Photos publiées',
    empty: 'Aucune photo publiée.'
  },
  videos: {
    title: 'Vidéos',
    intro: 'Collez un lien (YouTube, Vimeo, lien direct) ou envoyez une vidéo depuis l’appareil.',
    addTitle: 'Ajouter une vidéo',
    listTitle: 'Vidéos publiées',
    empty: 'Aucune vidéo publiée.'
  },
  pdfs: {
    title: 'Documents PDF',
    intro: 'Livres, manuels et documents à lire ou à télécharger sur la page « Nous suivre ».',
    addTitle: 'Ajouter un PDF',
    listTitle: 'PDF publiés',
    empty: 'Aucun PDF publié.'
  },

  missions: {
    title: 'Missions',
    intro: 'Les missions s’affichent sur la page d’accueil et dans le formulaire de don.',
    addTitle: 'Ajouter une mission',
    listTitle: 'Missions publiées',
    empty: 'Aucune mission publiée.',
    location: 'Lieu',
    target: 'Objectif (FCFA)',
    raised: 'Montant collecté (FCFA)',
    cover: 'Image de couverture',
    update: 'Mettre à jour'
  },

  reviews: {
    title: 'Témoignages',
    intro: 'Les témoignages envoyés par les visiteurs sont publiés après votre validation.',
    empty: 'Aucun témoignage reçu.',
    pending: 'En attente',
    live: 'Publié',
    approve: 'Publier',
    unpublish: 'Retirer'
  },

  inbox: {
    title: 'Réception',
    messages: 'Messages',
    donations: 'Dons',
    members: 'Membres',
    emptyMessages: 'Aucun message reçu.',
    emptyDonations: 'Aucune intention de don reçue.',
    emptyMembers: 'Aucun membre inscrit.',
    status: 'Statut',
    msgNew: 'Nouveau',
    msgReplied: 'Répondu',
    msgArchived: 'Archivé',
    donPending: 'À contacter',
    donProcessing: 'En cours',
    donCompleted: 'Terminé',
    colReference: 'Référence',
    colName: 'Nom',
    colContact: 'Contact',
    colPlace: 'Lieu',
    colProject: 'Projet',
    colDate: 'Date',
    colNumber: 'N° membre',
    general: 'Fonds général'
  },

  settings: {
    title: 'Coordonnées',
    intro: 'Ces informations s’affichent dans le pied de page et sur les pages d’accueil et contact.',
    churchName: 'Nom de l’église',
    address: 'Adresse',
    cityCountry: 'Ville et pays',
    phone: 'Téléphone',
    prayerLine: 'Ligne de prière',
    email: 'Courriel'
  }
};

const en: typeof fr = {
  brand: 'Administration',
  viewSite: 'View site',
  logout: 'Sign out',

  loginTitle: 'Admin area',
  loginIntro: 'Enter the administrator password.',
  password: 'Password',
  unlock: 'Sign in',
  wrongPassword: 'Incorrect password.',
  tooManyAttempts: 'Too many attempts. Try again in a few minutes.',

  tabs: {
    photos: 'Photos',
    videos: 'Videos',
    pdfs: 'PDF',
    missions: 'Missions',
    reviews: 'Testimonials',
    inbox: 'Inbox',
    settings: 'Contact info'
  },

  loading: 'Loading…',
  save: 'Save',
  saved: 'Saved.',
  publish: 'Publish',
  publishing: 'Publishing…',
  published: 'Published.',
  deleted: 'Deleted.',
  remove: 'Delete',
  confirmDelete: 'Permanently delete this item?',
  exportCsv: 'Export CSV',
  open: 'Open',
  optional: 'optional',

  titleFr: 'Title (French)',
  titleEn: 'Title (English)',
  descFr: 'Description (French)',
  descEn: 'Description (English)',
  englishFallback: 'If empty, the French title is used.',

  sourceLink: 'Link',
  sourceDevice: 'From device',
  linkLabel: 'Link address',
  linkPlaceholder: 'https://…',
  chooseFile: 'Choose a file',
  changeFile: 'Change file',
  uploading: 'Uploading…',
  uploadDone: 'File uploaded',
  noFile: 'No file chosen',
  fromLink: 'Link',
  fromUpload: 'Uploaded file',

  errNetwork: 'Cannot reach the server.',
  errTooLarge: (mb: number) => `File too large (maximum ${mb} MB).`,
  errType: 'This file type is not accepted.',
  errGeneric: 'Something went wrong. Please try again.',
  errNeedSource: 'Add a link or a file.',
  errSessionExpired: 'Session expired. Please sign in again.',

  photos: {
    title: 'Photos',
    intro: 'Published photos appear in the gallery on the home page.',
    addTitle: 'Add a photo',
    listTitle: 'Published photos',
    empty: 'No photos published yet.'
  },
  videos: {
    title: 'Videos',
    intro: 'Paste a link (YouTube, Vimeo, direct link) or upload a video from your device.',
    addTitle: 'Add a video',
    listTitle: 'Published videos',
    empty: 'No videos published yet.'
  },
  pdfs: {
    title: 'PDF documents',
    intro: 'Books, manuals and documents to read or download on the “Follow Us” page.',
    addTitle: 'Add a PDF',
    listTitle: 'Published PDFs',
    empty: 'No PDFs published yet.'
  },

  missions: {
    title: 'Missions',
    intro: 'Missions appear on the home page and in the donation form.',
    addTitle: 'Add a mission',
    listTitle: 'Published missions',
    empty: 'No missions published yet.',
    location: 'Location',
    target: 'Goal (FCFA)',
    raised: 'Amount raised (FCFA)',
    cover: 'Cover image',
    update: 'Update'
  },

  reviews: {
    title: 'Testimonials',
    intro: 'Testimonials sent by visitors are published once you approve them.',
    empty: 'No testimonials received yet.',
    pending: 'Pending',
    live: 'Published',
    approve: 'Publish',
    unpublish: 'Unpublish'
  },

  inbox: {
    title: 'Inbox',
    messages: 'Messages',
    donations: 'Donations',
    members: 'Members',
    emptyMessages: 'No messages received yet.',
    emptyDonations: 'No donation intents received yet.',
    emptyMembers: 'No members registered yet.',
    status: 'Status',
    msgNew: 'New',
    msgReplied: 'Replied',
    msgArchived: 'Archived',
    donPending: 'To contact',
    donProcessing: 'In progress',
    donCompleted: 'Completed',
    colReference: 'Reference',
    colName: 'Name',
    colContact: 'Contact',
    colPlace: 'Location',
    colProject: 'Project',
    colDate: 'Date',
    colNumber: 'Member no.',
    general: 'General fund'
  },

  settings: {
    title: 'Contact info',
    intro: 'Shown in the footer and on the home and contact pages.',
    churchName: 'Church name',
    address: 'Address',
    cityCountry: 'City and country',
    phone: 'Phone',
    prayerLine: 'Prayer line',
    email: 'Email'
  }
};

export const adminText = { fr, en };
export type AdminText = typeof fr;
