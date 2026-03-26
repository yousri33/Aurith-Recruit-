// i18n.ts — Translation system for Aurith Recruit

type Language = 'en' | 'fr'

const translations: Record<string, Record<Language, string>> = {
  // Auth
  'auth.email': { en: 'Email', fr: 'E-mail' },
  'auth.password': { en: 'Password', fr: 'Mot de passe' },
  'auth.confirm_password': { en: 'Confirm Password', fr: 'Confirmer le mot de passe' },
  'auth.name': { en: 'Full Name', fr: 'Nom complet' },
  'auth.login': { en: 'Log In', fr: 'Se connecter' },
  'auth.sign_up': { en: 'Sign Up', fr: "S'inscrire" },
  'auth.sign_in': { en: 'Sign In', fr: 'Se connecter' },

  // Navigation
  'nav.dashboard': { en: 'Dashboard', fr: 'Tableau de bord' },
  'nav.library': { en: 'Library', fr: 'Bibliothèque' },
  'nav.pipeline': { en: 'Pipeline', fr: 'Pipeline' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },
  'nav.features': { en: 'Features', fr: 'Fonctionnalités' },
  'nav.pricing': { en: 'Pricing', fr: 'Tarifs' },
  'nav.logout': { en: 'Logout', fr: 'Déconnexion' },
  'nav.lang_en': { en: 'English', fr: 'Anglais' },
  'nav.lang_fr': { en: 'French', fr: 'Français' },

  // Landing page
  'landing.hero_title': { en: 'Aurith Recruit', fr: 'Aurith Recruit' },
  'landing.hero_subtitle': {
    en: 'AI-powered recruitment that eliminates manual screening, saves thousands of hours, and lets your team focus on what matters — hiring the right people.',
    fr: "Recrutement dopé à l'IA qui élimine le tri manuel, économise des milliers d'heures et permet à votre équipe de se concentrer sur ce qui compte — embaucher les bons profils.",
  },
  'landing.cta_button': { en: 'Get Started', fr: 'Commencer' },

  // Feature 1 — Human Cost
  'landing.feature1_title': {
    en: 'The Human Cost Is Real',
    fr: 'Le Coût Humain Est Réel',
  },
  'landing.feature1_desc': {
    en: "HR teams spend 70% of their time on repetitive, low-value tasks — manually reading CVs, copy-pasting data, and sending follow-ups. Time is money, and every wasted hour is revenue lost. Aurith Recruit automates the grind so your team stops bleeding cost.",
    fr: "Les équipes RH passent 70 % de leur temps sur des tâches répétitives à faible valeur ajoutée — lire manuellement des CV, copier-coller des données, envoyer des relances. Le temps c'est de l'argent, et chaque heure gaspillée est une perte directe. Aurith Recruit automatise tout cela.",
  },

  // Feature 2 — Scalability
  'landing.feature2_title': {
    en: 'Built to Scale With You',
    fr: 'Conçu Pour Évoluer Avec Vous',
  },
  'landing.feature2_desc': {
    en: "Whether you process 10 or 10,000 CVs a month, Aurith Recruit handles it effortlessly. No hiring bottlenecks, no growing pains — your recruitment capacity scales instantly as your business grows.",
    fr: "Que vous traitiez 10 ou 10 000 CV par mois, Aurith Recruit le gère sans effort. Aucun goulot d'étranglement, aucune douleur de croissance — votre capacité de recrutement s'adapte instantanément.",
  },

  // Feature 3 — Analytics
  'landing.feature3_title': {
    en: 'Data-Driven Decisions',
    fr: 'Décisions Basées sur les Données',
  },
  'landing.feature3_desc': {
    en: 'Get instant AI scores, match percentages, and ranked shortlists for every role. Replace gut-feeling hiring with objective, consistent analysis backed by real data.',
    fr: "Obtenez des scores IA instantanés, des pourcentages de correspondance et des listes de candidats classées pour chaque poste. Remplacez l'intuition par une analyse objective et cohérente.",
  },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome back', fr: 'Bon retour' },
  'dashboard.candidates': { en: 'Candidates', fr: 'Candidats' },
  'dashboard.folders': { en: 'Folders', fr: 'Dossiers' },
  'dashboard.pipelines': { en: 'Pipelines', fr: 'Pipelines' },
  'dashboard.avg_score': { en: 'Avg. AI Score', fr: 'Score IA moy.' },
  'dashboard.recent_activity': { en: 'Recent Activity', fr: 'Activité récente' },

  // Library
  'library.title': { en: 'CV Library', fr: 'Bibliothèque de CV' },
  'library.create_folder': { en: 'Create Folder', fr: 'Créer un dossier' },
  'library.upload_cv': { en: 'Upload CV', fr: 'Importer un CV' },
  'library.upload_pdf': { en: 'Upload PDF', fr: 'Importer PDF' },
  'library.drag_drop': { en: 'Drag & drop PDFs here', fr: 'Glissez-déposez des PDF ici' },
  'library.no_candidates': { en: 'No candidates yet', fr: 'Aucun candidat pour le moment' },
  'library.delete_folder': { en: 'Delete Folder', fr: 'Supprimer le dossier' },
  'library.view_candidates': { en: 'View Candidates', fr: 'Voir les candidats' },

  // Pipeline
  'pipeline.title': { en: 'AI Pipeline', fr: 'Pipeline IA' },
  'pipeline.job_title': { en: 'Job Title', fr: "Intitulé du poste" },
  'pipeline.job_description': { en: 'Job Description', fr: 'Description du poste' },
  'pipeline.required_skills': { en: 'Required Skills', fr: 'Compétences requises' },
  'pipeline.years_experience': { en: 'Years of Experience', fr: "Années d'expérience" },
  'pipeline.select_folder': { en: 'Select Folder', fr: 'Sélectionner un dossier' },
  'pipeline.run_analysis': { en: 'Run AI Analysis', fr: "Lancer l'analyse IA" },
  'pipeline.processing': { en: 'Processing…', fr: 'Traitement en cours…' },

  // Results
  'results.title': { en: 'Results', fr: 'Résultats' },
  'results.candidate': { en: 'Candidate', fr: 'Candidat' },
  'results.score': { en: 'AI Score', fr: 'Score IA' },

  // Settings
  'settings.profile': { en: 'Profile', fr: 'Profil' },
  'settings.organization': { en: 'Organization', fr: 'Organisation' },
  'settings.notifications': { en: 'Notifications', fr: 'Notifications' },

  // Common
  'common.loading': { en: 'Loading…', fr: 'Chargement…' },
  'common.error': { en: 'An error occurred', fr: 'Une erreur est survenue' },
  'common.success': { en: 'Success!', fr: 'Succès !' },
  'common.save': { en: 'Save', fr: 'Enregistrer' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler' },
  'common.contact': { en: 'Contact', fr: 'Contact' },
  'common.ai_analysis': { en: 'AI Analysis', fr: 'Analyse IA' },
  'common.cv_uploaded': { en: 'CV Uploaded', fr: 'CV importé' },
  'common.education_short': { en: 'Education', fr: 'Formation' },
  'common.why_candidate': { en: 'Why this candidate?', fr: 'Pourquoi ce candidat ?' },
}

// Translate a key to the target language
export function t(key: string, language: Language): string {
  const entry = translations[key]
  if (!entry) {
    console.warn(`[i18n] Missing translation key: "${key}"`)
    return key
  }
  return entry[language] ?? entry['en'] ?? key
}

// Persist language preference
const LANG_KEY = 'aurith_language'

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(LANG_KEY)
  if (stored === 'fr' || stored === 'en') return stored
  return 'en'
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LANG_KEY, lang)
}
