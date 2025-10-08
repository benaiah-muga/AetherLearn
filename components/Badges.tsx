
import React from 'react';
import { BadgeId } from '../types';
import { ALL_BADGES } from '../badges';
import { BadgeCard } from './BadgeCard';
import { BadgeIcon } from './icons/BadgeIcon';

interface BadgesProps {
  earnedBadges: Set<BadgeId>;
}

export const Badges: React.FC<BadgesProps> = ({ earnedBadges }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <BadgeIcon className="w-12 h-12 text-purple-400 mb-3" />
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">My Badges</h2>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Here are all the achievements you can earn on AetherLearn. Unlocked badges are shown in color. Keep learning to collect them all!
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {ALL_BADGES.map(badge => (
          <BadgeCard 
            key={badge.id}
            badge={badge}
            isEarned={earnedBadges.has(badge.id)}
          />
        ))}
      </div>
    </div>
  );
};
