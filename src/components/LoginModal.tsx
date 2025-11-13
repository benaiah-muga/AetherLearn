
import React, { useState } from 'react';
import { ShieldIcon } from './icons/ShieldIcon';
import { XIcon } from './icons/XIcon';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (username === 'admin' && password === 'password') {
      onLogin(true);
    } else {
      setError('Invalid username or password.');
      onLogin(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm border border-slate-700 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-500 hover:text-white" aria-label="Close modal">
            <XIcon className="w-5 h-5" />
        </button>
        <div className="p-8 text-center">
          <ShieldIcon className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-slate-100">Staff Portal Login</h3>
          <p className="text-sm text-slate-400 mt-1">Please enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
            <div>
                <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-slate-300 text-left">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                    required
                />
            </div>
            <div>
                <label htmlFor="password"className="block mb-1.5 text-sm font-medium text-slate-300 text-left">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                    required
                 />
            </div>

            {error && <p className="text-sm text-red-400 text-center bg-red-900/40 p-2 rounded-md">{error}</p>}
            
            <button
                type="submit"
                className="w-full px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-colors"
            >
                Login
            </button>
        </form>
      </div>
    </div>
  );
};