import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ScrollArea } from '../components/ui/scroll-area';
import { legalDocs, legalNavigation } from '../data/legal';
import { ChevronRight, FileText, Shield, Scale, Lock, Globe, CreditCard, BookOpen } from 'lucide-react';

const iconMap = {
  terms: Scale,
  privacy: Shield,
  cookies: Globe,
  acceptableUse: FileText,
  refund: CreditCard,
  dmca: FileText,
  security: Lock,
  disclaimer: FileText,
  dpa: Shield,
  gdpr: Globe,
  ccpa: Globe,
  accessibility: BookOpen,
  sla: FileText,
  api: FileText,
  billing: CreditCard,
  ip: Scale,
  compliance: Shield,
};

const Legal = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState(docId || 'terms');

  useEffect(() => {
    if (docId && legalDocs[docId]) {
      setActiveDoc(docId);
    } else if (!docId) {
      setActiveDoc('terms');
    }
  }, [docId]);

  const currentDoc = legalDocs[activeDoc];

  const handleDocChange = (id) => {
    setActiveDoc(id);
    navigate(`/legal/${id}`);
  };

  if (!currentDoc) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="pt-32 pb-24 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Document Not Found</h1>
          <p className="text-gray-400">The requested legal document could not be found.</p>
          <Link to="/legal/terms" className="text-blue-400 hover:underline mt-4 inline-block">
            View Terms of Service
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Legal</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-400">{currentDoc.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="text-lg font-semibold text-white mb-4">Legal Documents</h2>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-1 pr-4">
                    {legalNavigation.map((item) => {
                      const Icon = iconMap[item.id] || FileText;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleDocChange(item.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            activeDoc === item.id
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </ScrollArea>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-gray-800">
                  <h1 className="text-3xl font-bold text-white mb-2">{currentDoc.title}</h1>
                  <p className="text-gray-400 text-sm">Last updated: {currentDoc.lastUpdated}</p>
                </div>

                {/* Summary */}
                <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-gray-300 leading-relaxed">{currentDoc.content}</p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                  {currentDoc.sections.map((section, index) => (
                    <div key={index}>
                      <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                      <p className="text-gray-400 leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">Questions?</h3>
                  <p className="text-gray-400 mb-4">
                    If you have questions about this policy, please contact our support team.
                  </p>
                  <Link
                    to="/legal/compliance"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Contact Compliance Team →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Legal;
