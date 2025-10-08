
import React, { useState } from 'react';
import { Quiz, UserAnswers } from '../types';
import { ClockIcon } from './icons/ClockIcon';

interface ResultsProps {
  quiz: Quiz;
  userAnswers: UserAnswers;
  evaluationResults: Record<number, boolean>;
  onRestart: () => void;
  timeTaken: number;
}

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const Results: React.FC<ResultsProps> = ({ quiz, userAnswers, evaluationResults, onRestart, timeTaken }) => {
  const [showMintModal, setShowMintModal] = useState(false);

  const calculateScore = () => {
    return Object.values(evaluationResults).filter(isCorrect => isCorrect).length;
  };

  const score = calculateScore();
  const percentage = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
  
  const isSuccessful = percentage >= 80;

  const MintModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 max-w-sm w-full text-center border border-purple-500">
        <h3 className="text-2xl font-bold text-green-400">NFT Minted!</h3>
        <p className="text-slate-300 mt-2">Your achievement has been recorded on the blockchain.</p>
        <div className="mt-4 text-xs text-slate-400 break-words">
          <p className="font-semibold">Transaction Hash (Proof-of-Concept):</p>
          <p className="font-mono mt-1">0x{Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join('')}</p>
        </div>
        <button 
          onClick={() => setShowMintModal(false)}
          className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800/50 p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-700">
      {showMintModal && <MintModal />}
      <h2 className="text-3xl font-bold text-center text-slate-100 mb-2">Quiz Results</h2>
      <div className="text-center mb-6">
        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">{percentage}%</p>
        <p className="text-slate-300 text-lg mt-1">You answered {score} out of {quiz.length} questions correctly.</p>
        <div className="mt-2 flex items-center justify-center text-slate-400">
            <ClockIcon className="w-5 h-5 mr-2" />
            <span>Time Taken: {formatTime(timeTaken)}</span>
        </div>
      </div>

      {isSuccessful && (
         <div className="text-center p-4 bg-green-900/50 border border-green-500/50 rounded-lg mb-6">
            <p className="font-semibold text-green-300">Congratulations! You've mastered this topic.</p>
            <p className="text-sm text-green-400">Mint your achievement as an NFT to own your learning journey.</p>
            <button
                onClick={() => setShowMintModal(true)}
                className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-transform transform hover:scale-105"
            >
                Mint Achievement NFT
            </button>
         </div>
      )}

      <div className="space-y-4">
        {quiz.map((question, index) => {
          const userAnswer = userAnswers[index] || "No Answer";
          const isCorrect = evaluationResults[index] ?? false;
          return (
            <div key={index} className="p-4 bg-slate-800 rounded-md border-l-4" style={{borderColor: isCorrect ? '#4ade80' : '#f87171'}}>
              <p className="font-semibold text-slate-200 mb-2">{index + 1}. {question.questionText}</p>
              <p className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>Your answer: <span className="font-medium">{userAnswer}</span></p>
              {!isCorrect && <p className="text-sm text-slate-400">Correct answer: <span className="font-medium text-green-400">{question.correctAnswer}</span></p>}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={onRestart}
          className="px-6 py-2 text-base font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-colors"
        >
          Create New Quiz
        </button>
      </div>
    </div>
  );
};
