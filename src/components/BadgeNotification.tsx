
import React, { useEffect, useState } from 'react';
import { Badge } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';

interface BadgeNotificationProps {
  badge: Badge;
  onDismiss: () => void;
}

export const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Set timer to dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Allow time for fade-out animation before calling onDismiss
      setTimeout(onDismiss, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = badge.icon || TrophyIcon;

  return (
    <div 
      className={`
        flex items-center w-full max-w-xs p-4 text-slate-200 bg-slate-800 rounded-lg shadow-lg border border-purple-500/50
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-purple-400 bg-purple-900/50 rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-normal">
        <p className="text-xs text-slate-400">Badge Unlocked!</p>
        <p className="font-semibold">{badge.name}</p>
      </div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg focus:ring-2 focus:ring-slate-600 p-1.5 inline-flex h-8 w-8" 
        aria-label="Close"
        onClick={() => setIsVisible(false)}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};