
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Difficulty, Quiz, UserAnswers, Explanations, Question, QuestionType, QuizHistoryItem, AppView, ChatMessage, QuizQuestionTypePreference, BadgeId, AgentPersonality, Reference } from './types';
import { extractTextFromPDF } from './services/pdfService';
import { generateQuiz, getExplanation, evaluateShortAnswer, CREATE_QUIZ_TOOL, createQuizOnTopic } from './services/geminiService';
import { ALL_BADGES, checkAndAwardBadges } from './badges';
import { PERSONALITY_PROMPTS } from './personalities';

import { FileUpload } from './components/FileUpload';
import { QuizControls } from './components/QuizControls';
import { Loader } from './components/Loader';
import { Question as QuestionComponent } from './components/Question';
import { Results } from './components/Results';
import { Sidebar } from './components/Sidebar';
import { MenuIcon } from './components/icons/MenuIcon';
import { ChatInterface } from './components/ChatInterface';
import { GoogleGenAI } from '@google/genai';
import { Badges } from './components/Badges';
import { StaffPortal } from './components/StaffPortal';
import { Timer } from './components/Timer';
import { LoginModal } from './components/LoginModal';
import { Profile } from './components/Profile';
import { BadgeNotification } from './components/BadgeNotification';
import { StaffView } from './components/StaffView';
import { ReferencesWidget } from './components/ReferencesWidget';
import { Tools } from './components/Tools';

