
import React from 'react';
import { QuizHistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { ClockIcon } from './icons/ClockIcon';

interface ProfileProps {
  quizHistory: QuizHistoryItem[];
  earnedBadgesCount: number;
}

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const Profile: React.FC<ProfileProps> = ({ quizHistory, earnedBadgesCount }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-800/50 p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="flex-shrink-0">
          <img
            className="h-24 w-24 rounded-full ring-4 ring-purple-500"
            src={`https://api.dicebear.com/8.x/bottts/svg?seed=AetherLearnUser`}
            alt="User avatar"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-100">Alex Ryder</h2>
          <p className="text-purple-400">alex.ryder@email.com</p>
          <div className="mt-4 flex items-center justify-center sm:justify-start space-x-6 text-slate-300">
             <div className="text-center">
                <p className="text-2xl font-bold text-white">{quizHistory.length}</p>
                <p className="text-sm text-slate-400">Quizzes Taken</p>
            </div>
             <div className="text-center">
                <p className="text-2xl font-bold text-white">{earnedBadgesCount}</p>
                <p className="text-sm text-slate-400">Badges Earned</p>
            </div>
          </div>
        </div>
        <div className="sm:ml-auto">
            <button className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-colors">
                Logout
            </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
          <HistoryIcon className="w-6 h-6 mr-3 text-purple-400" />
          My Quiz History
        </h3>
        {quizHistory.length > 0 ? (
          <div className="space-y-4">
            {quizHistory.map((item) => (
              <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <p className="font-semibold text-slate-200 truncate" title={item.fileName}>
                    {item.fileName}
                    </p>
                    <p className="text-sm text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <div className="flex items-center text-sm text-slate-300" title="Time Taken">
                        <ClockIcon className="w-4 h-4 mr-1.5"/>
                        <span>{formatTime(item.timeTaken)}</span>
                    </div>
                    <p className={`text-lg font-bold ${item.score / item.totalQuestions >= 0.8 ? 'text-green-400' : 'text-amber-400'}`}>
                        {Math.round((item.score / item.totalQuestions) * 100)}%
                    </p>
                    <p className="text-sm text-slate-400">({item.score}/{item.totalQuestions})</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 mt-6 p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
            <p>You haven't completed any quizzes yet.</p>
            <p className="text-sm">Your results will appear here once you do!</p>
          </div>
        )}
      </div>
    </div>
  );
};
