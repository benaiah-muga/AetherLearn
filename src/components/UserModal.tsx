import React, { useState, useEffect } from 'react';
import { User } from './StaffPortal';
import { XIcon } from './icons/XIcon';
import { UsersIcon } from './icons/UsersIcon';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    } else {
      setName('');
      setEmail('');
    }
    setError('');
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
        setError('Name and email cannot be empty.');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    onSave({
        id: user ? user.id : '', // ID is handled in parent
        name: name.trim(),
        email: email.trim(),
        joinDate: user ? user.joinDate : '', // Handled in parent
    });
  };

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
        <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-500 hover:text-white" aria-label="Close modal">
            <XIcon className="w-5 h-5" />
        </button>
        <div className="p-8 text-center">
          <UsersIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-slate-100">{user ? 'Edit User' : 'Add New User'}</h3>
          <p className="text-sm text-slate-400 mt-1">
            {user ? 'Update the details for this user.' : 'Enter the details for the new user.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            <div>
                <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-slate-300 text-left">Full Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                    required
                />
            </div>
            <div>
                <label htmlFor="email"className="block mb-1.5 text-sm font-medium text-slate-300 text-left">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                    required
                 />
            </div>

            {error && <p className="text-sm text-red-400 text-center bg-red-900/40 p-2 rounded-md">{error}</p>}
            
            <div className="flex justify-end items-center gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-colors"
                >
                    {user ? 'Save Changes' : 'Add User'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};