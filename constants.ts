import { Product, ProductType, CourseContent } from './types';

export const APP_NAME = 'SerrureMaster';
export const LOGO_URL = '/logo.png'; // Assurez-vous d'avoir un fichier logo.png à la racine
export const DEFAULT_HERO_IMAGE = '/images/p1.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'p1_door_slammed',
    title: 'Urgence : Porte Claquée',
    description:
      'Un plan structuré pour analyser une porte claquée, comprendre les techniques professionnelles d’ouverture fine et éviter les erreurs irréversibles. Économisez jusqu’à 400€ de dépannage en tentant l’intervention dans le cadre légal et technique approprié.',
    price: 100,
    originalPrice: 500,
    features: [
      'Vidéo HD : technique professionnelle sans perçage',
      'PDF Diagnostic : vérifier si la porte est réellement claquée',
      'Guide pratique : gestes autorisés / gestes interdits',
      'Assistance WhatsApp incluse (validation ou STOP immédiat)',
    ],
    compatibility: {
      valid: ['Porte claquée (non verrouillée)', 'Porte blindée claquée sans verrouillage'],
      invalid: ['Porte fermée à clé (verrouillée)'],
    },
    type: ProductType.BUNDLE,
    image: '/images/p1.jpg',
    stripePriceId: 'price_1PqXyZA2eZvKYlo2kR9uWq5a',
    // MOCK RESOURCE: PUBLISHED
    currentResource: {
      id: 'res_p1_v1',
      productId: 'p1_door_slammed',
      fileName: 'Guide_Ouverture_Radio_Pro_v1.pdf',
      filePath: 'secure-pdfs/p1/guide.pdf',
      fileSize: '2.4 MB',
      status: 'published',
      version: 1,
      lastUpdated: '2023-11-15T10:00:00Z',
    },
  },
  {
    id: 'p2_key_broken',
    title: 'Clé Cassée dans le Barillet',
    description:
      'Formation vidéo pour comprendre comment tenter une extraction sécurisée du fragment cassé, sans aggraver le blocage. Identifiez quand intervenir et quand arrêter pour préserver votre cylindre. Assistance WhatsApp pour validation visuelle.',
    price: 100,
    originalPrice: 500,
    features: [
      'Vidéo HD : protocole d’extraction sécurisé',
      'Guide PDF : cas autorisés / cas interdits',
      'Section “STOP” : quand ne surtout pas insister',
      'Assistance WhatsApp incluse (validation sur photo)',
    ],
    compatibility: {
      valid: ['Clé cassée visible ou accessible'],
      invalid: ['Cylindre bloqué ou endommagé', 'Tentative déjà forcée'],
    },
    type: ProductType.BUNDLE,
    image: '/images/p2.jpg',
    stripePriceId: 'price_1PqXzQB2eZvKYlo2mL8vTq4b',
    // MOCK RESOURCE: DRAFT (Waiting for validation)
    currentResource: {
      id: 'res_p2_v1_draft',
      productId: 'p2_key_broken',
      fileName: 'Guide_Extraction_Key_DRAFT.pdf',
      filePath: 'secure-pdfs/p2/draft.pdf',
      fileSize: '1.8 MB',
      status: 'draft',
      version: 0.9,
      lastUpdated: '2023-12-20T14:30:00Z',
    },
  },
  {
    id: 'p3_cylinder_replace',
    title: 'Remplacer son Cylindre',
    description:
      'Tutoriel technique pour changer un cylindre standard sans erreur de mesure ni main-d’œuvre excessive. Comprendre les dimensions critiques, les outils nécessaires et les pièges à éviter. Idéal après emménagement ou mise à niveau de sécurité.',
    price: 100,
    originalPrice: 500,
    features: [
      'Tutoriel vidéo : démontage sécurisé',
      'PDF mesures exactes (intérieur / extérieur)',
      'Checklist outils nécessaires (basiques)',
      'Assistance WhatsApp en cas de doute',
    ],
    compatibility: {
      valid: ['Cylindre standard'],
      invalid: ['Serrure spécifique ou système complexe'],
    },
    type: ProductType.VIDEO,
    image: '/images/p3.jpg',
    stripePriceId: 'price_1PqY1RC2eZvKYlo2nN7wUr3c',
    // NO RESOURCE (Admin needs to upload)
    currentResource: null,
  },
  {
    id: 'p4_security_pack',
    title: 'Changer sa Serrure Complète',
    description:
      'Formation complète pour remplacer une serrure entière sans main-d’œuvre professionnelle. Maîtrisez les mesures précises, le démontage sécurisé et les critères de sélection certifiés. Gain immédiat en autonomie et budget.',
    price: 100,
    originalPrice: 500,
    features: [
      'Mesure précise avant achat',
      'Démontage & remontage pas à pas (Vidéo)',
      'Guide d’achat : critères A2P (sans marque imposée)',
      'Assistance WhatsApp incluse',
    ],
    compatibility: {
      valid: ['Remplacement simple'],
      invalid: ['Travaux lourds ou structurels'],
    },
    type: ProductType.BUNDLE,
    image: '/images/p4.jpg',
    stripePriceId: 'price_1PqY2SD2eZvKYlo2oP6xVs2d',
    currentResource: {
      id: 'res_p4_v2',
      productId: 'p4_security_pack',
      fileName: 'Tuto_Remplacement_Serrure_v2.pdf',
      filePath: 'secure-pdfs/p4/guide.pdf',
      fileSize: '3.1 MB',
      status: 'published',
      version: 2,
      lastUpdated: '2023-10-05T09:00:00Z',
    },
  },
  {
    id: 'p5_audit_security',
    title: 'Audit Sécurité & Renforcement',
    description:
      'Méthodologie professionnelle pour évaluer vos vulnérabilités et prioriser les renforcements efficaces sans travaux lourds. Obtenez un plan d’action personnalisé avec budget maîtrisé et assistance technique pour validation à distance.',
    price: 100,
    originalPrice: 500,
    features: [
      'Audit guidé (photos + questionnaire)',
      'Plan d’action priorisé (24h / 7j / 30j)',
      'Budget maîtrisé & erreurs à éviter',
      'Assistance WhatsApp de validation',
    ],
    compatibility: {
      valid: ['Logement ou local standard'],
      invalid: ['Travaux de blindage structurel'],
    },
    type: ProductType.BUNDLE,
    image: '/images/p5.jpg',
    stripePriceId: 'price_1PqY3TE2eZvKYlo2qR5yWt1e',
    currentResource: null,
  },
  {
    id: 'p6_survival_kit',
    title: 'Pack : Kit de Prévention',
    description:
      'Sélection professionnelle du matériel indispensable pour gérer les situations courantes sans stress. Liste vérifiée, liens d’achat directs, aucun gadget inutile. Économie immédiate garantie.',
    price: 29,
    originalPrice: 145,
    features: [
      'Liens d’achat directs (qualité pro)',
      'Matériel réellement utile (pas de gadgets)',
      'Économie immédiate',
    ],
    type: ProductType.BUNDLE,
    image: '/images/p6.jpg',
    stripePriceId: 'price_1PqY4UF2eZvKYlo2rS4zXu0f',
    currentResource: {
      id: 'res_p6_kit',
      productId: 'p6_survival_kit',
      fileName: 'Liste_Materiel_Pro.pdf',
      filePath: 'secure-pdfs/p6/list.pdf',
      fileSize: '0.5 MB',
      status: 'published',
      version: 1,
      lastUpdated: '2023-09-01T12:00:00Z',
    },
  },
];

