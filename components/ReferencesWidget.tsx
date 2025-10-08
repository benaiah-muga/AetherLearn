
import React from 'react';
import { Reference } from '../types';

interface ReferencesWidgetProps {
  references: Reference[];
}

const ReferenceCard: React.FC<{ reference: Reference; index: number }> = ({ reference, index }) => {
  return (
    <a href={reference.uri} target="_blank" rel="noopener noreferrer" 
       className="block p-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-x-1"
       style={{ animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}
       title={reference.uri}
       >
      <h4 className="text-sm font-semibold text-purple-300 truncate">{reference.title || "Untitled Source"}</h4>
      <p className="text-xs text-slate-400 truncate mt-1">{new URL(reference.uri).hostname}</p>
    </a>
  );
};

export const ReferencesWidget: React.FC<ReferencesWidgetProps> = ({ references }) => {
  const isOpen = references.length > 0;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <aside className={`
        fixed top-8 right-8 z-20 w-80 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg p-4 
        transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2rem)] opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-200 mb-4">References</h3>
            <div className="space-y-3 overflow-y-auto pr-2 max-h-[calc(100vh-12rem)]">
                {references.map((ref, index) => (
                    <ReferenceCard key={index} reference={ref} index={index} />
                ))}
            </div>
        </div>
      </aside>
    </>
  );
};
