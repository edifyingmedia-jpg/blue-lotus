// Mock data for Blue Lotus website

export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Pricing', href: '#pricing' },
];

export const features = [
  {
    id: 1,
    icon: 'Sparkles',
    title: 'Natural Language to Code',
    description: 'Describe your app in plain English and watch it come to life. Our AI understands your vision and generates production-ready code.',
  },
  {
    id: 2,
    icon: 'Layers',
    title: 'Full-Stack Generation',
    description: 'Frontend, backend, database, and APIs - all generated automatically. Complete applications, not just components.',
  },
  {
    id: 3,
    icon: 'Zap',
    title: 'Instant Deployment',
    description: 'One-click deployment with automatic SSL, routing, and scaling. Your app goes live in seconds, not hours.',
  },
  {
    id: 4,
    icon: 'Shield',
    title: 'Self-Healing Code',
    description: 'Built-in testing and debugging. Our AI automatically detects issues and applies fixes for rock-solid stability.',
  },
  {
    id: 5,
    icon: 'Code',
    title: 'Real, Exportable Code',
    description: 'Own your code completely. Download, modify, self-host, or sync to GitHub. No vendor lock-in, ever.',
  },
  {
    id: 6,
    icon: 'Plug',
    title: 'Third-Party Integrations',
    description: 'Connect to any API effortlessly. Stripe, Twilio, OpenAI - our agents configure integrations automatically.',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Describe Your App',
    description: 'Tell us what you want to build in plain language. Be as detailed or as brief as you like.',
  },
  {
    step: 2,
    title: 'AI Generates Code',
    description: 'Our multi-agent system creates frontend, backend, database schemas, and API integrations.',
  },
  {
    step: 3,
    title: 'Review & Iterate',
    description: 'See your app in real-time. Make changes through conversation, just like talking to a developer.',
  },
  {
    step: 4,
    title: 'Deploy & Scale',
    description: 'Launch with one click. We handle hosting, SSL, and scaling so you can focus on your users.',
  },
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
    id: 1,
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out Blue Lotus',
    features: [
      '100 credits/month',
      '1 active project',
      'Basic AI models',
      'Community support',
      'Code export',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 2,
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For serious builders and startups',
    features: [
      '2,500 credits/month',
      'Unlimited projects',
      'Advanced AI models',
      'Priority support',
      'Custom domains',
      'Team collaboration',
      'GitHub sync',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams and organizations',
    features: [
      'Unlimited credits',
      'Unlimited projects',
      'Dedicated support',
      'SLA guarantee',
      'SSO & SAML',
      'Custom integrations',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Founder, TechStart',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Blue Lotus helped us launch our MVP in 2 days instead of 2 months. The AI understands exactly what we need.',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'CTO, InnovateCo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'The code quality is impressive. We exported our project and it was production-ready from day one.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'Finally, a tool that lets me prototype ideas without waiting for engineering. Game changer for product teams.',
  },
];

export const stats = [
  { value: '$100M+', label: 'ARR Achieved' },
  { value: '50K+', label: 'Apps Built' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 30s', label: 'Avg. Deploy Time' },
];

export const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Changelog', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Tutorials', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Community', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};
