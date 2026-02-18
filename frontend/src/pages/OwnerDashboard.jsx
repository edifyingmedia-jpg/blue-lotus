import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
  RefreshCw,
  TrendingUp,
  Zap,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Crown,
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OwnerDashboard = () => {
  const { getAuthToken, user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats
  const [stats, setStats] = useState(null);
  
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
    return response.json();
  }, [getAuthToken]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/api/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchStats();
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'billing') fetchBilling();
  }, [activeTab, fetchUsers, fetchProjects, fetchBilling]);

  const handleSuspendUser = async (userId) => {
    const token = getAuthToken();
    await fetch(`${API_URL}/api/admin/users/${userId}/suspend`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Admin action' })
    });
    fetchUsers();
  };

  const handleReactivateUser = async (userId) => {
    const token = getAuthToken();
    await fetch(`${API_URL}/api/admin/users/${userId}/reactivate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
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
    const token = getAuthToken();
    await fetch(`${API_URL}/api/admin/projects/${projectId}/archive`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
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
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="border-gray-700 text-gray-300"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to App
              </Button>
            </div>
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
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.total_users}</p>
                <p className="text-green-400 text-xs mt-1">
                  {stats.active_users_today} active today
                </p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FolderKanban className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Total Projects</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.total_projects}</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Active Sessions</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.active_sessions}</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Credits Used</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.total_credits_used}</p>
              </div>
            </div>

            {/* Revenue & Status */}
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
                <p className="text-gray-400 text-sm mt-2">
                  {stats.ai_generations_today} AI generations today
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4" data-testid="users-section">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">User Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
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
                        <div>
                          <p className="text-white font-medium">{u.name}</p>
                          <p className="text-gray-400 text-sm">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.role === 'owner' ? 'bg-purple-500/20 text-purple-400' :
                          u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300 capitalize">{u.plan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300">{u.projects_count}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          u.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-gray-700">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                            <DropdownMenuItem className="text-gray-300">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {u.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleSuspendUser(u.id)} className="text-yellow-400">
                                <UserX className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleReactivateUser(u.id)} className="text-green-400">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDeleteUser(u.id)} className="text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing {usersPage * 20 + 1} - {Math.min((usersPage + 1) * 20, usersTotal)} of {usersTotal}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUsersPage(p => Math.max(0, p - 1))}
                  disabled={usersPage === 0}
                  className="border-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUsersPage(p => p + 1)}
                  disabled={(usersPage + 1) * 20 >= usersTotal}
                  className="border-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4" data-testid="projects-section">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Project Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="pl-10 w-64 bg-gray-800 border-gray-700 text-white"
                />
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
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{p.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-400 text-sm">{p.user_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300 capitalize">{p.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          p.status === 'published' ? 'bg-green-500/20 text-green-400' :
                          p.status === 'staged' ? 'bg-yellow-500/20 text-yellow-400' :
                          p.status === 'archived' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400 text-sm">
                          {new Date(p.updated_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-gray-700">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                            <DropdownMenuItem className="text-gray-300">
                              <Eye className="w-4 h-4 mr-2" />
                              View in Builder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchiveProject(p.id)} className="text-yellow-400">
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProject(p.id)} className="text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing {projectsPage * 20 + 1} - {Math.min((projectsPage + 1) * 20, projectsTotal)} of {projectsTotal}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProjectsPage(p => Math.max(0, p - 1))}
                  disabled={projectsPage === 0}
                  className="border-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProjectsPage(p => p + 1)}
                  disabled={(projectsPage + 1) * 20 >= projectsTotal}
                  className="border-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && billingOverview && (
          <div className="space-y-6" data-testid="billing-section">
            {/* Revenue Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-2">Subscription Revenue</h3>
                <p className="text-2xl font-bold text-white">
                  ${Object.values(billingOverview.revenue_by_plan || {}).reduce((sum, p) => sum + (p.revenue || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-2">Credit Purchases</h3>
                <p className="text-2xl font-bold text-white">
                  ${(billingOverview.credit_purchases?.total || 0).toFixed(2)}
                </p>
                <p className="text-gray-500 text-xs">{billingOverview.credit_purchases?.count || 0} purchases</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-2">Users by Plan</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(billingOverview.users_by_plan || {}).map(([plan, count]) => (
                    <span key={plan} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                      {plan}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
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
                      <span className={`text-xs ${
                        txn.status === 'paid' ? 'text-green-400' :
                        txn.status === 'refunded' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-4">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
