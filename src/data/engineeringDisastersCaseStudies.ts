export interface CaseStudyVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  thumbnailUrl: string;
  duration: string;
  tags: string[];
  views: number;
}

export const engineeringDisastersCaseStudies: CaseStudyVideo[] = [
  // Civil Engineering Disasters
  {
    id: 'case-tacoma-narrows',
    title: 'Tacoma Narrows Bridge Collapse (1940)',
    description: 'The dramatic collapse of the Tacoma Narrows Bridge due to aeroelastic flutter, a landmark case in engineering failure analysis.',
    category: 'engineering disasters',
    subcategory: 'civil',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
    duration: '15:32',
    tags: ['bridge collapse', 'aeroelastic flutter', 'structural failure'],
    views: 245000
  },
  {
    id: 'case-hyatt-regency',
    title: 'Hyatt Regency Walkway Collapse (1981)',
    description: 'The deadliest structural collapse in US history caused by a fatal design change to the walkway support system.',
    category: 'engineering disasters',
    subcategory: 'civil',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    duration: '22:15',
    tags: ['structural collapse', 'design flaw', 'construction error'],
    views: 189000
  },
  {
    id: 'case-morandi-bridge',
    title: 'Morandi Bridge Collapse - Genoa (2018)',
    description: 'Analysis of the catastrophic collapse of the Polcevera viaduct in Genoa, Italy due to corrosion and maintenance failures.',
    category: 'engineering disasters',
    subcategory: 'civil',
    thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
    duration: '18:45',
    tags: ['bridge collapse', 'corrosion', 'maintenance failure'],
    views: 156000
  },
  {
    id: 'case-sampoong',
    title: 'Sampoong Department Store Collapse (1995)',
    description: 'The collapse of a South Korean department store due to structural negligence and illegal modifications.',
    category: 'engineering disasters',
    subcategory: 'civil',
    thumbnailUrl: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=400',
    duration: '25:10',
    tags: ['building collapse', 'structural negligence', 'construction fraud'],
    views: 134000
  },
  // Mechanical Engineering Disasters
  {
    id: 'case-challenger',
    title: 'Space Shuttle Challenger Disaster (1986)',
    description: 'The tragic loss of Challenger due to O-ring failure in cold temperatures, a lesson in engineering ethics.',
    category: 'engineering disasters',
    subcategory: 'mechanical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=400',
    duration: '35:20',
    tags: ['space shuttle', 'o-ring failure', 'NASA'],
    views: 892000
  },
  {
    id: 'case-columbia',
    title: 'Space Shuttle Columbia Disaster (2003)',
    description: 'The loss of Columbia during re-entry due to foam insulation damage to the thermal protection system.',
    category: 'engineering disasters',
    subcategory: 'mechanical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    duration: '32:45',
    tags: ['space shuttle', 'thermal failure', 'foam strike'],
    views: 654000
  },
  {
    id: 'case-titanic',
    title: 'RMS Titanic - Engineering Analysis (1912)',
    description: 'Engineering analysis of the Titanic sinking, examining hull design, rivet quality, and watertight compartments.',
    category: 'engineering disasters',
    subcategory: 'mechanical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
    duration: '42:30',
    tags: ['shipwreck', 'hull failure', 'maritime disaster'],
    views: 1245000
  },
  {
    id: 'case-dc10',
    title: 'DC-10 Cargo Door Disasters',
    description: 'The fatal design flaw in DC-10 cargo doors that led to multiple crashes and industry-wide safety reforms.',
    category: 'engineering disasters',
    subcategory: 'mechanical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
    duration: '28:15',
    tags: ['aviation', 'cargo door', 'design flaw'],
    views: 423000
  },
  // Electrical Engineering Disasters
  {
    id: 'case-northeast-blackout',
    title: 'Northeast Blackout of 2003',
    description: 'The cascading power failure that left 55 million people without electricity due to software bugs and grid vulnerabilities.',
    category: 'engineering disasters',
    subcategory: 'electrical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
    duration: '24:50',
    tags: ['power grid', 'blackout', 'software failure'],
    views: 312000
  },
  {
    id: 'case-fukushima',
    title: 'Fukushima Daiichi Nuclear Disaster (2011)',
    description: 'The nuclear meltdown caused by tsunami-induced power failures and cooling system breakdown.',
    category: 'engineering disasters',
    subcategory: 'electrical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591599517082-649b88c7b26f?w=400',
    duration: '45:30',
    tags: ['nuclear', 'tsunami', 'power failure'],
    views: 756000
  },
  {
    id: 'case-chernobyl-electrical',
    title: 'Chernobyl - Electrical Systems Failure',
    description: 'Analysis of the electrical and control system failures that contributed to the Chernobyl disaster.',
    category: 'engineering disasters',
    subcategory: 'electrical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    duration: '38:20',
    tags: ['nuclear', 'control systems', 'safety failure'],
    views: 623000
  },
  {
    id: 'case-therac25',
    title: 'Therac-25 Radiation Overdoses',
    description: 'How software bugs in medical radiation machines caused fatal overdoses - a landmark case in software safety.',
    category: 'engineering disasters',
    subcategory: 'electrical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    duration: '29:15',
    tags: ['software bug', 'medical device', 'radiation'],
    views: 287000
  },
  // Chemical Engineering Disasters
  {
    id: 'case-bhopal',
    title: 'Bhopal Gas Tragedy (1984)',
    description: 'The worlds worst industrial disaster - methyl isocyanate leak that killed thousands in Bhopal, India.',
    category: 'engineering disasters',
    subcategory: 'chemical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400',
    duration: '48:30',
    tags: ['chemical leak', 'industrial disaster', 'safety failure'],
    views: 534000
  },
  {
    id: 'case-texas-city',
    title: 'Texas City Refinery Explosion (2005)',
    description: 'BP refinery explosion caused by equipment failures and safety culture breakdown, killing 15 workers.',
    category: 'engineering disasters',
    subcategory: 'chemical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400',
    duration: '33:45',
    tags: ['refinery explosion', 'safety culture', 'process safety'],
    views: 298000
  },
  {
    id: 'case-deepwater',
    title: 'Deepwater Horizon Oil Spill (2010)',
    description: 'The blowout preventer failure and management decisions that led to the largest marine oil spill in history.',
    category: 'engineering disasters',
    subcategory: 'chemical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
    duration: '52:15',
    tags: ['oil spill', 'blowout', 'offshore drilling'],
    views: 867000
  },
  {
    id: 'case-piper-alpha',
    title: 'Piper Alpha Platform Disaster (1988)',
    description: 'The deadliest offshore oil disaster caused by permit-to-work failures and inadequate emergency systems.',
    category: 'engineering disasters',
    subcategory: 'chemical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400',
    duration: '41:20',
    tags: ['offshore platform', 'fire', 'safety management'],
    views: 345000
  }
];
