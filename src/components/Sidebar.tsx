

import React from 'react';
import { QuizHistoryItem, AppView, AgentPersonality } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { XIcon } from './icons/XIcon';
import { BadgeIcon } from './icons/BadgeIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { ChatIcon } from './icons/ChatIcon';
import { QuizIcon } from './icons/QuizIcon';
import { ClockIcon } from './icons/ClockIcon';
import { UserIcon } from './icons/UserIcon';
import { MaskIcon } from './icons/MaskIcon';
import { ToolboxIcon } from './icons/ToolboxIcon';

interface SidebarProps {
  quizHistory: QuizHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  appView: AppView;
  setAppView: (view: AppView) => void;
  agentPersonality: AgentPersonality;
  setAgentPersonality: (personality: AgentPersonality) => void;
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
      w-full inline-flex items-center justify-start px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
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

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PERSONALITIES: AgentPersonality[] = ['Aether', 'Socrates', 'Shakespeare', 'AdaLovelace'];

const PERSONALITY_TOOLTIPS: Record<AgentPersonality, string> = {
  Aether: "Casual, witty, and encouraging. Your cool, knowledgeable friend.",
  Socrates: "Guides you with questions. Never gives a direct answer. Uses the Socratic method.",
  Shakespeare: "Speaks in grand, Elizabethan-era style and poetry.",
  AdaLovelace: "Analytical and imaginative, bridging the gap between technology and artistry."
};


export const Sidebar: React.FC<SidebarProps> = ({ quizHistory, isOpen, onClose, appView, setAppView, agentPersonality, setAgentPersonality }) => {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-slate-950 border-r border-slate-800 p-4 space-y-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-white pl-2">AetherLearn</h1>
         <button 
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white"
            aria-label="Close sidebar"
        >
            <XIcon className="w-6 h-6"/>
        </button>
      </div>
      
      <nav className="space-y-2">
         <NavButton 
            icon={<ChatIcon />}
            label="Chat Agent"
            isActive={appView === 'chat'}
            onClick={() => setAppView('chat')}
        />
        <NavButton 
            icon={<QuizIcon />}
            label="Quiz Generator"
            isActive={appView === 'quiz-generator'}
            onClick={() => setAppView('quiz-generator')}
        />
         <NavButton 
            icon={<ToolboxIcon />}
            label="Tools"
            isActive={appView === 'tools'}
            onClick={() => setAppView('tools')}
        />
        <NavButton 
            icon={<BadgeIcon />}
            label="My Badges"
            isActive={appView === 'badges'}
            onClick={() => setAppView('badges')}
        />
        <NavButton 
            icon={<UserIcon />}
            label="My Profile"
            isActive={appView === 'profile'}
            onClick={() => setAppView('profile')}
        />
      </nav>

      <div className="border-t border-slate-800 pt-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center px-2">
          <MaskIcon className="w-5 h-5 mr-2" />
          Agent Personality
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {PERSONALITIES.map(p => (
            <div key={p} className="relative group">
              <button
                onClick={() => setAgentPersonality(p)}
                className={`
                  w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 text-center
                  ${agentPersonality === p 
                    ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }
                `}
              >
                {p}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-950 text-white text-xs text-center rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-slate-700">
                {PERSONALITY_TOOLTIPS[p]}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950"></div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="flex-1 overflow-y-auto pr-2 border-t border-slate-800 pt-4">
        <h2 className="text-lg font-semibold text-slate-300 mb-3 flex items-center px-2">
          <HistoryIcon className="w-5 h-5 mr-2 text-slate-400"/>
          Quiz History
        </h2>
        {quizHistory.length > 0 ? (
          <ul className="space-y-2">
            {quizHistory.map((item) => (
              <li key={item.id} className="bg-slate-800/70 p-3 rounded-md border border-slate-700/50">
                <p className="text-sm font-medium text-slate-200 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                <div className="flex justify-between items-center mt-1 text-xs text-slate-400">
                    <p>{item.date}</p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center" title="Time Taken">
                            <ClockIcon className="w-3.5 h-3.5 mr-1"/>
                            <span>{formatTime(item.timeTaken)}</span>
                        </div>
                        <p className={`text-sm font-semibold ${item.score / item.totalQuestions >= 0.8 ? 'text-green-400' : 'text-amber-400'}`}>
                            {item.score}/{item.totalQuestions}
                        </p>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm text-slate-500 mt-6 p-4 bg-slate-800/50 rounded-md">
            <p>Your completed quizzes will appear here.</p>
          </div>
        )}
      </div>
      
      <div className="border-t border-slate-800 pt-4">
          <NavButton 
            icon={<ShieldIcon />}
            label="Staff Portal"
            isActive={appView === 'staff'}
            onClick={() => setAppView('staff')}
        />
      </div>
    </aside>
  );
};