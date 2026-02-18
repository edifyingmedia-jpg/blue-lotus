// Mock data for Blue Lotus AI App Builder

export const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
];

export const features = [
  {
    id: 1,
    icon: 'Sparkles',
    title: 'AI-Generated Structure',
    description: 'Describe what you want. Blue Lotus creates full layouts, navigation, and logic instantly.',
  },
  {
    id: 2,
    icon: 'MousePointerOff',
    title: 'No Code. No Dragging.',
    description: 'Everything is generated for you — screens, flows, data, and copy. You guide it with simple prompts.',
  },
  {
    id: 3,
    icon: 'Rocket',
    title: 'Publish Anywhere',
    description: 'Deploy your app or website with one click. Staging and production environments included.',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Describe your project',
    description: 'Tell Blue Lotus what you\'re building and who it\'s for.',
  },
  {
    step: 2,
    title: 'Review your generated structure',
    description: 'Screens, pages, data models, and flows appear automatically.',
  },
  {
    step: 3,
    title: 'Refine with natural language',
    description: 'Add features, adjust layouts, and rewrite copy using simple instructions.',
  },
  {
    step: 4,
    title: 'Publish instantly',
    description: 'Launch your app or website with a single click.',
  },
];

export const whyBlueLotus = [
  'No learning curve',
  'No design tools',
  'No technical setup',
  'No drag-and-drop',
  'No code required',
];

export const showcaseApps = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-featured online store with payments, inventory, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    category: 'Business',
  },
  {
    id: 2,
    title: 'Project Management',
    description: 'Kanban boards, team collaboration, and real-time updates.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    category: 'Productivity',
  },
  {
    id: 3,
    title: 'AI Chat Assistant',
    description: 'Custom chatbot with knowledge base and conversation memory.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    category: 'AI',
  },
  {
    id: 4,
    title: 'Social Media Dashboard',
    description: 'Analytics, scheduling, and multi-platform management.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    category: 'Marketing',
  },
];

export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Start building for free',
    monthlyCredits: 0,
    starterCredits: 20,
    dailyBonusCredits: 0,
    bonusRollover: false,
    exportAllowed: false,
    features: [
      'Access to builder',
      'Unlimited projects',
      'Preview only',
      'No exporting or downloading',
      'No publishing',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 9.99,
    period: '/month',
    description: 'For hobbyists and side projects',
    monthlyCredits: 150,
    dailyBonusCredits: 10,
    bonusRollover: false,
    exportAllowed: true,
    features: [
      'Export apps and websites',
      'Publish to staging',
      'Basic templates',
      'Basic support',
    ],
    cta: 'Start Creator',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    period: '/month',
    description: 'For serious builders',
    monthlyCredits: 400,
    dailyBonusCredits: 10,
    bonusRollover: false,
    exportAllowed: true,
    features: [
      'Publish to production',
      'Advanced templates',
      'Priority generation speed',
      'Basic analytics',
      'Remove Blue Lotus branding',
    ],
    cta: 'Start Pro',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 29.99,
    period: '/month',
    description: 'For teams and power users',
    monthlyCredits: 800,
    dailyBonusCredits: 10,
    bonusRollover: false,
    exportAllowed: true,
    features: [
      'Unlimited publishing',
      'Team access (1–3 seats)',
      'Premium templates',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Start Elite',
    popular: false,
  },
];

export const creditAddons = [
  { id: 'pack100', name: 'Credit Pack 100', price: 4.99, credits: 100 },
  { id: 'pack250', name: 'Credit Pack 250', price: 9.99, credits: 250 },
  { id: 'pack600', name: 'Credit Pack 600', price: 19.99, credits: 600 },
  { id: 'pack1500', name: 'Credit Pack 1500', price: 39.99, credits: 1500 },
];

export const creditRules = {
  bonusCreditsRefreshIntervalHours: 24,
  bonusCreditsRollover: false,
  monthlyCreditsRollover: false,
  purchasedCreditsExpire: false,
  freeTierExportRestriction: true,
};

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Founder, TechStart',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Blue Lotus helped us launch our MVP in 2 days instead of 2 months. No code, no complexity — just results.',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'CTO, InnovateCo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'Finally, a builder that doesn\'t require dragging boxes around. I just describe what I need and it appears.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'Game changer for prototyping. I can explore ideas without waiting for design or engineering.',
  },
];

export const stats = [
  { value: '50K+', label: 'Projects Built' },
  { value: '10K+', label: 'Creators' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 60s', label: 'Time to First Screen' },
];

export const footerLinks = {
  product: [
    { label: 'Home', href: '/' },
    { label: 'Builder', href: '/dashboard' },
    { label: 'Pricing', href: '/pricing' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'Acceptable Use', href: '/legal/acceptableUse' },
    { label: 'Refund Policy', href: '/legal/refund' },
  ],
  compliance: [
    { label: 'DPA', href: '/legal/dpa' },
    { label: 'GDPR', href: '/legal/gdpr' },
    { label: 'CCPA', href: '/legal/ccpa' },
    { label: 'Security', href: '/legal/security' },
    { label: 'SLA', href: '/legal/sla' },
  ],
  company: [
    { label: 'Accessibility', href: '/legal/accessibility' },
    { label: 'Compliance Center', href: '/compliance' },
    { label: 'Contact', href: '/legal/compliance' },
  ],
};

// Mock user data
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  plan: 'Pro',
  credits: 1850,
  maxCredits: 2500,
};

// Mock projects data
export const mockProjects = [
  {
    id: '1',
    name: 'E-Commerce Store',
    description: 'A full-featured online store with Stripe payments',
    status: 'deployed',
    type: 'app',
    lastEdited: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    url: 'https://my-store.bluelotus.app',
  },
  {
    id: '2',
    name: 'Task Manager',
    description: 'Kanban-style project management tool',
    status: 'building',
    type: 'app',
    lastEdited: '5 minutes ago',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    url: null,
  },
  {
    id: '3',
    name: 'Marketing Site',
    description: 'Landing page with pricing and contact form',
    status: 'deployed',
    type: 'website',
    lastEdited: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=200&fit=crop',
    url: 'https://my-site.bluelotus.app',
  },
];
