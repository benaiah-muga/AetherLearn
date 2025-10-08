import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { KeyIcon } from './icons/KeyIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { XIcon } from './icons/XIcon';

// Interfaces
interface ModelProvider {
  id: string;
  name: 'Groq' | 'OpenAI' | 'Google AI' | 'Anthropic';
  apiKey: string;
  apiEndpoint?: string;
}

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: Omit<ModelProvider, 'id'>) => void;
  provider: ModelProvider | null;
}

// Mock Data
const mockProviders: ModelProvider[] = [
    { id: 'prov_1', name: 'Google AI', apiKey: 'gsk_...xyz', apiEndpoint: 'https://generativelanguage.googleapis.com' },
    { id: 'prov_2', name: 'Groq', apiKey: 'grq_...abc' },
];

// Reusable Modal Component for this view
const ProviderModal: React.FC<ProviderModalProps> = ({ isOpen, onClose, onSave, provider }) => {
    const [name, setName] = useState<'Groq' | 'OpenAI' | 'Google AI' | 'Anthropic'>(provider?.name || 'Google AI');
    const [apiKey, setApiKey] = useState(provider?.apiKey || '');
    const [apiEndpoint, setApiEndpoint] = useState(provider?.apiEndpoint || '');
    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !apiKey.trim()) {
            setError('Provider name and API Key are required.');
            return;
        }
        onSave({ name, apiKey, apiEndpoint });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-500 hover:text-white" aria-label="Close modal">
                    <XIcon className="w-5 h-5" />
                </button>
                <div className="p-8 text-center">
                    <KeyIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-slate-100">{provider ? 'Edit Provider' : 'Add New Provider'}</h3>
                </div>
                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                    <div>
                        <label htmlFor="providerName" className="block mb-1.5 text-sm font-medium text-slate-300 text-left">Provider Name</label>
                        <select
                            id="providerName"
                            value={name}
                            onChange={(e) => setName(e.target.value as any)}
                            className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                        >
                            <option value="Google AI">Google AI (Gemini)</option>
                            <option value="OpenAI">OpenAI</option>
                            <option value="Groq">Groq</option>
                            <option value="Anthropic">Anthropic (Claude)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="apiKey" className="block mb-1.5 text-sm font-medium text-slate-300 text-left">API Key</label>
                        <div className="relative">
                            <input
                                type={isKeyVisible ? 'text' : 'password'}
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsKeyVisible(!isKeyVisible)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white"
                                aria-label={isKeyVisible ? 'Hide API Key' : 'Show API Key'}
                            >
                                {isKeyVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="apiEndpoint" className="block mb-1.5 text-sm font-medium text-slate-300 text-left">API Endpoint (Optional)</label>
                        <input
                            type="text"
                            id="apiEndpoint"
                            value={apiEndpoint}
                            onChange={(e) => setApiEndpoint(e.target.value)}
                            placeholder="e.g., https://api.groq.com/openai/v1"
                            className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <div className="flex justify-end items-center gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">{provider ? 'Save Changes' : 'Add Provider'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ApiKeyDisplay: React.FC<{ apiKey: string }> = ({ apiKey }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="flex items-center space-x-2 font-mono">
            <span>{isVisible ? apiKey : '••••••••••••••••••••'}</span>
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="text-slate-400 hover:text-white"
                aria-label={isVisible ? 'Hide API Key' : 'Show API Key'}
            >
                {isVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
        </div>
    );
};

// Main Component
export const ModelProviders: React.FC = () => {
    const [providers, setProviders] = useState<ModelProvider[]>(mockProviders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [providerToEdit, setProviderToEdit] = useState<ModelProvider | null>(null);
    // Add state for confirm delete modal if needed later

    const handleOpenAddModal = () => {
        setProviderToEdit(null);
        setIsModalOpen(true);
    };
    
    const handleSaveProvider = (providerData: Omit<ModelProvider, 'id'>) => {
        // This is a mock implementation. A real app would save to a backend.
        if (providerToEdit) {
            setProviders(providers.map(p => p.id === providerToEdit.id ? { ...providerToEdit, ...providerData } : p));
        } else {
            const newProvider = { ...providerData, id: `prov_${new Date().getTime()}` };
            setProviders([newProvider, ...providers]);
        }
    };

    return (
        <>
            <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                <div className="p-4 sm:p-6 flex justify-between items-center border-b border-slate-700">
                    <h3 className="text-xl font-semibold text-slate-100">Configured Providers</h3>
                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        <PlusIcon className="w-5 h-5 mr-1.5" />
                        Add Provider
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Provider</th>
                                <th scope="col" className="px-6 py-3">API Key</th>
                                <th scope="col" className="px-6 py-3">Endpoint</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {providers.map((provider) => (
                                <tr key={provider.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-white">{provider.name}</td>
                                    <td className="px-6 py-4"><ApiKeyDisplay apiKey={provider.apiKey} /></td>
                                    <td className="px-6 py-4 font-mono text-xs">{provider.apiEndpoint || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="p-2 text-slate-400 hover:text-amber-400" aria-label="Edit provider">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-400" aria-label="Delete provider">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProviderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProvider}
                provider={providerToEdit}
            />
        </>
    );
};
