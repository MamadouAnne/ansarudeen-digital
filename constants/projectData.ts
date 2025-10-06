import { Project } from '@/types/project';

export const MEDINA_BAYE_PROJECT: Project = {
  id: 'medina-baye-city',
  title: 'MEDINA BAYE CITY',
  subtitle: 'Projet de création d\'une nouvelle cité d\'appui à Médina Baye',
  description: 'Un projet ambitieux visant à créer une ville moderne et durable à proximité de Médina Baye pour rehausser ses capacités d\'accueil à la hauteur de son rayonnement international.',
  coverImage: 'https://images.unsplash.com/photo-1564769610726-4548e2683ef3?w=1200&auto=format&fit=crop',
  galleryImages: [
    'https://images.unsplash.com/photo-1564769610726-4548e2683ef3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop',
  ],
  location: 'Commune de Mbadakhoune, Kaolack, Sénégal',
  area: '1000 hectares',
  distance: '10 km de Médina Baye • 10 km de l\'aéroport de Kaolack • Proximité autoroute Dakar-Kaolack',
  mainObjective: 'Rehausser les capacités d\'accueil et de services de Médina Baye à la hauteur de son rayonnement international.',
  objectives: [
    {
      id: '1',
      title: 'Nouvelle Cité Moderne',
      description: 'Aménager une nouvelle cité d\'appui à Médina Baye, dotée de capacités d\'accueil et d\'équipements de standing international',
    },
    {
      id: '2',
      title: 'Modernisation de Médina Baye',
      description: 'Moderniser le quartier de Médina Baye pour accueillir les pèlerins dans des conditions optimales et faire face à l\'augmentation de l\'affluence',
    },
    {
      id: '3',
      title: 'Promotion du Tourisme Religieux',
      description: 'Promouvoir le tourisme religieux et les investissements directs étrangers, notamment avec le Nigeria (60M+ talibés)',
    },
  ],
  components: [
    {
      id: 'comp1',
      title: 'Composante 1 : Aménagement de la Nouvelle Cité',
      description: 'Une ville durable et intelligente conçue selon un modèle moderne avec toutes les infrastructures et équipements répondant aux enjeux spécifiques de rayonnement et de développement de Médina Baye',
      icon: 'building-2',
      details: [
        'Fonction 1 - Logements diversifiés : Villas, appartements, terrains viabilisés destinés à la clientèle étrangère désirant disposer d\'un logement à proximité de Médina Baye',
        'Fonction 2 - Hébergement : Développement graduel d\'une offre d\'hébergement adaptée à l\'évolution des affluences vers Médina Baye',
        'Fonction 3 - Équipements structurants : Université Islamique Internationale, Résidence Baye Niass (résidence pour le khalife et ses hôtes), Centre culturel, Hôpital international, Daara modernes, Grand cimetière',
        'Fonction 4 - Centre d\'affaires international : Promotion des investissements directs étrangers avec services de facilitation de l\'investissement au Sénégal',
        'Fonction 5 - Relogement : Reloger les familles potentiellement impactées par les travaux de modernisation de Médina Baye',
        'Site idéalement situé : Sur l\'axe ferroviaire Kaolack-Guinguineo, à proximité de l\'autoroute Dakar-Kaolack, site plat avec végétation de type savane clairsemée, facilitant les travaux',
        'Desserte optimale : Connexion avec l\'autoroute à péage Dakar-Kaolack (3 km) et l\'aéroport de Kaolack (10 km), futur aéroport international selon le PNADT',
      ],
    },
    {
      id: 'comp2',
      title: 'Composante 2 : Modernisation de Médina Baye',
      description: 'Restructuration et mise à niveau du cœur de la cité pour améliorer les conditions d\'accueil des pèlerins et permettre de contenir l\'augmentation probable des affluences',
      icon: 'refresh-cw',
      details: [
        'Restructuration du cœur de la cité : Réaménagement de la zone des mausolées et de la grande mosquée, principale zone d\'attraction et point de convergence des milliers de pèlerins',
        'Amélioration de l\'accessibilité : Procéder aux restructurations nécessaires pour une bonne accessibilité au cœur de la cité de Médina Baye',
        'Assainissement optimal : Assurer un système d\'assainissement moderne et performant pour Médina Baye',
        'Voiries et espaces publics : Modernisation de la voirie et des espaces publics pour accueillir dignement les pèlerins',
        'Accompagnement des travaux déjà réalisés : Compléter et optimiser les importants travaux de modernisation menés ces dernières années',
      ],
    },
    {
      id: 'comp3',
      title: 'Composante 3 : Promotion Économique',
      description: 'Stratégie de promotion économique pour créer de la richesse, de l\'emploi et capter les retombées économiques des aménagements prévus',
      icon: 'trending-up',
      details: [
        'Objectif 1 - Desserte aérienne Kaolack-Kano : Promouvoir l\'essor du tourisme religieux entre le Sénégal et le Nigeria en créant une desserte aérienne directe entre Kaolack et Kano (2,684 km, moins de 4h de vol)',
        'Kano : Deuxième ville du Nigeria (4,4M habitants), capitale de l\'État de Kano qui compte la plus grande communauté de talibés Baye au Nigeria (60+ millions)',
        'Gamou de Kano 2022 : Près de 7 millions de pèlerins ont assisté à l\'événement, démontrant la popularité de Baye Niasse au Nigeria',
        'Objectif 2 - Investissement direct étranger : Promouvoir l\'investissement auprès des pèlerins et visiteurs de Médina Baye, qui sont des investisseurs potentiels avec des capacités financières importantes',
        'Les Nigérians sont reconnus pour leur esprit entrepreneurial : Stratégie spécifique d\'accompagnement durant toutes les phases de l\'investissement via le Centre d\'affaires international',
        'Création d\'emplois et de richesses : Développement socio-économique de la métropole de Kaolack et du pôle-territoire du Sine-Saloum',
      ],
    },
  ],
  benefits: [
    {
      id: 'b1',
      title: 'Capacités d\'Accueil Accrues',
      description: 'Augmentation significative des capacités d\'accueil et de l\'attractivité de Médina Baye pour faire face aux affluences lors des événements religieux',
      icon: 'people',
    },
    {
      id: 'b2',
      title: 'Diversification Touristique',
      description: 'Diversification de l\'offre touristique sénégalaise avec l\'essor du tourisme religieux comme nouveau pilier économique',
      icon: 'airplane',
    },
    {
      id: 'b3',
      title: 'Développement Territorial',
      description: 'Développement socio-économique de la métropole d\'équilibre de Kaolack et du pôle-territoire du Sine-Saloum',
      icon: 'business',
    },
    {
      id: 'b4',
      title: 'Rayonnement International',
      description: 'Renforcement du rayonnement international du Sénégal et de l\'intégration africaine, notamment avec le Nigeria et les pays de la sous-région',
      icon: 'globe',
    },
    {
      id: 'b5',
      title: 'Entrée de Devises',
      description: 'Entrée de devises importante et augmentation substantielle des investissements directs étrangers au Sénégal',
      icon: 'cash',
    },
    {
      id: 'b6',
      title: 'Emplois et Richesses',
      description: 'Création massive d\'emplois directs et indirects et génération de richesses pour la communauté locale et nationale',
      icon: 'briefcase',
    },
  ],
  context: `Fondé en 1930, Médina Baye a connu une croissance démographique rapide grâce à son attractivité portée par la FAYDA TIJANIYYA du Grand Maître Cheikh Ibrahim NIASS.

Aujourd'hui, Médina Baye est devenu le quartier le plus influent et le plus attractif de la commune de Kaolack. Son rayonnement dépasse largement nos frontières et s'étend à travers toute l'Afrique et le monde :

• Nigeria : Plus de 60 millions de talibés
• Afrique : Ghana, Niger, Gambie, Tchad, Mauritanie
• Monde : États-Unis, Indonésie, et bien d'autres pays

Chaque année, des pèlerins affluent du monde entier pour célébrer le gamou et effectuer la ziarra au mausolée de Cheikh Ibrahima Niasse. L'attractivité religieuse de la cité ne cesse de croître, constituant un potentiel important de développement pour Kaolack et le Sénégal.

Cependant, la cité est aujourd'hui victime de son succès : problèmes de voirie, forte densité de population, déficit d'assainissement, étroitesse des rues, déficit d'équipements urbains et d'offres de logements. Médina Baye présente des limites pour valoriser son potentiel en tourisme religieux, malgré les efforts de modernisation réalisés ces dernières années.`,
  vision: `Contribuer à la mise en œuvre de la Vision Sénégal 2050 et de la Stratégie nationale de Développement 2025-2029 (SND 2025-2029) en valorisant de manière optimale le patrimoine que représente Baye Niasse.

La nouvelle vision du Président Bassirou Diomaye Diakhar FAYE pour un "Sénégal Souverain, Juste et Prospère" vise à promouvoir un développement endogène et durable porté par des territoires responsabilisés, viables et compétitifs.

Ce projet s'inscrit dans l'Axe 3 "Aménagement et développement durables" et l'Axe 4 "Bonne gouvernance et engagement africain" de la SND 2025-2029. Le renouveau urbain, la promotion des territoires intérieurs avec l'érection des 8 pôles-territoires, le rayonnement du Sénégal et le renforcement de l'intégration africaine constituent des enjeux prioritaires.

Pour valoriser pleinement ce patrimoine, il est impératif de créer une nouvelle cité moderne à proximité de Médina Baye qui pourra combler le déficit d'infrastructures, d'équipements et de capacités d'accueil.`,
  author: {
    name: 'Docteur Serigne DIA',
    title: 'Ex-Directeur de la Planification Spatiale - Agence nationale de l\'Aménagement du territoire (ANAT)\nChef de projet de l\'élaboration du Plan national d\'Aménagement et de Développement territorial (PNADT)',
    contact: 'sdia.anat@gmail.com • Tel : +221 77 091 47 37',
  },
};

