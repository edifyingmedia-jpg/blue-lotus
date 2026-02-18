import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Shield, 
  FileText, 
  Lock, 
  Download, 
  Trash2, 
  PenLine, 
  HelpCircle,
  ChevronRight,
  CheckCircle,
  Send
} from 'lucide-react';

const dataRightsItems = [
  { 
    icon: Download, 
    label: 'Request data export',
    description: 'Download a copy of all your personal data',
    value: 'export'
  },
  { 
    icon: Trash2, 
    label: 'Request data deletion',
    description: 'Request permanent deletion of your data',
    value: 'deletion'
  },
  { 
    icon: PenLine, 
    label: 'Request data correction',
    description: 'Update or correct inaccurate information',
    value: 'correction'
  },
  { 
    icon: HelpCircle, 
    label: 'Submit privacy inquiry',
    description: 'Ask questions about how we use your data',
    value: 'inquiry'
  },
];

const legalDocuments = [
  { label: 'Terms of Service', path: '/legal/terms' },
  { label: 'Privacy Policy', path: '/legal/privacy' },
  { label: 'DPA', path: '/legal/dpa' },
  { label: 'GDPR Statement', path: '/legal/gdpr' },
  { label: 'CCPA Notice', path: '/legal/ccpa' },
];

const securityDocs = [
  { label: 'Security Statement', path: '/legal/security' },
  { label: 'SLA', path: '/legal/sla' },
  { label: 'API Terms', path: '/legal/api' },
];

const ComplianceCenter = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedRight, setSelectedRight] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, requestType: value }));
  };

  const handleDataRightClick = (value) => {
    setSelectedRight(value);
    setFormData(prev => ({ ...prev, requestType: value }));
    // Scroll to form
    document.getElementById('compliance-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    console.log('Compliance request submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', requestType: '', description: '' });
      setSelectedRight(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Compliance Center
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Manage your data rights, review legal documents, and submit compliance requests.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Data Rights & Documents */}
            <div className="lg:col-span-2 space-y-8">
              {/* Data Rights Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Data Rights</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {dataRightsItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRight === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleDataRightClick(item.value)}
                        className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                          isSelected 
                            ? 'bg-blue-600/20 border-blue-500/50' 
                            : 'bg-gray-800/30 border-gray-700 hover:border-blue-500/30 hover:bg-gray-800/50'
                        }`}
                        data-testid={`data-right-${item.value}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-blue-600/30' : 'bg-gray-700/50 group-hover:bg-blue-600/20'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legal Documents Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Legal Documents</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {legalDocuments.map((doc) => (
                    <Link
                      key={doc.path}
                      to={doc.path}
                      className="group flex items-center justify-between px-4 py-3 bg-gray-800/30 hover:bg-blue-600/10 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all duration-200"
                      data-testid={`legal-doc-${doc.path.split('/').pop()}`}
                    >
                      <span className="text-gray-300 group-hover:text-white">
                        {doc.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Security & Platform Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Security & Platform</h2>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-3">
                  {securityDocs.map((doc) => (
                    <Link
                      key={doc.path}
                      to={doc.path}
                      className="group flex items-center justify-between px-4 py-3 bg-gray-800/30 hover:bg-blue-600/10 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all duration-200"
                      data-testid={`security-doc-${doc.path.split('/').pop()}`}
                    >
                      <span className="text-gray-300 group-hover:text-white">
                        {doc.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Request Form */}
            <div className="lg:col-span-1">
              <div 
                id="compliance-form"
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Submit a Compliance Request</h2>
                </div>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Request Submitted</h3>
                    <p className="text-gray-400 text-sm">
                      We'll review your request and respond within 5 business days.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                        data-testid="compliance-form-name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                        data-testid="compliance-form-email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Request Type
                      </label>
                      <Select value={formData.requestType} onValueChange={handleSelectChange}>
                        <SelectTrigger 
                          className="bg-gray-800/50 border-gray-700 text-white"
                          data-testid="compliance-form-type"
                        >
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="export" className="text-gray-200 focus:bg-blue-600/20">
                            Data Export
                          </SelectItem>
                          <SelectItem value="deletion" className="text-gray-200 focus:bg-blue-600/20">
                            Data Deletion
                          </SelectItem>
                          <SelectItem value="correction" className="text-gray-200 focus:bg-blue-600/20">
                            Data Correction
                          </SelectItem>
                          <SelectItem value="inquiry" className="text-gray-200 focus:bg-blue-600/20">
                            Privacy Inquiry
                          </SelectItem>
                          <SelectItem value="other" className="text-gray-200 focus:bg-blue-600/20">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Please describe your request in detail..."
                        rows={4}
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
                        data-testid="compliance-form-description"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="compliance-form-submit"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      We typically respond to compliance requests within 5 business days.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComplianceCenter;
