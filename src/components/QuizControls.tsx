
import React from 'react';
import { Difficulty, QuizQuestionTypePreference } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface QuizControlsProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  questionTypePreference: QuizQuestionTypePreference;
  setQuestionTypePreference: (preference: QuizQuestionTypePreference) => void;
  onGenerate: () => void;
  isFileSelected: boolean;
  isLoading: boolean;
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  difficulty,
  setDifficulty,
  numQuestions,
  setNumQuestions,
  questionTypePreference,
  setQuestionTypePreference,
  onGenerate,
  isFileSelected,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 my-6">
      <div className="w-full sm:w-auto">
        <label htmlFor="difficulty" className="sr-only">Difficulty</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          disabled={isLoading}
          className="w-full sm:w-auto bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 transition-colors"
        >
          <option value={Difficulty.Beginner}>Beginner</option>
          <option value={Difficulty.Intermediate}>Intermediate</option>
          <option value={Difficulty.Advanced}>Advanced</option>
        </select>
      </div>

       <div className="w-full sm:w-auto">
        <label htmlFor="questionType" className="sr-only">Question Types</label>
        <select
          id="questionType"
          value={questionTypePreference}
          onChange={(e) => setQuestionTypePreference(e.target.value as QuizQuestionTypePreference)}
          disabled={isLoading}
          className="w-full sm:w-auto bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 transition-colors"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="short-answer">Short Answer</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <label htmlFor="numQuestions" className="sr-only">Number of Questions</label>
        <input
          type="number"
          id="numQuestions"
          value={numQuestions}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val > 0 && val <= 20) setNumQuestions(val);
          }}
          min="1"
          max="20"
          disabled={isLoading}
          className="w-full sm:w-24 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 transition-colors"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={!isFileSelected || isLoading}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        Generate Quiz
      </button>
    </div>
  );
};