const App: React.FC = () => {
  // Global State
  const [appView, setAppView] = useState<AppView>('chat');
  const [appState, setAppState] = useState<'initial' | 'loading' | 'quiz' | 'evaluating' | 'results'>('initial');
  const [error, setError] = useState<string | null>(null);

  // Quiz Generator State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questionTypePreference, setQuestionTypePreference] = useState<QuizQuestionTypePreference>('multiple-choice');
  
  // Quiz State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [quizSource, setQuizSource] = useState<'pdf' | 'agent'>('pdf');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [explanations, setExplanations] = useState<Explanations>({});
  const [evaluationResults, setEvaluationResults] = useState<Record<number, boolean>>({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // History, Badges & Sidebar State (with localStorage persistence)
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>(() => {
    try {
        const saved = localStorage.getItem('aetherlearn_quizHistory');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<Set<BadgeId>>(() => {
    try {
        const saved = localStorage.getItem('aetherlearn_earnedBadges');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
        return new Set();
    }
  });
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<BadgeId[]>([]);
  const [usedQuestionPreferences, setUsedQuestionPreferences] = useState<Set<QuizQuestionTypePreference>>(() => {
    try {
        const saved = localStorage.getItem('aetherlearn_usedQuestionPreferences');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
        return new Set();
    }
  });

  // Chat Agent State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [agentPersonality, setAgentPersonality] = useState<AgentPersonality>(() => {
    try {
        const saved = localStorage.getItem('aetherlearn_agentPersonality');
        return saved ? (saved as AgentPersonality) : 'Aether';
    } catch {
        return 'Aether';
    }
  });
  const [references, setReferences] = useState<Reference[]>([]);
  const aiRef = useRef<GoogleGenAI | null>(null);

  // Profile & Staff State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (process.env.API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }, []);

  // --- State Persistence Effects ---
  useEffect(() => {
    try {
        localStorage.setItem('aetherlearn_quizHistory', JSON.stringify(quizHistory));
    } catch (e) {
        console.error("Failed to save quiz history:", e);
    }
  }, [quizHistory]);

  useEffect(() => {
    try {
        localStorage.setItem('aetherlearn_earnedBadges', JSON.stringify(Array.from(earnedBadges)));
    } catch (e) {
        console.error("Failed to save earned badges:", e);
    }
  }, [earnedBadges]);

  useEffect(() => {
    try {
        localStorage.setItem('aetherlearn_usedQuestionPreferences', JSON.stringify(Array.from(usedQuestionPreferences)));
    } catch (e) {
        console.error("Failed to save question preferences:", e);
    }
  }, [usedQuestionPreferences]);
  
  useEffect(() => {
    try {
        localStorage.setItem('aetherlearn_agentPersonality', agentPersonality);
    } catch (e) {
        console.error("Failed to save agent personality:", e);
    }
  }, [agentPersonality]);


  const stopTimer = () => {
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTimer(); // Cleanup on unmount
  }, []);

  const startTimer = () => {
    setIsQuizStarted(true);
    setElapsedTime(0);
    timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const resetQuizGeneratorState = () => {
    setAppState('initial');
    setError(null);
    setSelectedFile(null);
    setDocumentText('');
    setQuiz(null);
    setUserAnswers({});
    setExplanations({});
    setEvaluationResults({});
    setIsQuizStarted(false);
    setElapsedTime(0);
    stopTimer();
  };

  const handleSetAppView = (view: AppView) => {
    if (view === 'staff') {
      setIsLoginModalOpen(true);
      return;
    }
    
    // If the app is in any quiz-related state (e.g. 'results'), reset it before navigating to a new view.
    // Also, reset when navigating TO the quiz generator to ensure a clean state.
    if (appState !== 'initial' || (view === 'quiz-generator' && appView !== 'quiz-generator')) {
      resetQuizGeneratorState();
    }
    
    setReferences([]); // Clear references when changing views
    setAppView(view);
    setIsSidebarOpen(false);
  };

  const handleSetAgentPersonality = (personality: AgentPersonality) => {
    setAgentPersonality(personality);
    setChatHistory([]); // Reset chat for a new conversation context
  };

  const handleStaffLogin = (success: boolean) => {
    setIsLoginModalOpen(false);
    if (success) {
      setAppView('staff');
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    setAppView('chat');
  };

  const handleFileSelect = (file: File) => {
    if(file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }
    
    setAppState('loading');
    setError(null);
    setQuiz(null);
    setUserAnswers({});
    setExplanations({});
    setQuizTopic(selectedFile.name);
    setQuizSource('pdf');
    setIsQuizStarted(false);
    setElapsedTime(0);
    stopTimer();

    try {
      setUsedQuestionPreferences(prev => new Set(prev).add(questionTypePreference));
      const text = await extractTextFromPDF(selectedFile);
      setDocumentText(text);
      
      const generatedQuiz = await generateQuiz(text, difficulty, numQuestions, questionTypePreference);
      setQuiz(generatedQuiz);
      setAppState('quiz');

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setAppState('initial');
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    stopTimer();
    setAppState('evaluating');
    
    try {
        const evaluationPromises = quiz.map((question, index) => {
            const userAnswer = userAnswers[index];
            if (!userAnswer || userAnswer.trim() === '') return Promise.resolve(false);
            if (question.questionType === QuestionType.ShortAnswer) return evaluateShortAnswer(question, userAnswer);
            return Promise.resolve(userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase());
        });

        const results = await Promise.all(evaluationPromises);
        const newEvaluationResults: Record<number, boolean> = {};
        results.forEach((isCorrect, index) => { newEvaluationResults[index] = isCorrect; });
        
        const score = Object.values(newEvaluationResults).filter(Boolean).length;
        const historyItem: QuizHistoryItem = {
            id: new Date().toISOString(),
            fileName: quizTopic,
            score: score,
            totalQuestions: quiz.length,
            date: new Date().toISOString(),
            timeTaken: elapsedTime,
            difficulty: difficulty,
            source: quizSource,
        };

        const newHistory = [historyItem, ...quizHistory];
        setQuizHistory(newHistory);

        const badgeCheckResult = checkAndAwardBadges(historyItem, newHistory, earnedBadges, { usedQuestionPreferences });
        if (badgeCheckResult.newBadges.length > 0) {
            setEarnedBadges(badgeCheckResult.updatedBadgeSet);
            setNewlyEarnedBadges(badgeCheckResult.newBadges);
        }

        setEvaluationResults(newEvaluationResults);
        setAppState('results');
    } catch (err: any) {
        setError(err.message || 'An error occurred while grading the quiz.');
        setAppState('quiz');
    }
  };

  const handleGetExplanation = useCallback(async (questionIndex: number) => {
    if (!quiz || explanations[questionIndex] !== undefined) return;
    setExplanations(prev => ({...prev, [questionIndex]: ""}));
    try {
      const question: Question = quiz[questionIndex];
      const explanationText = await getExplanation(question, documentText);
      setExplanations(prev => ({...prev, [questionIndex]: explanationText}));
    } catch (err) {
      setExplanations(prev => ({...prev, [questionIndex]: "Sorry, couldn't fetch an explanation."}));
    }
  }, [quiz, documentText, explanations]);

  const handleSendMessage = async (message: string) => {
    if (!aiRef.current) {
        setError("AI Service not initialized.");
        return;
    }

    setIsChatLoading(true);
    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(updatedHistory);
    setReferences([]); // Reset references, as googleSearch is not used in this unified flow.

    try {
        const contents = updatedHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.content }] }));
        const baseInstruction = PERSONALITY_PROMPTS[agentPersonality];

        const functionalInstruction = `You have access to a tool called 'createQuizOnTopic' to generate quizzes for the user. Only use this tool if the user explicitly asks for a quiz or to be tested on a topic. For all other requests, respond conversationally as your persona. When responding as your persona, use Markdown for formatting and provide 3-4 short, actionable suggestions or follow-up questions as a bulleted list.`;
        const systemInstruction = `${baseInstruction}\n\n${functionalInstruction}`;

        const result = await aiRef.current.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ functionDeclarations: [CREATE_QUIZ_TOOL] }]
            }
        });
        
        const toolCalls = result.candidates?.[0]?.content?.parts.filter(part => !!part.functionCall);

        if (toolCalls && toolCalls.length > 0) {
            const call = toolCalls[0].functionCall;
            if (call?.name === 'createQuizOnTopic') {
                const args = call.args as { topic: string; difficulty: Difficulty; numQuestions: number };
                setChatHistory(prev => [...prev, { role: 'model', content: `Alright, challenge accepted! Whipping up a ${args.difficulty} quiz with ${args.numQuestions} questions about "${args.topic}". Let's see what you've got...` }]);
                setDifficulty(args.difficulty);
                setNumQuestions(args.numQuestions);
                setUsedQuestionPreferences(prev => new Set(prev).add('mixed'));

                const generatedQuiz = await createQuizOnTopic(args.topic, args.difficulty, args.numQuestions);
                setQuiz(generatedQuiz);
                setDocumentText(''); 
                setQuizTopic(`Quiz: ${args.topic}`);
                setQuizSource('agent');
                setAppState('quiz');
                setIsQuizStarted(false);
                setElapsedTime(0);
                stopTimer();
            } else {
                 const text = result.text;
                 setChatHistory(prev => [...prev, { role: 'model', content: text }]);
            }
        } else {
            const text = result.text;
            setChatHistory(prev => [...prev, { role: 'model', content: text }]);
        }

    } catch (err: any) {
        let userFriendlyError = "I ran into an unexpected issue. Please try again later.";
        
        if (err.message) {
            try {
                const errorDetails = JSON.parse(err.message);
                if (errorDetails.error && errorDetails.error.message) {
                    userFriendlyError = errorDetails.error.message;
                }
            } catch (e) {
                userFriendlyError = err.message;
            }
        }

        setChatHistory(prev => [...prev, { role: 'model', content: `Yikes, my circuits got a little tangled. Error: ${userFriendlyError}` }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const renderQuizGenerator = () => (
    <>
      <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} disabled={appState === 'loading'} error={error && !selectedFile ? error : null}/>
      <QuizControls 
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        questionTypePreference={questionTypePreference}
        setQuestionTypePreference={setQuestionTypePreference}
        onGenerate={handleGenerateQuiz}
        isFileSelected={!!selectedFile}
        isLoading={appState === 'loading'}
      />
    </>
  );

  const renderContent = () => {
    switch (appState) {
        case 'loading': return <Loader message="Analyzing document and generating quiz..." />;
        case 'evaluating': return <Loader message="Grading your answers with AI..." />;
        case 'quiz':
            return quiz && (
                <div className="w-full max-w-3xl mx-auto space-y-4">
                    {!isQuizStarted ? (
                        <div className="text-center p-8 bg-slate-800/50 rounded-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Quiz is Ready!</h2>
                            <button onClick={startTimer} className="px-8 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform transform hover:scale-105">
                                Start Timed Quiz
                            </button>
                        </div>
                    ) : (
                        <>
                            <Timer seconds={elapsedTime} />
                            {quiz.map((q, index) => (
                            <QuestionComponent 
                                key={index} question={q} questionIndex={index} userAnswer={userAnswers[index]}
                                onAnswerChange={handleAnswerChange} explanation={explanations[index]} onGetExplanation={handleGetExplanation}
                            />
                            ))}
                            <div className="text-center pt-4"><button onClick={handleSubmitQuiz} className="px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105">Submit Quiz</button></div>
                        </>
                    )}
                </div>
            );
        case 'results':
            return quiz && <Results quiz={quiz} userAnswers={userAnswers} evaluationResults={evaluationResults} onRestart={resetQuizGeneratorState} timeTaken={elapsedTime} />;
        case 'initial':
        default:
            switch (appView) {
                case 'chat':
                    return <ChatInterface messages={chatHistory} onSendMessage={handleSendMessage} isLoading={isChatLoading} />;
                case 'quiz-generator':
                    return renderQuizGenerator();
                case 'badges':
                    return <Badges earnedBadges={earnedBadges} />;
                case 'profile':
                    return <Profile quizHistory={quizHistory} earnedBadgesCount={earnedBadges.size} />;
                case 'tools':
                    return <Tools />;
                default:
                    return <ChatInterface messages={chatHistory} onSendMessage={handleSendMessage} isLoading={isChatLoading} />;
            }
    }
  };

  if (appView === 'staff') {
    return <StaffView onLogout={handleLogout} />;
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex">
        <div className="fixed top-5 right-5 z-50 space-y-3">
            {newlyEarnedBadges.map((badgeId, index) => (
                <BadgeNotification 
                    key={`${badgeId}-${index}`} 
                    badge={ALL_BADGES.find(b => b.id === badgeId)!} 
                    onDismiss={() => setNewlyEarnedBadges(prev => prev.filter(b => b !== badgeId))}
                />
            ))}
        </div>
        {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true"></div>}
        <Sidebar 
          quizHistory={quizHistory} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          appView={appView}
          setAppView={handleSetAppView}
          agentPersonality={agentPersonality}
          setAgentPersonality={handleSetAgentPersonality}
        />
        <div className="flex-1 flex flex-col min-h-0">
            <main className="flex-1 p-4 sm:p-8 flex flex-col overflow-y-auto">
                <header className="flex items-center justify-center relative text-center mb-10">
                    <div className="absolute left-0 top-0 md:hidden">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md text-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500" aria-label="Open sidebar"><MenuIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">AetherLearn</h1>
                      <p className="mt-2 text-lg text-slate-400">Your AI-Powered Learning Co-Pilot</p>
                    </div>
                </header>
                
                <div className="flex flex-col items-center flex-1 min-h-0">
                  {error && appState === 'initial' && selectedFile && <p className="mb-4 text-sm text-red-400 text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
                  {renderContent()}
                </div>
                
                <footer className="text-center mt-12 text-slate-500 text-sm">
                  <p>&copy; {new Date().getFullYear()} AetherLearn. Transforming learning with AI.</p>
                </footer>
            </main>
        </div>
      <ReferencesWidget references={references} />
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleStaffLogin} />}
    </div>
  );
};

export default App;
