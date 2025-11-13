
import React, { useState } from 'react';
import { Question as QuestionType, QuestionType as QType } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface QuestionProps {
  question: QuestionType;
  questionIndex: number;
  userAnswer: string;
  onAnswerChange: (questionIndex: number, answer: string) => void;
  explanation: string | null | undefined;
  onGetExplanation: (questionIndex: number) => void;
}

export const Question: React.FC<QuestionProps> = ({ question, questionIndex, userAnswer, onAnswerChange, explanation, onGetExplanation }) => {
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);

  const handleExplainClick = async () => {
    setIsExplanationLoading(true);
    await onGetExplanation(questionIndex);
    setIsExplanationLoading(false);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 transition-all duration-300 hover:border-purple-500/50">
      <p className="text-lg font-semibold text-slate-200 mb-4">
        <span className="text-purple-400 font-bold mr-2">{questionIndex + 1}.</span>
        {question.questionText}
      </p>

      {question.questionType === QType.MultipleChoice && question.options && (
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <label key={idx} className="flex items-center p-3 w-full bg-slate-700/50 rounded-md cursor-pointer hover:bg-slate-700 transition-colors">
              <input
                type="radio"
                name={`question-${questionIndex}`}
                value={option}
                checked={userAnswer === option}
                onChange={(e) => onAnswerChange(questionIndex, e.target.value)}
                className="h-4 w-4 text-purple-600 bg-slate-600 border-slate-500 focus:ring-purple-500"
              />
              <span className="ml-3 text-slate-300">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.questionType === QType.ShortAnswer && (
        <input
          type="text"
          value={userAnswer || ''}
          onChange={(e) => onAnswerChange(questionIndex, e.target.value)}
          placeholder="Type your answer here..."
          className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 transition-colors"
        />
      )}

      <div className="mt-4">
        {explanation === undefined && (
          <button
            onClick={handleExplainClick}
            disabled={isExplanationLoading}
            className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 disabled:text-slate-500 disabled:cursor-wait"
          >
            <SparklesIcon className={`w-4 h-4 mr-1.5 ${isExplanationLoading ? 'animate-pulse' : ''}`} />
            {isExplanationLoading ? 'Thinking...' : 'Explain Answer'}
          </button>
        )}
        
        {explanation !== undefined && explanation === "" && ( // Loading state
             <div className="text-sm p-3 bg-slate-700/50 rounded-md text-slate-400 animate-pulse">
                Fetching explanation...
            </div>
        )}

        {explanation && (
          <div className="text-sm p-3 bg-slate-700/50 rounded-md text-slate-300 border-l-2 border-purple-400">
            <p><strong className="text-purple-400">Explanation:</strong> {explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};