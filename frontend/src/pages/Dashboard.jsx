import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../data/mock';
import Logo from '../components/Logo';
import CreditUsageTracker from '../components/CreditUsageTracker';
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
  Zap,
  Smartphone,
  Globe,
  Layers,
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const styles = {
      deployed: 'bg-green-500/20 text-green-400 border-green-500/30',
      building: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const icons = {
      deployed: <Rocket className="w-3 h-3" />,
      building: <Loader2 className="w-3 h-3 animate-spin" />,
      error: <span className="w-3 h-3">!</span>,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getProjectTypeIcon = (project) => {
    if (project.type === 'website') return <Globe className="w-4 h-4 text-blue-400" />;
    if (project.type === 'both') return <Layers className="w-4 h-4 text-purple-400" />;
    return <Smartphone className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <Logo size={36} />
            </Link>

            <div className="flex items-center gap-4">
              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">{user?.credits || 0}</span>
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
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="text-gray-300 focus:text-white focus:bg-gray-800">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings/billing')} className="text-gray-300 focus:text-white focus:bg-gray-800">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-gray-800">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Projects</h1>
            <p className="text-gray-400 mt-1">{projects.length} projects total</p>
          </div>
          <Button
            onClick={() => navigate('/new-project')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 max-w-md"
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getProjectTypeIcon(project)}
                      <h3 className="text-white font-semibold truncate">{project.name}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                        <DropdownMenuItem
                          onClick={() => navigate(`/builder/${project.id}`)}
                          className="text-gray-300 focus:text-white focus:bg-gray-800"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Open Project
                        </DropdownMenuItem>
                        {project.url && (
                          <DropdownMenuItem
                            onClick={() => window.open(project.url, '_blank')}
                            className="text-gray-300 focus:text-white focus:bg-gray-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Live
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-400 focus:text-red-300 focus:bg-gray-800"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {project.lastEdited}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/builder/${project.id}`)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-3"
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
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
      </main>
    </div>
  );
};

export default Dashboard;
