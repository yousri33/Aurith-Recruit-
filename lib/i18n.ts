// Simple i18n system for Aurith Recruit
// FR (French) is the default language, EN (English) as secondary

export type Language = 'fr' | 'en'

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.library': 'Bibliothèque CV',
    'nav.pipeline': 'Analyses IA',
    'nav.results': 'Historique',
    'nav.jobs': 'Analyses',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.features': 'Solutions',
    'nav.pricing': 'Tarifs',
    'nav.lang_fr': 'FR',
    'nav.lang_en': 'EN',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bienvenue, {name}',
    'dashboard.folders': 'Dossiers',
    'dashboard.candidates': 'Candidats',
    'dashboard.avg_score': 'Score moyen',
    'dashboard.pipelines': 'Pipelines complétés',
    'dashboard.recent_activity': 'Activité récente',
    'dashboard.no_activity': 'Aucune activité récente',

    // CV Library
    'library.title': 'Bibliothèque CV',
    'library.empty': 'Aucun dossier. Créez-en un pour commencer.',
    'library.create_folder': 'Créer un dossier',
    'library.folder_name': 'Nom du dossier',
    'library.job_title': 'Titre de l\'emploi',
    'library.upload_cv': 'Importer des CV',
    'library.drag_drop': 'Glissez-déposez vos fichiers ici ou cliquez pour sélectionner',
    'library.upload_csv': 'Importer CSV',
    'library.upload_pdf': 'Importer PDF',
    'library.delete_folder': 'Supprimer le dossier',
    'library.edit_folder': 'Modifier le dossier',
    'library.view_candidates': 'Voir les candidats',
    'library.no_candidates': 'Aucun candidat dans ce dossier',

    // Pipeline
    'pipeline.title': 'Pipeline IA',
    'pipeline.select_folder': 'Sélectionner un dossier',
    'pipeline.job_title': 'Titre de l\'emploi',
    'pipeline.job_description': 'Description de l\'emploi',
    'pipeline.required_skills': 'Compétences requises',
    'pipeline.years_experience': 'Années d\'expérience requises',
    'pipeline.language': 'Langue',
    'pipeline.run_analysis': 'Lancer l\'analyse IA',
    'pipeline.processing': 'Analyse en cours...',
    'pipeline.step1': 'Étape 1: Dossier',
    'pipeline.step2': 'Étape 2: Détails',
    'pipeline.step3': 'Étape 3: Confirmation',

    // Results
    'results.title': 'Résultats',
    'results.ranking': 'Classement',
    'results.candidate': 'Candidat',
    'results.score': 'Score',
    'results.skills': 'Compétences',
    'results.gaps': 'Lacunes',
    'results.export_csv': 'Exporter CSV',
    'results.export_pdf': 'Exporter PDF',
    'results.no_results': 'Aucun résultat. Exécutez un pipeline d\'abord.',
    'results.candidate_details': 'Détails du candidat',
    'results.education': 'Formation',
    'results.experience': 'Expérience',
    'results.flags': 'Signalements',

    // Auth
    'auth.email': 'E-mail',
    'auth.password': 'Mot de passe',
    'auth.confirm_password': 'Confirmer le mot de passe',
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.sign_in': 'Connexion',
    'auth.sign_up': 'Commencer',
    'auth.no_account': 'Pas encore de compte ?',
    'auth.have_account': 'Vous avez déjà un compte ?',
    'auth.name': 'Nom complet',

    // Landing
    'landing.hero_title': 'Recrutez les meilleurs talents avec l\'IA',
    'landing.hero_subtitle': 'Aurith Recruit utilise l\'IA pour analyser automatiquement les CV et classer les candidats.',
    'landing.cta_button': 'Commencer maintenant',
    'landing.feature1_title': 'Gestion des CV simplifiée',
    'landing.feature1_desc': 'Organisez vos CV en dossiers par campagne et gérez facilement vos candidats.',
    'landing.feature2_title': 'Analyse IA automatique',
    'landing.feature2_desc': 'Notre IA extrait les compétences, l\'éducation et l\'expérience de chaque candidat.',
    'landing.feature3_title': 'Résultats classés et filtres',
    'landing.feature3_desc': 'Obtenez un classement automatique basé sur la correspondance avec la description de l\'emploi.',

    // Common
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur s\'est produite',
    'common.success': 'Succès!',
    'common.cv_uploaded': 'CV importé avec succès',
    'common.pipeline_started': 'Pipeline lancé avec succès',
    'common.exported': 'Exportation réussie',
    'common.contact': 'Contact',
    'common.phone': 'Téléphone',
    'common.university': 'Université',
    'common.major': 'Spécialisation',
    'common.education_short': 'Formation',
    'common.why_candidate': 'Pourquoi ce candidat ?',
    'common.ai_analysis': 'Analyse Stratégique',
    'common.view_cv': 'Voir le CV Original',
    'common.hide_cv': 'Masquer le CV',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.library': 'CV Library',
    'nav.pipeline': 'AI Analyses',
    'nav.results': 'History',
    'nav.jobs': 'Analyses',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.lang_fr': 'FR',
    'nav.lang_en': 'EN',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome, {name}',
    'dashboard.folders': 'Folders',
    'dashboard.candidates': 'Candidates',
    'dashboard.avg_score': 'Average Score',
    'dashboard.pipelines': 'Completed Pipelines',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.no_activity': 'No recent activity',

    // CV Library
    'library.title': 'CV Library',
    'library.empty': 'No folders. Create one to get started.',
    'library.create_folder': 'Create Folder',
    'library.folder_name': 'Folder Name',
    'library.job_title': 'Job Title',
    'library.upload_cv': 'Upload CVs',
    'library.drag_drop': 'Drag and drop your files here or click to select',
    'library.upload_csv': 'Import CSV',
    'library.upload_pdf': 'Import PDF',
    'library.delete_folder': 'Delete Folder',
    'library.edit_folder': 'Edit Folder',
    'library.view_candidates': 'View Candidates',
    'library.no_candidates': 'No candidates in this folder',

    // Pipeline
    'pipeline.title': 'AI Pipeline',
    'pipeline.select_folder': 'Select Folder',
    'pipeline.job_title': 'Job Title',
    'pipeline.job_description': 'Job Description',
    'pipeline.required_skills': 'Required Skills',
    'pipeline.years_experience': 'Years of Experience Required',
    'pipeline.language': 'Language',
    'pipeline.run_analysis': 'Run AI Analysis',
    'pipeline.processing': 'Processing...',
    'pipeline.step1': 'Step 1: Folder',
    'pipeline.step2': 'Step 2: Details',
    'pipeline.step3': 'Step 3: Confirm',

    // Results
    'results.title': 'Results',
    'results.ranking': 'Ranking',
    'results.candidate': 'Candidate',
    'results.score': 'Score',
    'results.skills': 'Skills',
    'results.gaps': 'Gaps',
    'results.export_csv': 'Export CSV',
    'results.export_pdf': 'Export PDF',
    'results.no_results': 'No results. Run a pipeline first.',
    'results.candidate_details': 'Candidate Details',
    'results.education': 'Education',
    'results.experience': 'Experience',
    'results.flags': 'Flags',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.sign_in': 'Login',
    'auth.sign_up': 'Get Started',
    'auth.no_account': 'Don\'t have an account?',
    'auth.have_account': 'Already have an account?',
    'auth.name': 'Full Name',

    // Landing
    'landing.hero_title': 'Hire Top Talent with AI',
    'landing.hero_subtitle': 'Aurith Recruit uses AI to automatically analyze CVs and rank candidates.',
    'landing.cta_button': 'Get Started',
    'landing.feature1_title': 'Simplified CV Management',
    'landing.feature1_desc': 'Organize your CVs into folders by campaign and easily manage your candidates.',
    'landing.feature2_title': 'Automatic AI Analysis',
    'landing.feature2_desc': 'Our AI extracts skills, education, and experience from every candidate.',
    'landing.feature3_title': 'Ranked Results & Filters',
    'landing.feature3_desc': 'Get an automatic ranking based on job description match.',

    // Common
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.cv_uploaded': 'CV uploaded successfully',
    'common.pipeline_started': 'Pipeline started successfully',
    'common.exported': 'Export successful',
    'common.contact': 'Contact',
    'common.phone': 'Phone',
    'common.university': 'University',
    'common.major': 'Major',
    'common.education_short': 'Education',
    'common.why_candidate': 'Why this candidate?',
    'common.ai_analysis': 'Strategic Analysis',
    'common.view_cv': 'View Original CV',
    'common.hide_cv': 'Hide CV',
  },
}

// Simple translation helper
export function t(key: string, lang: Language = 'fr', replacements?: Record<string, string>): string {
  let text = translations[lang][key] || translations['en'][key] || key

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, value)
    })
  }

  return text
}

// Get all translations for a language
export function getTranslations(lang: Language) {
  return translations[lang]
}

export function getStoredLanguage(): 'fr' | 'en' {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('aurith_language') as 'fr' | 'en' | null
  return stored && ['fr', 'en'].includes(stored) ? stored : 'en'
}

export function setStoredLanguage(lang: 'fr' | 'en') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurith_language', lang)
  }
}
