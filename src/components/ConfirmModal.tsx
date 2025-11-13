import React from 'react';
import { XIcon } from './icons/XIcon';
import { ShieldIcon } from './icons/ShieldIcon';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
            <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <ShieldIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-4 text-left">
                    <h3 className="text-lg leading-6 font-bold text-slate-100" id="modal-title">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-slate-400">
                           {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-slate-800/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
             <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onConfirm}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
            >
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};