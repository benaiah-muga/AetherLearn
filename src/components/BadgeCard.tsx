
import React from 'react';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned }) => {
  const Icon = badge.icon;

  return (
    <div 
      className={`
        relative group flex flex-col items-center justify-center text-center p-4 rounded-lg border 
        transition-all duration-300 transform
        ${isEarned 
          ? 'bg-slate-800/70 border-purple-500/50 shadow-lg hover:-translate-y-1' 
          : 'bg-slate-800/30 border-slate-700'
        }
      `}
    >
      <div className={`
        w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-3 
        transition-all duration-300
        ${isEarned ? 'bg-purple-500/20' : 'bg-slate-700/50'}
      `}>
        <Icon 
          className={`
            w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300
            ${isEarned ? 'text-purple-400' : 'text-slate-500'}
          `}
        />
      </div>
      <h3 className={`
        font-semibold text-sm sm:text-base
        ${isEarned ? 'text-slate-100' : 'text-slate-400'}
      `}>
        {badge.name}
      </h3>

      {/* Tooltip for description */}
      <div className="absolute bottom-full mb-2 w-48 lg:w-56 p-3 bg-slate-950 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-slate-700">
        {badge.description}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-950"></div>
      </div>
    </div>
  );
};