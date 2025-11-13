// Fix: Add a type-only import for React to ensure consistent type resolution across files.
import type React from 'react';

export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  ShortAnswer = 'short-answer',
}

export interface Question {
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  difficulty: Difficulty;
}

export type Quiz = Question[];

export type UserAnswers = Record<number, string>;

export type Explanations = Record<number, string | null>;

export interface QuizHistoryItem {
  id: string;
  fileName: string; // Doubles as topic for agent-generated quizzes
  score: number;
  totalQuestions: number;
  date: string;
  timeTaken: number; // in seconds
  difficulty: Difficulty;
  source: 'pdf' | 'agent';
}

export type AppView = 'quiz-generator' | 'chat' | 'badges' | 'staff' | 'profile' | 'tools';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type QuizQuestionTypePreference = 'multiple-choice' | 'short-answer' | 'mixed';

export type AgentPersonality = 'Aether' | 'Socrates' | 'Shakespeare' | 'AdaLovelace';

// --- Reference type for search grounding ---
export interface Reference {
  uri: string;
  title: string;
}

// --- Note type for Tools section ---
export interface Note {
  id: string;
  content: string;
  lastModified: string;
}

// --- Badge System Types ---

export enum BadgeId {
  // Mastery & Progress
  FirstStep = 'first-step',
  TopicScholar = 'topic-scholar',
  Perfectionist = 'perfectionist',
  ExpertExplorer = 'expert-explorer',
  // Consistency & Habit
  DailyDedication = 'daily-dedication',
  StreakStar = 'streak-star',
  WeekendWarrior = 'weekend-warrior',
  QuizWhizBronze = 'quiz-whiz-bronze',
  QuizWhizSilver = 'quiz-whiz-silver',
  QuizWhizGold = 'quiz-whiz-gold',
  // Performance & Skill
  RapidResponder = 'rapid-responder',
  AIChallenger = 'ai-challenger',
  ComebackKid = 'comeback-kid',
  // Exploration & Curiosity
  Polymath = 'polymath',
  FormatSpecialist = 'format-specialist',
  AgentInteractor = 'agent-interactor',
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  criteria: (lastQuiz: QuizHistoryItem, history: QuizHistoryItem[], preferences?: any) => boolean;
}