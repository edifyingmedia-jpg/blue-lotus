import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Scale, 
  Shield, 
  Globe, 
  FileText, 
  CreditCard, 
  Lock, 
  BookOpen,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const legalSections = [
  {
    title: "Core Legal Documents",
    icon: Scale,
    description: "Fundamental agreements governing your use of Blue Lotus",
    links: [
      { label: "Terms of Service", path: "/legal/terms" },
      { label: "Privacy Policy", path: "/legal/privacy" },
      { label: "Cookie Policy", path: "/legal/cookies" },
      { label: "Acceptable Use Policy", path: "/legal/acceptableUse" },
      { label: "Refund Policy", path: "/legal/refund" },
      { label: "Disclaimer", path: "/legal/disclaimer" }
    ]
  },
  {
    title: "Intellectual Property & Rights",
    icon: FileText,
    description: "Policies protecting creative works and intellectual property",
    links: [
      { label: "DMCA Policy", path: "/legal/dmca" },
      { label: "Intellectual Property Policy", path: "/legal/ip" }
    ]
  },
  {
    title: "Data Protection & Compliance",
    icon: Shield,
    description: "How we protect your data and comply with regulations",
    links: [
      { label: "Data Processing Agreement (DPA)", path: "/legal/dpa" },
      { label: "GDPR Compliance Statement", path: "/legal/gdpr" },
      { label: "CCPA Notice", path: "/legal/ccpa" },
      { label: "Security Statement", path: "/legal/security" }
    ]
  },
  {
    title: "Platform Operations",
    icon: CreditCard,
    description: "Service commitments, API usage, and billing information",
    links: [
      { label: "Service Level Agreement (SLA)", path: "/legal/sla" },
      { label: "API Terms", path: "/legal/api" },
      { label: "Billing & Subscription Policy", path: "/legal/billing" }
    ]
  },
  {
    title: "Accessibility & Contact",
    icon: BookOpen,
    description: "Our commitment to accessibility and how to reach us",
    links: [
      { label: "Accessibility Statement", path: "/legal/accessibility" },
      { label: "Contact & Compliance", path: "/legal/compliance" }
    ]
  }
];

const LegalNav = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Legal & Compliance
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Access all legal, policy, and compliance documents related to the use of Blue Lotus.
            </p>
          </div>

          {/* Sections Grid */}
          <div className="space-y-8">
            {legalSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div 
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
                >
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Links Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.links.map((link, linkIdx) => (
                      <Link
                        key={linkIdx}
                        to={link.path}
                        className="group flex items-center justify-between px-4 py-3 bg-gray-800/50 hover:bg-blue-600/10 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all duration-200"
                        data-testid={`legal-link-${link.path.split('/').pop()}`}
                      >
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {link.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Need help understanding our policies?
            </p>
            <Link
              to="/legal/compliance"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contact our compliance team
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LegalNav;