export const MOCK_USER_ID = 'user_123_abc';

// --- MOCK CONTENT FOR VIDEO COURSES ---
export const COURSE_CONTENT: Record<string, CourseContent> = {
  p1_door_slammed: {
    productId: 'p1_door_slammed',
    modules: [
      {
        id: 'm1_safety',
        title: 'Module 1 : Analyse & Sécurité (OBLIGATOIRE)',
        status: 'published',
        lessons: [
          {
            id: 'l1_intro',
            title: 'STOP - Diagnostic immédiat',
            duration: '02:15',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'published',
            description:
              "Ne touchez à rien avant d'avoir vérifié ces 3 points cruciaux pour ne pas aggraver la situation.",
            checklist: [
              "Vérifier que la porte n'est pas verrouillée",
              "Vérifier l'état de la poignée",
              "S'assurer d'être le locataire/propriétaire",
            ],
          },
          {
            id: 'l2_legal',
            title: 'Cadre légal & Responsabilité',
            duration: '01:45',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'published',
            description: "Rappel rapide de vos droits et devoirs avant d'intervenir.",
          },
        ],
      },
      {
        id: 'm2_technique',
        title: 'Module 2 : La Technique Radio',
        status: 'published',
        lessons: [
          {
            id: 'l3_tools',
            title: 'Préparer votre outil (Radio ou Bouteille)',
            duration: '03:30',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'published',
            description:
              "Comment découper une bouteille en plastique si vous n'avez pas de radio médicale.",
            checklist: [
              'Découpe propre sans bavure',
              'Taille idéale : 15cm x 10cm',
              'Lubrifiant (Savon/Huile)',
            ],
          },
          {
            id: 'l4_gesture',
            title: 'Le Geste : Angle et Vibration',
            duration: '05:10',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'published',
            description:
              'Le mouvement exact pour faire glisser le pêne. Regardez bien la position des mains.',
            checklist: [
              'Insérer par le bas ou le haut',
              'Faire vibrer la porte',
              'Pousser et tirer simultanément',
            ],
          },
          {
            id: 'l5_double',
            title: 'Cas particulier : Double feuillure',
            duration: '04:00',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'draft', // Exemple de contenu non publié
            description:
              'La technique adaptée pour les portes blindées ou modernes avec décrochement.',
          },
        ],
      },
      {
        id: 'm3_troubleshoot',
        title: "Module 3 : En cas d'échec",
        status: 'published',
        lessons: [
          {
            id: 'l6_errors',
            title: 'Les 3 erreurs qui bloquent tout',
            duration: '02:50',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'published',
            description: "Si ça ne s'ouvre pas, c'est probablement à cause de l'un de ces détails.",
          },
          {
            id: 'l7_abandon',
            title: 'Quand faut-il abandonner ?',
            duration: '01:30',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            provider: 'native',
            status: 'published',
            description: "Savoir s'arrêter avant de casser la serrure et que ça coûte 1000€.",
          },
        ],
      },
    ],
  },
};