// Additional project details
export const PROJECT_GOVERNANCE = {
  portage: {
    title: 'Portage du Projet',
    description: 'Co-portage par Son Excellence Monsieur Bassirou Diomaye Diakhar FAYE, Président de la République du Sénégal et Cheikh MAHI NIASS, Khalife de Médina Baye',
    rationale: 'Ce projet revêt une importance stratégique avec un rayonnement international qui peut impacter significativement le développement socio-économique du Sénégal. L\'implication du Khalife facilite le marketing international et le financement auprès des 60+ millions de talibés à travers le monde.',
  },
  pilotage: {
    title: 'Pilotage du Projet',
    structure: 'Co-pilotage par la SAFRU SA (Société d\'Aménagement Foncier et de Rénovation Urbaine) et la future Fondation "Cheikh Ibrahim Niass Foundation"',
    safru: 'La SAFRU SA a pour mission principale d\'assurer l\'aménagement et l\'équipement des sites devant abriter les programmes immobiliers de l\'État et est compétente en matière de restructuration urbaine',
    fondation: 'La fondation contribuera à la mise en œuvre du projet et facilitera les levées de fonds auprès des millions de talibés de Baye Niasse répartis à travers le monde',
  },
  foncier: {
    title: 'Acquisition du Foncier',
    approche: 'Déclaration d\'utilité publique (même processus que pour le pôle urbain de Diamniadio)',
    justification: 'Projet structurant d\'intérêt national contribuant à la Vision Sénégal 2050 et impulsant le développement de la métropole de Kaolack',
    facilitation: 'Site situé à 10 km de l\'agglomération de Kaolack, n\'abritant pas de zones habitées (uniquement exploitations agricoles sous-pluie), site plat sans contraintes topographiques, végétation de type savane clairsemé',
  },
  financement: {
    title: 'Financement du Projet',
    sources: [
      {
        source: 'Dons via la Cheikh Ibrahim Niass Foundation',
        description: 'Levées de fonds auprès des millions de talibés de Baye Niasse répartis à travers le monde, sous l\'égide du khalife',
      },
      {
        source: 'Valorisation foncière',
        description: 'Via des promoteurs immobiliers crédibles (nationaux et étrangers) offrant villas, appartements et terrains viabilisés aux talibés désirant un logement près de Médina Baye',
      },
      {
        source: 'Contribution de l\'État',
        description: 'Appui financier pour la desserte routière, l\'alimentation en eau, la connexion au réseau électrique et la restructuration de Médina Baye',
      },
    ],
  },
};

export const PROJECT_STATS = {
  superficie: '1000 hectares',
  localisation: 'Commune de Mbadakhoune',
  distanceMedinaBaye: '10 km',
  distanceAeroport: '10 km',
  distanceAutoroute: '3 km',
  talibésNigeria: '60+ millions',
  talibésMonde: 'Centaines de millions',
  gamouKano2022: '7 millions de pèlerins',
  distanceKaolackKano: '2,684 km',
  tempsVolKaolackKano: 'Moins de 4 heures',
  annéeFondation: 1930,
  populationKano: '4,4 millions',
};
