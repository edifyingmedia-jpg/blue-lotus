import React, { createContext, useContext, useState } from 'react';

// Role definitions with permissions
const ROLE_CONFIG = {
  owner: {
    name: 'Owner',
    description: 'Full control of account and projects.',
    color: 'purple',
    permissions: [
      'create_projects',
      'delete_projects',
      'edit_projects',
      'publish_projects',
      'publish_production',
      'export_projects',
      'manage_billing',
      'manage_team',
      'modify_settings',
      'generate_screens',
      'generate_pages',
      'view_projects',
      'preview_screens',
      'preview_pages',
    ],
  },
  editor: {
    name: 'Editor',
    description: 'Can build and edit projects but cannot manage billing.',
    color: 'blue',
    permissions: [
      'create_projects',
      'edit_projects',
      'generate_screens',
      'generate_pages',
      'publish_staging',
      'view_projects',
      'preview_screens',
      'preview_pages',
    ],
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access to assigned projects.',
    color: 'gray',
    permissions: [
      'view_projects',
      'preview_screens',
      'preview_pages',
    ],
  },
};

// Permission descriptions for UI
const PERMISSION_LABELS = {
  create_projects: 'Create Projects',
  delete_projects: 'Delete Projects',
  edit_projects: 'Edit Projects',
  publish_projects: 'Publish Projects',
  publish_staging: 'Publish to Staging',
  publish_production: 'Publish to Production',
  export_projects: 'Export Projects',
  manage_billing: 'Manage Billing',
  manage_team: 'Manage Team Members',
  modify_settings: 'Modify Settings',
  generate_screens: 'Generate Screens',
  generate_pages: 'Generate Pages',
  view_projects: 'View Projects',
  preview_screens: 'Preview Screens',
  preview_pages: 'Preview Pages',
};

// Permission categories for organized display
const PERMISSION_CATEGORIES = {
  projects: {
    label: 'Projects',
    permissions: ['create_projects', 'edit_projects', 'delete_projects', 'view_projects'],
  },
  generation: {
    label: 'AI Generation',
    permissions: ['generate_screens', 'generate_pages'],
  },
  publishing: {
    label: 'Publishing',
    permissions: ['publish_staging', 'publish_projects', 'publish_production', 'export_projects'],
  },
  preview: {
    label: 'Preview',
    permissions: ['preview_screens', 'preview_pages'],
  },
  account: {
    label: 'Account',
    permissions: ['manage_billing', 'manage_team', 'modify_settings'],
  },
};

const RolesContext = createContext(null);

export const RolesProvider = ({ children }) => {
  // Current user's role (mock)
  const [currentUserRole, setCurrentUserRole] = useState('owner');
  
  // Team members (mock)
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', avatar: 'https://i.pravatar.cc/40?u=1' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor', avatar: 'https://i.pravatar.cc/40?u=2' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'viewer', avatar: 'https://i.pravatar.cc/40?u=3' },
  ]);

  const roleConfig = ROLE_CONFIG[currentUserRole] || ROLE_CONFIG.viewer;

  // Check if current user has a specific permission
  const hasPermission = (permission) => {
    return roleConfig.permissions.includes(permission);
  };

  // Check if current user has any of the given permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(p => roleConfig.permissions.includes(p));
  };

  // Check if current user has all of the given permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(p => roleConfig.permissions.includes(p));
  };

  // Get role config by role id
  const getRoleConfig = (roleId) => {
    return ROLE_CONFIG[roleId] || ROLE_CONFIG.viewer;
  };

  // Get all available roles
  const getAllRoles = () => {
    return Object.entries(ROLE_CONFIG).map(([id, config]) => ({
      id,
      ...config,
    }));
  };

  // Check if a role has a specific permission
  const roleHasPermission = (roleId, permission) => {
    const role = ROLE_CONFIG[roleId];
    return role ? role.permissions.includes(permission) : false;
  };

  // Add team member
  const addTeamMember = (member) => {
    const newMember = {
      id: Date.now().toString(),
      ...member,
      avatar: `https://i.pravatar.cc/40?u=${Date.now()}`,
    };
    setTeamMembers([...teamMembers, newMember]);
    return newMember;
  };

  // Update team member role
  const updateMemberRole = (memberId, newRole) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
  };

  // Remove team member
  const removeMember = (memberId) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
  };

  // Get current user's permissions list
  const getCurrentPermissions = () => {
    return roleConfig.permissions;
  };

  const value = {
    currentUserRole,
    setCurrentUserRole,
    roleConfig,
    teamMembers,
    setTeamMembers,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRoleConfig,
    getAllRoles,
    roleHasPermission,
    addTeamMember,
    updateMemberRole,
    removeMember,
    getCurrentPermissions,
    ROLE_CONFIG,
    PERMISSION_LABELS,
    PERMISSION_CATEGORIES,
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};

export default RolesContext;
