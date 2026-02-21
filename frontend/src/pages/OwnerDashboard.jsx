import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Users,
  FolderKanban,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Search,
  MoreVertical,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserX,
  UserCheck,
  Trash2,
  Eye,
  Archive,
  TrendingUp,
  Zap,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Crown,
  MessageSquare,
  FileText,
  HelpCircle,
  Server,
  RefreshCw,
  Plus,
  Edit,
  Send,
  X,
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OwnerDashboard = () => {
  const { getAuthToken } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Overview Data
  const [stats, setStats] = useState(null);
  const [retention, setRetention] = useState(null);
  const [projectFunnel, setProjectFunnel] = useState(null);
  
  // Users
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  
  // Projects
  const [projects, setProjects] = useState([]);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [projectsPage, setProjectsPage] = useState(0);
  const [projectSearch, setProjectSearch] = useState('');
  
  // Billing
  const [billingOverview, setBillingOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  // Analytics
  const [aiUsage, setAiUsage] = useState(null);
  const [signups, setSignups] = useState([]);
  
  // Settings
  const [features, setFeatures] = useState([]);
  const [limits, setLimits] = useState([]);
  const [branding, setBranding] = useState(null);
  
  // Compliance
  const [legalDocs, setLegalDocs] = useState([]);
  const [thirdParty, setThirdParty] = useState([]);
  
  // Support
  const [tickets, setTickets] = useState([]);
  const [ticketStats, setTicketStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const fetchWithAuth = useCallback(async (endpoint) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. Owner privileges required.');
      }
      throw new Error('Request failed');
    }
    return response.text().then(t => t ? JSON.parse(t) : null);
  }, [getAuthToken]);

  const postWithAuth = useCallback(async (endpoint, body) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Request failed');
    return response.text().then(t => t ? JSON.parse(t) : null);
  }, [getAuthToken]);

  const putWithAuth = useCallback(async (endpoint, body) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Request failed');
    return response.text().then(t => t ? JSON.parse(t) : null);
  }, [getAuthToken]);

  // Fetch functions
  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/api/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchWithAuth]);

  const fetchOverviewData = useCallback(async () => {
    try {
      const [retentionData, funnelData, signupsData] = await Promise.all([
        fetchWithAuth('/api/admin/analytics/retention'),
        fetchWithAuth('/api/admin/analytics/project-funnel'),
        fetchWithAuth('/api/admin/analytics/signups?days=7')
      ]);
      setRetention(retentionData);
      setProjectFunnel(funnelData);
      setSignups(signupsData.signups || []);
    } catch (err) {
      console.error('Failed to fetch overview data:', err);
    }
  }, [fetchWithAuth]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await fetchWithAuth(`/api/admin/users?skip=${usersPage * 20}&limit=20&search=${userSearch}`);
      setUsers(data.users);
      setUsersTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [fetchWithAuth, usersPage, userSearch]);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await fetchWithAuth(`/api/admin/projects?skip=${projectsPage * 20}&limit=20&search=${projectSearch}`);
      setProjects(data.projects);
      setProjectsTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }, [fetchWithAuth, projectsPage, projectSearch]);

  const fetchBilling = useCallback(async () => {
    try {
      const [overview, txns] = await Promise.all([
        fetchWithAuth('/api/admin/billing/overview'),
        fetchWithAuth('/api/admin/transactions?limit=10')
      ]);
      setBillingOverview(overview);
      setTransactions(txns.transactions);
    } catch (err) {
      console.error('Failed to fetch billing:', err);
    }
  }, [fetchWithAuth]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [ai, signupsData] = await Promise.all([
        fetchWithAuth('/api/admin/analytics/ai-usage?days=30'),
        fetchWithAuth('/api/admin/analytics/signups?days=30')
      ]);
      setAiUsage(ai);
      setSignups(signupsData.signups || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, [fetchWithAuth]);

  const fetchSettings = useCallback(async () => {
    try {
      const [featuresData, limitsData, brandingData] = await Promise.all([
        fetchWithAuth('/api/admin/settings/features'),
        fetchWithAuth('/api/admin/settings/limits'),
        fetchWithAuth('/api/admin/settings/branding')
      ]);
      setFeatures(featuresData.features || []);
      setLimits(limitsData.limits || []);
      setBranding(brandingData);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }, [fetchWithAuth]);

  const fetchCompliance = useCallback(async () => {
    try {
      const [docs, services] = await Promise.all([
        fetchWithAuth('/api/admin/compliance/documents'),
        fetchWithAuth('/api/admin/compliance/third-party')
      ]);
      setLegalDocs(docs.documents || []);
      setThirdParty(services.services || []);
    } catch (err) {
      console.error('Failed to fetch compliance:', err);
    }
  }, [fetchWithAuth]);

  const fetchSupport = useCallback(async () => {
    try {
      const [ticketsData, statsData, articlesData, feedbackData] = await Promise.all([
        fetchWithAuth('/api/admin/support/tickets?limit=20'),
        fetchWithAuth('/api/admin/support/tickets/stats'),
        fetchWithAuth('/api/admin/support/articles'),
        fetchWithAuth('/api/admin/support/feedback?limit=20')
      ]);
      setTickets(ticketsData.tickets || []);
      setTicketStats(statsData);
      setArticles(articlesData.articles || []);
      setFeedback(feedbackData.feedback || []);
    } catch (err) {
      console.error('Failed to fetch support:', err);
    }
  }, [fetchWithAuth]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchStats();
        await fetchOverviewData();
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchStats, fetchOverviewData]);

  // Tab-specific data loading
  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'billing') fetchBilling();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'settings') fetchSettings();
    if (activeTab === 'compliance') fetchCompliance();
    if (activeTab === 'support') fetchSupport();
  }, [activeTab, fetchUsers, fetchProjects, fetchBilling, fetchAnalytics, fetchSettings, fetchCompliance, fetchSupport]);

  // Action handlers
  const handleSuspendUser = async (userId) => {
    await postWithAuth(`/api/admin/users/${userId}/suspend`, { reason: 'Admin action' });
    fetchUsers();
  };

  const handleReactivateUser = async (userId) => {
    await postWithAuth(`/api/admin/users/${userId}/reactivate`, {});
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const token = getAuthToken();
    await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchUsers();
  };

  const handleArchiveProject = async (projectId) => {
    await postWithAuth(`/api/admin/projects/${projectId}/archive`, {});
    fetchProjects();
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const token = getAuthToken();
    await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProjects();
  };

  const handleToggleFeature = async (featureKey, enabled) => {
    await putWithAuth(`/api/admin/settings/features/${featureKey}?enabled=${enabled}`, {});
    fetchSettings();
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    await putWithAuth(`/api/admin/support/tickets/${ticketId}/status?status=${status}`, {});
    fetchSupport();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'support', label: 'Support', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-950" data-testid="owner-dashboard">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo size={36} />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Owner Dashboard</span>
              </div>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-gray-700 text-gray-300">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6" data-testid="overview-section">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats.total_users} subtext={`${stats.active_users_today} active today`} color="blue" />
              <StatCard icon={FolderKanban} label="Total Projects" value={stats.total_projects} subtext={projectFunnel ? `${projectFunnel.publish_rate}% published` : ''} color="purple" />
              <StatCard icon={Activity} label="Active Sessions" value={stats.active_sessions} color="green" />
              <StatCard icon={Zap} label="Credits Used" value={stats.total_credits_used} color="yellow" />
            </div>

            {/* Second Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Revenue
                </h3>
                <p className="text-3xl font-bold text-white">${stats.total_revenue.toFixed(2)}</p>
                <p className="text-gray-400 text-sm mt-1">Total lifetime revenue</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  System Status
                </h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-xl font-medium text-green-400 capitalize">{stats.system_status}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{stats.ai_generations_today} AI generations today</p>
              </div>
            </div>

            {/* Retention & Funnel */}
            {retention && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">User Retention</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">7-Day Retention</p>
                      <p className="text-2xl font-bold text-white">{retention.retention_rate_7d}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">30-Day Retention</p>
                      <p className="text-2xl font-bold text-white">{retention.retention_rate_30d}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Churn Rate</p>
                      <p className="text-2xl font-bold text-red-400">{retention.churn_rate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">New Users (7d)</p>
                      <p className="text-2xl font-bold text-green-400">{retention.new_users_7d}</p>
                    </div>
                  </div>
                </div>
                
                {projectFunnel && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Project Funnel</h3>
                    <div className="space-y-3">
                      <FunnelItem label="Users with projects" value={projectFunnel.users_with_projects} total={projectFunnel.total_users} />
                      <FunnelItem label="Draft" value={projectFunnel.funnel.draft} total={projectFunnel.total_projects} color="gray" />
                      <FunnelItem label="Staged" value={projectFunnel.funnel.staged} total={projectFunnel.total_projects} color="yellow" />
                      <FunnelItem label="Published" value={projectFunnel.funnel.published} total={projectFunnel.total_projects} color="green" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Signups (7 days)</h3>
              <div className="flex gap-2">
                {signups.slice(-7).map((day, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="h-20 bg-gray-800 rounded flex items-end justify-center p-1">
                      <div 
                        className="w-full bg-blue-500 rounded"
                        style={{ height: `${Math.min(100, (day.count / Math.max(...signups.map(s => s.count), 1)) * 100)}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{day._id?.slice(-5)}</p>
                    <p className="text-sm text-white">{day.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <UsersSection 
            users={users} 
            total={usersTotal} 
            page={usersPage} 
            setPage={setUsersPage}
            search={userSearch}
            setSearch={setUserSearch}
            onSuspend={handleSuspendUser}
            onReactivate={handleReactivateUser}
            onDelete={handleDeleteUser}
          />
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <ProjectsSection
            projects={projects}
            total={projectsTotal}
            page={projectsPage}
            setPage={setProjectsPage}
            search={projectSearch}
            setSearch={setProjectSearch}
            onArchive={handleArchiveProject}
            onDelete={handleDeleteProject}
          />
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && billingOverview && (
          <BillingSection overview={billingOverview} transactions={transactions} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsSection aiUsage={aiUsage} signups={signups} retention={retention} />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsSection 
            features={features} 
            limits={limits} 
            branding={branding}
            onToggleFeature={handleToggleFeature}
          />
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <ComplianceSection documents={legalDocs} thirdParty={thirdParty} />
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <SupportSection 
            tickets={tickets} 
            stats={ticketStats} 
            articles={articles}
            feedback={feedback}
            onUpdateStatus={handleUpdateTicketStatus}
          />
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, subtext, color }) => {
  const colors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400'
  };
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${colors[color]}`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtext && <p className="text-green-400 text-xs mt-1">{subtext}</p>}
    </div>
  );
};

const FunnelItem = ({ label, value, total, color = 'blue' }) => {
  const percentage = total > 0 ? (value / total * 100) : 0;
  const colors = {
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded">
        <div className={`h-full ${colors[color]} rounded`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const UsersSection = ({ users, total, page, setPage, search, setSearch, onSuspend, onReactivate, onDelete }) => (
  <div className="space-y-4" data-testid="users-section">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">User Management</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 w-64 bg-gray-800 border-gray-700 text-white"
        />
      </div>
    </div>

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Plan</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Projects</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-800/30">
              <td className="px-4 py-3">
                <p className="text-white font-medium">{u.name}</p>
                <p className="text-gray-400 text-sm">{u.email}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  u.role === 'owner' ? 'bg-purple-500/20 text-purple-400' :
                  u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                }`}>{u.role}</span>
              </td>
              <td className="px-4 py-3 text-gray-300 capitalize">{u.plan}</td>
              <td className="px-4 py-3 text-gray-300">{u.projects_count}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  u.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  u.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                }`}>{u.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-700">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    <DropdownMenuItem className="text-gray-300"><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                    {u.status === 'active' ? (
                      <DropdownMenuItem onClick={() => onSuspend(u.id)} className="text-yellow-400"><UserX className="w-4 h-4 mr-2" />Suspend</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onReactivate(u.id)} className="text-green-400"><UserCheck className="w-4 h-4 mr-2" />Reactivate</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(u.id)} className="text-red-400"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Pagination page={page} setPage={setPage} total={total} pageSize={20} />
  </div>
);

const ProjectsSection = ({ projects, total, page, setPage, search, setSearch, onArchive, onDelete }) => (
  <div className="space-y-4" data-testid="projects-section">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">Project Management</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64 bg-gray-800 border-gray-700 text-white" />
      </div>
    </div>

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Project</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Owner</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Updated</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-gray-800/30">
              <td className="px-4 py-3 text-white font-medium">{p.name}</td>
              <td className="px-4 py-3 text-gray-400 text-sm">{p.user_email}</td>
              <td className="px-4 py-3 text-gray-300 capitalize">{p.type}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  p.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  p.status === 'staged' ? 'bg-yellow-500/20 text-yellow-400' :
                  p.status === 'archived' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'
                }`}>{p.status}</span>
              </td>
              <td className="px-4 py-3 text-gray-400 text-sm">{new Date(p.updated_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-700"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    <DropdownMenuItem className="text-gray-300"><Eye className="w-4 h-4 mr-2" />View in Builder</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive(p.id)} className="text-yellow-400"><Archive className="w-4 h-4 mr-2" />Archive</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(p.id)} className="text-red-400"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Pagination page={page} setPage={setPage} total={total} pageSize={20} />
  </div>
);

const BillingSection = ({ overview, transactions }) => (
  <div className="space-y-6" data-testid="billing-section">
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-gray-400 text-sm mb-2">Subscription Revenue</h3>
        <p className="text-2xl font-bold text-white">
          ${Object.values(overview.revenue_by_plan || {}).reduce((sum, p) => sum + (p.revenue || 0), 0).toFixed(2)}
        </p>
      </div>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-gray-400 text-sm mb-2">Credit Purchases</h3>
        <p className="text-2xl font-bold text-white">${(overview.credit_purchases?.total || 0).toFixed(2)}</p>
        <p className="text-gray-500 text-xs">{overview.credit_purchases?.count || 0} purchases</p>
      </div>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-gray-400 text-sm mb-2">Users by Plan</h3>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(overview.users_by_plan || {}).map(([plan, count]) => (
            <span key={plan} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{plan}: {count}</span>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.length > 0 ? transactions.map((txn, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">{txn.user_email}</p>
              <p className="text-gray-400 text-sm capitalize">{txn.payment_type}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">${txn.amount}</p>
              <span className={`text-xs ${txn.status === 'paid' ? 'text-green-400' : txn.status === 'refunded' ? 'text-red-400' : 'text-yellow-400'}`}>{txn.status}</span>
            </div>
          </div>
        )) : <p className="text-gray-400 text-center py-4">No transactions yet</p>}
      </div>
    </div>
  </div>
);

const AnalyticsSection = ({ aiUsage, signups, retention }) => (
  <div className="space-y-6" data-testid="analytics-section">
    {aiUsage && (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Generation Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Generations</p>
              <p className="text-2xl font-bold text-white">{aiUsage.total_generations}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last 30 Days</p>
              <p className="text-2xl font-bold text-white">{aiUsage.recent_generations}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">By Type</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(aiUsage.by_type || {}).map(([type, count]) => (
                <span key={type} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{type}: {count}</span>
              ))}
            </div>
          </div>
        </div>

        {retention && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">User Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Active (7d)</p>
                <p className="text-2xl font-bold text-white">{retention.active_users_7d}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Churn Rate</p>
                <p className="text-2xl font-bold text-red-400">{retention.churn_rate}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Signups (30 days)</h3>
      <div className="h-40 flex items-end gap-1">
        {signups.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${Math.min(100, (day.count / Math.max(...signups.map(s => s.count), 1)) * 100)}%`, minHeight: day.count > 0 ? '4px' : '0' }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsSection = ({ features, limits, branding, onToggleFeature }) => (
  <div className="space-y-6" data-testid="settings-section">
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Feature Flags</h3>
      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">{feature.name}</p>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
            <Switch 
              checked={feature.enabled} 
              onCheckedChange={(checked) => onToggleFeature(feature.key, checked)}
            />
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Global Limits</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {limits.map((limit) => (
          <div key={limit.key} className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-white font-medium">{limit.name}</p>
            <p className="text-gray-400 text-sm mb-2">{limit.description}</p>
            <p className="text-2xl font-bold text-blue-400">{limit.value}</p>
          </div>
        ))}
      </div>
    </div>

    {branding && (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Branding</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">App Name</p>
            <p className="text-white font-medium">{branding.app_name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Tagline</p>
            <p className="text-white font-medium">{branding.tagline}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Primary Color</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: branding.primary_color }} />
              <span className="text-white">{branding.primary_color}</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

const ComplianceSection = ({ documents, thirdParty }) => (
  <div className="space-y-6" data-testid="compliance-section">
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Legal Documents</h3>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-1" />Add Document</Button>
      </div>
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div>
                <p className="text-white font-medium">{doc.title}</p>
                <p className="text-gray-400 text-sm">Type: {doc.type} | Version: {doc.version}</p>
              </div>
              <div className="flex items-center gap-2">
                {doc.is_active && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Active</span>}
                <Button size="sm" variant="outline" className="border-gray-700"><Edit className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">No documents yet. Create your first legal document.</p>
      )}
    </div>

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Third-Party Services</h3>
      <div className="space-y-3">
        {thirdParty.map((service, i) => (
          <div key={i} className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-white font-medium">{service.name}</p>
            <p className="text-gray-400 text-sm">Purpose: {service.purpose}</p>
            <p className="text-gray-500 text-xs">Data: {service.data_types?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SupportSection = ({ tickets, stats, articles, feedback, onUpdateStatus }) => (
  <div className="space-y-6" data-testid="support-section">
    {stats && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="Total Tickets" value={stats.total} color="blue" />
        <StatCard icon={AlertCircle} label="Open" value={stats.open} color="yellow" />
        <StatCard icon={Activity} label="In Progress" value={stats.in_progress} color="purple" />
        <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="green" />
      </div>
    )}

    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Support Tickets</h3>
      {tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div>
                <p className="text-white font-medium">{ticket.subject}</p>
                <p className="text-gray-400 text-sm">{ticket.user_email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                  ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                }`}>{ticket.priority}</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                  ticket.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>{ticket.status}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-700"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    <DropdownMenuItem onClick={() => onUpdateStatus(ticket.id, 'in_progress')} className="text-blue-400">Mark In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(ticket.id, 'resolved')} className="text-green-400">Mark Resolved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(ticket.id, 'closed')} className="text-gray-400">Close</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400 text-center py-4">No support tickets</p>}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Help Articles</h3>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
        {articles.length > 0 ? (
          <div className="space-y-2">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                <span className="text-white text-sm">{article.title}</span>
                <span className={`text-xs ${article.published ? 'text-green-400' : 'text-gray-400'}`}>
                  {article.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-center py-4">No help articles</p>}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Feedback</h3>
        {feedback.length > 0 ? (
          <div className="space-y-2">
            {feedback.slice(0, 5).map((fb, i) => (
              <div key={i} className="p-2 bg-gray-800/30 rounded">
                <p className="text-white text-sm">{fb.message?.slice(0, 100)}...</p>
                <p className="text-gray-500 text-xs">{fb.user_email}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-center py-4">No feedback yet</p>}
      </div>
    </div>
  </div>
);

const Pagination = ({ page, setPage, total, pageSize }) => (
  <div className="flex items-center justify-between">
    <p className="text-gray-400 text-sm">Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total}</p>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="border-gray-700">
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * pageSize >= total} className="border-gray-700">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default OwnerDashboard;
