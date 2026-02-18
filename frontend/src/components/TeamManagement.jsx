import React, { useState } from 'react';
import { useRoles } from '../context/RolesContext';
import { usePlanEnforcement } from '../context/PlanEnforcementContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Users,
  UserPlus,
  MoreVertical,
  Shield,
  Edit3,
  Eye,
  Trash2,
  ChevronDown,
  Check,
  X,
  Crown,
  Lock,
  Mail,
} from 'lucide-react';

const roleIcons = {
  owner: Crown,
  editor: Edit3,
  viewer: Eye,
};

const roleColors = {
  owner: 'purple',
  editor: 'blue',
  viewer: 'gray',
};

const TeamManagement = () => {
  const { 
    teamMembers, 
    currentUserRole,
    hasPermission,
    getAllRoles,
    getRoleConfig,
    addTeamMember,
    updateMemberRole,
    removeMember,
    PERMISSION_LABELS,
    PERMISSION_CATEGORIES,
  } = useRoles();

  const { currentPlan, attemptAction } = usePlanEnforcement();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'editor' });

  const canManageTeam = hasPermission('manage_team');
  const roles = getAllRoles();

  const handleInvite = () => {
    // Check plan allows team access
    const result = attemptAction('teamAccess');
    if (!result.allowed) return;

    if (inviteData.email && inviteData.name) {
      addTeamMember(inviteData);
      setInviteData({ email: '', name: '', role: 'editor' });
      setShowInviteModal(false);
    }
  };

  const handleRoleChange = (memberId, newRole) => {
    if (!canManageTeam) return;
    updateMemberRole(memberId, newRole);
  };

  const handleRemoveMember = (memberId) => {
    if (!canManageTeam) return;
    removeMember(memberId);
  };

  const viewRolePermissions = (roleId) => {
    setSelectedRole(roleId);
    setShowPermissionsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Team Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage team members and their access levels.
          </p>
        </div>
        
        {canManageTeam && (
          <Button
            onClick={() => {
              const result = attemptAction('teamAccess');
              if (result.allowed) setShowInviteModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="invite-member-btn"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Role Legend */}
      <div className="grid md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = roleIcons[role.id];
          const color = roleColors[role.id];
          return (
            <button
              key={role.id}
              onClick={() => viewRolePermissions(role.id)}
              className={`p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-left hover:border-${color}-500/30 transition-all group`}
              data-testid={`role-card-${role.id}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <div>
                  <p className="text-white font-medium">{role.name}</p>
                  <p className="text-gray-500 text-xs">{role.permissions.length} permissions</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{role.description}</p>
            </button>
          );
        })}
      </div>

      {/* Team Members List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-white font-medium">Team Members ({teamMembers.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-800">
          {teamMembers.map((member) => {
            const memberRole = getRoleConfig(member.role);
            const Icon = roleIcons[member.role];
            const color = roleColors[member.role];
            const isCurrentUser = member.role === 'owner' && currentUserRole === 'owner';
            
            return (
              <div 
                key={member.id} 
                className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                data-testid={`team-member-${member.id}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium flex items-center gap-2">
                      {member.name}
                      {isCurrentUser && (
                        <span className="text-xs text-gray-500">(You)</span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Role Badge */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 bg-${color}-500/10 border border-${color}-500/20 rounded-full`}>
                    <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
                    <span className={`text-${color}-400 text-sm font-medium`}>{memberRole.name}</span>
                  </div>

                  {/* Actions */}
                  {canManageTeam && !isCurrentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 w-48">
                        <div className="px-2 py-1.5 text-xs text-gray-500">Change Role</div>
                        {roles.map((role) => (
                          <DropdownMenuItem
                            key={role.id}
                            onClick={() => handleRoleChange(member.id, role.id)}
                            className={`text-gray-300 focus:text-white focus:bg-gray-800 ${
                              member.role === role.id ? 'bg-gray-800/50' : ''
                            }`}
                          >
                            {member.role === role.id && (
                              <Check className="w-4 h-4 mr-2 text-green-400" />
                            )}
                            <span className={member.role !== role.id ? 'ml-6' : ''}>{role.name}</span>
                          </DropdownMenuItem>
                        ))}
                        <div className="border-t border-gray-800 my-1" />
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Permissions */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Your Permissions ({getRoleConfig(currentUserRole).name})
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {getRoleConfig(currentUserRole).permissions.map((perm) => (
            <div key={perm} className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">{PERMISSION_LABELS[perm]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Send an invitation to join your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">Name</label>
              <Input
                value={inviteData.name}
                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                placeholder="John Doe"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.filter(r => r.id !== 'owner').map((role) => {
                  const Icon = roleIcons[role.id];
                  const isSelected = inviteData.role === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setInviteData({ ...inviteData, role: role.id })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-600/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                      <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>{role.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              {selectedRole && getRoleConfig(selectedRole).name} Permissions
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedRole && getRoleConfig(selectedRole).description}
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="py-4 space-y-4">
              {Object.entries(PERMISSION_CATEGORIES).map(([catId, category]) => {
                const rolePerms = getRoleConfig(selectedRole).permissions;
                const categoryPerms = category.permissions.filter(p => 
                  Object.keys(PERMISSION_LABELS).includes(p)
                );
                
                return (
                  <div key={catId}>
                    <h4 className="text-gray-400 text-sm font-medium mb-2">{category.label}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryPerms.map((perm) => {
                        const hasIt = rolePerms.includes(perm);
                        return (
                          <div 
                            key={perm}
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              hasIt ? 'bg-green-500/10' : 'bg-gray-800/30'
                            }`}
                          >
                            {hasIt ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <X className="w-4 h-4 text-gray-600" />
                            )}
                            <span className={hasIt ? 'text-green-300 text-sm' : 'text-gray-500 text-sm'}>
                              {PERMISSION_LABELS[perm]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowPermissionsModal(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
