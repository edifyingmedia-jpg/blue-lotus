import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  User,
  CreditCard,
  Key,
  Bell,
  Shield,
  LogOut,
  ArrowLeft,
  Camera,
  Save,
  Zap,
  Check,
  ExternalLink,
} from 'lucide-react';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'profile';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, path: '/settings' },
    { id: 'billing', label: 'Billing', icon: CreditCard, path: '/settings/billing' },
    { id: 'api-keys', label: 'API Keys', icon: Key, path: '/settings/api-keys' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
    { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUser(formData);
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'billing':
        return <BillingTab user={user} />;
      case 'api-keys':
        return <ApiKeysTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return (
          <ProfileTab
            formData={formData}
            setFormData={setFormData}
            user={user}
            saving={saving}
            handleSave={handleSave}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
            <Link to="/">
              <Logo size={32} />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <h1 className="text-xl font-bold text-white mb-6">Settings</h1>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id || (currentTab === 'settings' && tab.id === 'profile');
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ formData, setFormData, user, saving, handleSave }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
    <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>

    {/* Avatar */}
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <img
          src={user?.avatar || 'https://i.pravatar.cc/100'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <div>
        <p className="text-white font-medium">{user?.name}</p>
        <p className="text-gray-400 text-sm">{user?.plan} Plan</p>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <Label className="text-gray-300">Full Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 bg-gray-800 border-gray-700 text-white focus:border-blue-500"
        />
      </div>
      <div>
        <Label className="text-gray-300">Email Address</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 bg-gray-800 border-gray-700 text-white focus:border-blue-500"
        />
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {saving ? 'Saving...' : 'Save Changes'}
        <Save className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </div>
);

const BillingTab = ({ user }) => (
  <div className="space-y-6">
    {/* Current Plan */}
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Current Plan</h2>
      <div className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
        <div>
          <p className="text-white font-medium">{user?.plan || 'Pro'} Plan</p>
          <p className="text-gray-400 text-sm">$49/month</p>
        </div>
        <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
          Upgrade Plan
        </Button>
      </div>
    </div>

    {/* Usage */}
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Credit Usage</h2>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Credits used this month</span>
          <span className="text-white font-medium">
            {user?.credits || 0} / {user?.maxCredits || 2500}
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${((user?.credits || 0) / (user?.maxCredits || 2500)) * 100}%` }}
          />
        </div>
      </div>
      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
        <Zap className="w-4 h-4 mr-2" />
        Buy More Credits
      </Button>
    </div>

    {/* Payment Method */}
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
          <div>
            <p className="text-white text-sm">•••• •••• •••• 4242</p>
            <p className="text-gray-500 text-xs">Expires 12/25</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          Edit
        </Button>
      </div>
    </div>
  </div>
);

const ApiKeysTab = () => {
  const [keys] = useState([
    { id: '1', name: 'Production Key', key: 'bl_prod_****************************', created: 'Jan 15, 2025' },
    { id: '2', name: 'Development Key', key: 'bl_dev_****************************', created: 'Jan 10, 2025' },
  ]);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">API Keys</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          Generate New Key
        </Button>
      </div>

      <div className="space-y-3">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white text-sm font-medium">{apiKey.name}</p>
              <p className="text-gray-500 text-xs font-mono mt-1">{apiKey.key}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Created {apiKey.created}</p>
              <button className="text-red-400 text-xs hover:text-red-300 mt-1">Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    email: true,
    deployments: true,
    updates: false,
    marketing: false,
  });

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>

      <div className="space-y-4">
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
          { key: 'deployments', label: 'Deployment Alerts', desc: 'Get notified when deployments complete' },
          { key: 'updates', label: 'Product Updates', desc: 'Learn about new features and improvements' },
          { key: 'marketing', label: 'Marketing Emails', desc: 'Receive tips and promotional content' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white text-sm font-medium">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
              className={`w-11 h-6 rounded-full transition-colors ${
                settings[item.key] ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecurityTab = () => (
  <div className="space-y-6">
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
      <div className="space-y-4">
        <div>
          <Label className="text-gray-300">Current Password</Label>
          <Input type="password" className="mt-1 bg-gray-800 border-gray-700 text-white" />
        </div>
        <div>
          <Label className="text-gray-300">New Password</Label>
          <Input type="password" className="mt-1 bg-gray-800 border-gray-700 text-white" />
        </div>
        <div>
          <Label className="text-gray-300">Confirm New Password</Label>
          <Input type="password" className="mt-1 bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>
      <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Update Password</Button>
    </div>

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h2>
      <p className="text-gray-400 text-sm mb-4">
        Add an extra layer of security to your account by enabling two-factor authentication.
      </p>
      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
        Enable 2FA
      </Button>
    </div>

    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
      <p className="text-gray-400 text-sm mb-4">
        Permanently delete your account and all associated data.
      </p>
      <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
        Delete Account
      </Button>
    </div>
  </div>
);

export default Settings;
