import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Settings,
  Trash2,
  Copy,
  Clock,
  Rocket,
  Loader2,
  User,
  CreditCard,
  LogOut,
  ChevronDown,
  ChevronRight,
  Zap,
  Smartphone,
  Globe,
  Layers,
  Gift,
  ShoppingCart,
  History,
  Crown,
  ArrowUpRight,
  Layout,
  FileText,
  Wand2,
  Upload,
  Calendar,
  CheckCircle,
  Shield,
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { user, logout, getAuthToken, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeUntilBonus, setTimeUntilBonus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch(`${API_URL}/api/projects/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    fetchProjects();
    refreshUser(); // Refresh user data to get latest credits
  }, [fetchProjects, refreshUser]);

  // Credit data from user object
  const creditData = user?.credits ? {
    monthly: { remaining: user.credits.monthly, total: user.credits.monthly_total },
    bonus: { remaining: user.credits.bonus, total: user.credits.bonus_total },
    purchased: user.credits.purchased,
    starter: user.credits.starter || 0,
  } : {
    monthly: { remaining: 0, total: 0 },
    bonus: { remaining: 0, total: 0 },
    purchased: 0,
    starter: 20,
  };

  // Plan data from user
  const planData = {
    name: user?.plan?.charAt(0).toUpperCase() + (user?.plan?.slice(1) || ''),
    price: user?.plan === 'free' ? '$0' : user?.plan === 'creator' ? '$9.99' : user?.plan === 'pro' ? '$19.99' : '$29.99',
    nextBillingDate: 'Not set',
  };

  // Bonus credit timer
  useEffect(() => {
    const calculateTimeUntilBonus = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    };
    setTimeUntilBonus(calculateTimeUntilBonus());
    const interval = setInterval(() => {
      setTimeUntilBonus(calculateTimeUntilBonus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = async (projectId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
      } else {
        console.error('Failed to delete project');
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleDuplicateProject = async (projectId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/builder/duplicate/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        fetchProjects(); // Refresh project list
      } else {
        console.error('Failed to duplicate project');
      }
    } catch (err) {
      console.error('Failed to duplicate project:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const config = {
      published: { style: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Live', icon: <CheckCircle className="w-3 h-3" /> },
      staged: { style: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Staging', icon: <Loader2 className="w-3 h-3" /> },
      building: { style: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Building', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
      draft: { style: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Draft', icon: <FileText className="w-3 h-3" /> },
    };
    const { style, label, icon } = config[status] || config.draft;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border ${style}`}>
        {icon}
        {label}
      </span>
    );
  };

  const getProjectTypeIcon = (project) => {
    if (project.type === 'website') return <Globe className="w-4 h-4 text-blue-400" />;
    if (project.type === 'both') return <Layers className="w-4 h-4 text-purple-400" />;
    return <Smartphone className="w-4 h-4 text-green-400" />;
  };

  const totalCredits = creditData.monthly.remaining + creditData.bonus.remaining + creditData.purchased + creditData.starter;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="transition-transform hover:scale-105">
              <Logo size={36} />
            </Link>

            <div className="flex items-center gap-4">
              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg transition-all hover:border-yellow-500/30">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">{totalCredits}</span>
                <span className="text-gray-400 text-sm">credits</span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                    <img
                      src={user?.avatar || 'https://i.pravatar.cc/40'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                  <div className="px-3 py-2 border-b border-gray-800">
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                  </div>
                  {(user?.role === 'owner' || user?.role === 'admin') && (
                    <DropdownMenuItem onClick={() => navigate('/owner')} className="text-purple-400 focus:text-purple-300 focus:bg-purple-500/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Owner Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="text-gray-300 focus:text-white focus:bg-gray-800">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings/billing')} className="text-gray-300 focus:text-white focus:bg-gray-800">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-gray-400 mt-1">Here's an overview of your account and projects.</p>
        </div>

        {/* Top Row - Credit Overview & Plan Status */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Credit Overview */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700" data-testid="credit-overview-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Credit Overview
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <span className="text-yellow-400 font-bold">{totalCredits}</span>
                <span className="text-yellow-400/70 text-sm">total</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-gray-400 text-xs">Monthly</span>
                </div>
                <p className="text-xl font-bold text-white">{creditData.monthly.remaining}</p>
                <p className="text-gray-500 text-xs">of {creditData.monthly.total}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Gift className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-gray-400 text-xs">Bonus</span>
                </div>
                <p className="text-xl font-bold text-white">{creditData.bonus.remaining}</p>
                <p className="text-gray-500 text-xs">of {creditData.bonus.total}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShoppingCart className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-gray-400 text-xs">Purchased</span>
                </div>
                <p className="text-xl font-bold text-white">{creditData.purchased}</p>
                <p className="text-gray-500 text-xs">never expires</p>
              </div>
            </div>

            {/* Next Bonus Refresh */}
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 text-sm">Next Bonus Refresh</span>
                </div>
                <span className="text-white font-medium">
                  {timeUntilBonus ? `${timeUntilBonus.hours}h ${timeUntilBonus.minutes}m` : '--:--'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link to="/settings/billing" className="flex-1">
                <Button className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Credits
                </Button>
              </Link>
              <Link to="/credits">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <History className="w-4 h-4 mr-2" />
                  View Rules
                </Button>
              </Link>
            </div>
          </div>

          {/* Plan Status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700" data-testid="plan-status-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-400" />
                Plan Status
              </h2>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 text-sm">Current Plan</span>
                <Rocket className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{planData.name}</p>
              <p className="text-gray-400 text-sm">{planData.price}/month</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-xs mb-1">Next Billing</p>
                <p className="text-white font-medium text-sm">{planData.nextBillingDate}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-xs mb-1">Monthly Credits</p>
                <p className="text-white font-medium text-sm">{creditData.monthly.total}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link to="/pricing" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
              <Link to="/settings/billing">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8 transition-all hover:border-gray-700" data-testid="quick-actions-section">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={() => navigate('/new-project')}
              className="p-4 bg-gray-800/50 hover:bg-blue-600/10 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all group text-left card-hover"
              data-testid="quick-action-screen"
            >
              <Layout className="w-6 h-6 text-blue-400 mb-2 transition-transform group-hover:scale-110" />
              <p className="text-white font-medium">Generate Screen</p>
              <p className="text-gray-500 text-xs mt-1">Create a new screen with AI</p>
            </button>
            <button 
              onClick={() => navigate('/new-project')}
              className="p-4 bg-gray-800/50 hover:bg-purple-600/10 border border-gray-700 hover:border-purple-500/30 rounded-xl transition-all group text-left card-hover"
              data-testid="quick-action-page"
            >
              <FileText className="w-6 h-6 text-purple-400 mb-2 transition-transform group-hover:scale-110" />
              <p className="text-white font-medium">Generate Page</p>
              <p className="text-gray-500 text-xs mt-1">Build a full page layout</p>
            </button>
            <button 
              onClick={() => projects.length > 0 && navigate(`/builder/${projects[0].id}`)}
              className="p-4 bg-gray-800/50 hover:bg-green-600/10 border border-gray-700 hover:border-green-500/30 rounded-xl transition-all group text-left card-hover"
              data-testid="quick-action-refine"
            >
              <Wand2 className="w-6 h-6 text-green-400 mb-2 transition-transform group-hover:scale-110" />
              <p className="text-white font-medium">Refine Project</p>
              <p className="text-gray-500 text-xs mt-1">Improve existing work</p>
            </button>
            <button 
              onClick={() => projects.length > 0 && navigate(`/builder/${projects[0].id}`)}
              className="p-4 bg-gray-800/50 hover:bg-orange-600/10 border border-gray-700 hover:border-orange-500/30 rounded-xl transition-all group text-left card-hover"
              data-testid="quick-action-publish"
            >
              <Upload className="w-6 h-6 text-orange-400 mb-2 transition-transform group-hover:scale-110" />
              <p className="text-white font-medium">Publish</p>
              <p className="text-gray-500 text-xs mt-1">Deploy your app live</p>
            </button>
          </div>
        </div>

        {/* Your Projects */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700" data-testid="projects-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Your Projects</h2>
              <p className="text-gray-400 text-sm">{projects.length} projects total</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={() => navigate('/new-project')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group bg-gray-800/30 border border-gray-700 hover:border-blue-500/30 rounded-xl overflow-hidden transition-all card-hover stagger-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Preview */}
                  <div className="relative h-40 bg-gray-800 overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      {getStatusBadge(project.status)}
                      {getProjectTypeIcon(project)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium truncate flex-1">{project.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                          <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDuplicateProject(project.id)}
                            className="text-gray-300 focus:text-white focus:bg-gray-800"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Just created'}
                      </span>
                      <Link to={`/builder/${project.id}`}>
                        <Button size="sm" className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 h-8">
                          Open
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-white font-medium mb-2">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Create your first project to get started'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate('/new-project')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Project
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
