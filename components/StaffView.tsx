import React, { useState } from 'react';
import { StaffPortal } from './StaffPortal';
import { LogoutIcon } from './icons/LogoutIcon';
import { StaffSidebar } from './StaffSidebar';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CogIcon } from './icons/CogIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { ClockIcon } from './icons/ClockIcon';
import { QuizIcon } from './icons/QuizIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ModelProviders } from './ModelProviders';

type StaffViewType = 'dashboard' | 'users' | 'analytics' | 'system' | 'providers';

// This component is copied from StaffPortal.tsx to be used for the dashboard view.
const DashboardCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center">
            <div className="p-3 bg-slate-700/50 rounded-lg mr-4">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex items-center">
        <div className="p-3 bg-slate-700/50 rounded-lg mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const viewTitles: Record<StaffViewType, string> = {
    dashboard: 'Dashboard',
    users: 'User Management',
    analytics: 'Content Analytics',
    system: 'System Status',
    providers: 'Model Providers',
};

interface StaffViewProps {
    onLogout: () => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ onLogout }) => {
    const [view, setView] = useState<StaffViewType>('dashboard');
    const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);


    const renderContent = () => {
        switch (view) {
            case 'users':
                return <StaffPortal />;
            case 'providers':
                return <ModelProviders />;
            case 'analytics':
                 const totalQuizzesTaken = 1287;
                 const scoreDistributionData = [
                    { label: '90-100%', value: 65, color: 'bg-green-500', count: Math.round(totalQuizzesTaken * 0.65) },
                    { label: '80-89%', value: 20, color: 'bg-sky-500', count: Math.round(totalQuizzesTaken * 0.20) },
                    { label: '70-79%', value: 10, color: 'bg-amber-500', count: Math.round(totalQuizzesTaken * 0.10) },
                    { label: '< 70%', value: 5, color: 'bg-red-500', count: totalQuizzesTaken - Math.round(totalQuizzesTaken * 0.65) - Math.round(totalQuizzesTaken * 0.20) - Math.round(totalQuizzesTaken * 0.10) },
                ];

                 return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Quizzes Taken" value="1,287" icon={<QuizIcon className="w-6 h-6 text-purple-400"/>} />
                            <StatCard title="Average Score" value="84%" icon={<TrophyIcon className="w-6 h-6 text-amber-400"/>} />
                            <StatCard title="Active Users (24h)" value="112" icon={<UsersIcon className="w-6 h-6 text-sky-400"/>} />
                            <StatCard title="Avg. Time / Quiz" value="4m 32s" icon={<ClockIcon className="w-6 h-6 text-rose-400"/>} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center"><ClipboardListIcon className="w-5 h-5 mr-2 text-green-400" />Most Popular Topics</h3>
                                <ul className="space-y-3 text-slate-300">
                                    <li className="flex justify-between"><span>1. Quantum Physics</span> <span className="font-mono text-slate-400">204 quizzes</span></li>
                                    <li className="flex justify-between"><span>2. World War II</span> <span className="font-mono text-slate-400">156 quizzes</span></li>
                                    <li className="flex justify-between"><span>3. Python Basics</span> <span className="font-mono text-slate-400">121 quizzes</span></li>
                                    <li className="flex justify-between"><span>4. The Roman Empire</span> <span className="font-mono text-slate-400">98 quizzes</span></li>
                                    <li className="flex justify-between"><span>5. Marine Biology</span> <span className="font-mono text-slate-400">75 quizzes</span></li>
                                </ul>
                            </div>
                             <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center"><ChartBarIcon className="w-5 h-5 mr-2 text-sky-400"/>Score Distribution</h3>
                                <div className="space-y-4 pt-2">
                                    {scoreDistributionData.map((item, index) => (
                                        <div 
                                            key={item.label} 
                                            className="relative"
                                            onMouseEnter={() => setActiveTooltipIndex(index)}
                                            onMouseLeave={() => setActiveTooltipIndex(null)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-20 text-sm text-slate-400 text-right">{item.label}</span>
                                                <div className="flex-1 bg-slate-700 rounded-full h-4">
                                                    <div className={`${item.color} h-4 rounded-full`} style={{ width: `${item.value}%` }}></div>
                                                </div>
                                                <span className="w-12 text-sm font-mono text-white text-left">{item.value}%</span>
                                            </div>
                                            {activeTooltipIndex === index && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-max bg-slate-950 text-white text-xs rounded-md shadow-lg p-2 border border-slate-700 z-10">
                                                    <strong>{item.value}%</strong> ({item.count} quizzes)
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'system':
                return (
                     <div className="space-y-6">
                        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckCircleIcon className="w-8 h-8 text-green-400 mr-4" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">All Systems Operational</h3>
                                    <p className="text-slate-400">No active incidents or scheduled maintenance.</p>
                                </div>
                            </div>
                             <span className="text-xs font-mono text-slate-500">Last updated: {new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                             <StatCard title="API Status" value="Healthy" icon={<CogIcon className="w-6 h-6 text-green-400"/>} />
                             <StatCard title="Avg. API Latency" value="128ms" icon={<ClockIcon className="w-6 h-6 text-amber-400"/>} />
                             <StatCard title="API Calls (24h)" value="4,592" icon={<ChartBarIcon className="w-6 h-6 text-sky-400"/>} />
                        </div>
                        <div className="bg-slate-800 rounded-lg border border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-100 p-4 border-b border-slate-700">Recent System Events</h3>
                            <ul className="divide-y divide-slate-700 font-mono text-xs">
                                <li className="p-3 flex justify-between items-center text-slate-300">
                                    <div><span className="text-green-400">[INFO]</span> New user signed up: usr_5</div>
                                    <span className="text-slate-500">2 min ago</span>
                                </li>
                                 <li className="p-3 flex justify-between items-center text-slate-300">
                                    <div><span className="text-green-400">[INFO]</span> Quiz generated successfully (Topic: AI Ethics)</div>
                                    <span className="text-slate-500">5 min ago</span>
                                </li>
                                <li className="p-3 flex justify-between items-center text-slate-300">
                                    <div><span className="text-amber-400">[WARN]</span> API latency spike detected: 450ms</div>
                                    <span className="text-slate-500">12 min ago</span>
                                </li>
                                <li className="p-3 flex justify-between items-center text-slate-300">
                                    <div><span className="text-green-400">[INFO]</span> Deployed v1.2.1 to production</div>
                                    <span className="text-slate-500">45 min ago</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DashboardCard 
                            icon={<ChartBarIcon className="w-6 h-6 text-green-400" />}
                            title="Content Analytics"
                            description="Analyze quiz performance and content engagement."
                        />
                        <DashboardCard 
                            icon={<CogIcon className="w-6 h-6 text-amber-400" />}
                            title="System Status"
                            description="Monitor application health and API usage."
                        />
                    </div>
                );
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col">
            <header className="bg-slate-950/70 backdrop-blur-sm border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20">
                <div>
                    <h1 className="text-xl font-bold">
                        <span className="text-slate-400">AetherLearn</span> / Staff Portal
                    </h1>
                </div>
                <button
                    onClick={onLogout}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-colors"
                    aria-label="Logout"
                >
                    <LogoutIcon className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </header>
            <div className="flex flex-1 min-h-0">
                <StaffSidebar view={view} setView={setView} />
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-slate-100 mb-6">{viewTitles[view]}</h2>
                    {renderContent()}
                </main>
            </div>
            <footer className="text-center p-4 text-slate-500 text-sm border-t border-slate-800">
                <p>&copy; {new Date().getFullYear()} AetherLearn. Administrator View.</p>
            </footer>
        </div>
    );
};
