
import React from 'react';
import { ClockIcon } from './icons/ClockIcon';

interface TimerProps {
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-4 z-10 w-full flex justify-center mb-4">
        <div className="flex items-center justify-center bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-200 font-mono text-lg rounded-full px-4 py-2 shadow-lg">
            <ClockIcon className="w-5 h-5 mr-2 text-purple-400" />
            <span>{formatTime()}</span>
        </div>
    </div>
  );
};
