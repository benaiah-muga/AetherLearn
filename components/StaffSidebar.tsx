import React from 'react';
import { DashboardIcon } from './icons/DashboardIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CogIcon } from './icons/CogIcon';
import { KeyIcon } from './icons/KeyIcon';

type StaffViewType = 'dashboard' | 'users' | 'analytics' | 'system' | 'providers';

interface StaffSidebarProps {
  view: StaffViewType;
  setView: (view: StaffViewType) => void;
}

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full inline-flex items-center justify-start px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-left
      ${isActive 
        ? 'bg-purple-600 text-white' 
        : 'text-slate-300 hover:bg-slate-800'
      }
    `}
  >
    <span className="w-5 h-5 mr-3">{icon}</span>
    {label}
  </button>
);

export const StaffSidebar: React.FC<StaffSidebarProps> = ({ view, setView }) => {
  return (
    <aside className="w-64 bg-slate-950/70 border-r border-slate-800 p-4 flex-shrink-0">
      <nav className="space-y-2">
        <NavButton
          icon={<DashboardIcon />}
          label="Dashboard"
          isActive={view === 'dashboard'}
          onClick={() => setView('dashboard')}
        />
        <NavButton
          icon={<UsersIcon />}
          label="User Management"
          isActive={view === 'users'}
          onClick={() => setView('users')}
        />
        <NavButton
          icon={<ChartBarIcon />}
          label="Content Analytics"
          isActive={view === 'analytics'}
          onClick={() => setView('analytics')}
        />
        <NavButton
          icon={<CogIcon />}
          label="System Status"
          isActive={view === 'system'}
          onClick={() => setView('system')}
        />
        <NavButton
          icon={<KeyIcon />}
          label="Model Providers"
          isActive={view === 'providers'}
          onClick={() => setView('providers')}
        />
      </nav>
    </aside>
  );
};
