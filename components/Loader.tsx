
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-lg shadow-xl">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-purple-400"></div>
      <p className="mt-4 text-lg font-medium text-slate-200">{message}</p>
      <p className="text-sm text-slate-400">AI is thinking...</p>
    </div>
  );
};
