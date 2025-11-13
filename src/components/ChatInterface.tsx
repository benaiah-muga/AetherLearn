
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const WelcomeScreen: React.FC<{ onSuggestionClick: (message: string) => void }> = ({ onSuggestionClick }) => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full">
        <SparklesIcon className="w-16 h-16 text-purple-400 mb-4" />
        <h2 className="text-3xl font-bold text-slate-100">Hello, I'm Aether</h2>
        <p className="mt-2 text-lg text-slate-400">Your personal AI tutor. What would you like to learn today?</p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button onClick={() => onSuggestionClick('Explain quantum computing in simple terms')} className="bg-slate-700/50 text-slate-200 text-sm px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">Explain quantum computing</button>
            <button onClick={() => onSuggestionClick('Teach me the basics of Python')} className="bg-slate-700/50 text-slate-200 text-sm px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">Teach me Python basics</button>
            <button onClick={() => onSuggestionClick('Create a 5-question quiz on World War II')} className="bg-slate-700/50 text-slate-200 text-sm px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">Quiz me on WWII</button>
        </div>
    </div>
);

const SuggestionChips: React.FC<{ content: string; onSuggestionClick: (message: string) => void }> = ({ content, onSuggestionClick }) => {
    // Regex to find lines starting with "- " and capture the text after.
    const suggestions = content.match(/^- (.*)/gm)?.map(s => s.substring(2).trim());

    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 mt-3 ml-11"> {/* ml-11 to align with message bubble */}
            {suggestions.map((suggestion, index) => (
                <button 
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="bg-slate-600/70 text-slate-300 text-xs px-3 py-1.5 rounded-full hover:bg-slate-600 transition-colors"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
};

// Simple Markdown to HTML renderer component
const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    const suggestionRegex = /^- (.*)/gm;
    // Remove suggestion list from the main content to avoid rendering it twice
    const mainContent = content.replace(suggestionRegex, '').trim();

    // Basic Markdown replacements
    const formattedContent = mainContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>');       // Italics

    return <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
};


export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setSpeechError(null);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            let errorMessage = "An issue occurred with the microphone.";
            if (event.error === 'not-allowed') {
                errorMessage = "Microphone access denied. Please enable it in your browser settings.";
            } else if (event.error === 'no-speech') {
                errorMessage = "No speech was detected. Please try again.";
            }
            setSpeechError(errorMessage);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setCurrentMessage(prev => (prev ? prev.trim() + ' ' : '') + transcript.trim());
            setSpeechError(null);
        };
        recognitionRef.current = recognition;
    } else {
        console.warn("Speech recognition not supported in this browser.");
        setSpeechError("Voice input is not supported on this browser.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = () => {
    if (currentMessage.trim() && !isLoading) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
    if (speechError) {
        setSpeechError(null);
    }
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error("Error starting speech recognition:", err);
                setSpeechError("Could not start voice input. Please try again.");
            }
        }
    }
  };
  
  const permanentMicError = speechError === "Voice input is not supported on this browser." || speechError === "Microphone access denied. Please enable it in your browser settings.";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isLoading && <WelcomeScreen onSuggestionClick={onSendMessage} />}

        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <div className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white" /></div>}
              <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                 {msg.role === 'user' 
                    ? <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    : <MessageContent content={msg.content} />
                 }
              </div>
            </div>
             {msg.role === 'model' && index === messages.length - 1 && !isLoading && (
                <SuggestionChips content={msg.content} onSuggestionClick={onSendMessage} />
            )}
          </React.Fragment>
        ))}

         {isLoading && (
            <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white animate-pulse" /></div>
                <div className="max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700">
        <div className="relative">
          <button
            onClick={handleMicClick}
            disabled={!recognitionRef.current || isLoading || permanentMicError}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'text-red-500' : ''}`} />
          </button>
          <textarea
            value={currentMessage}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything, or say your message..."
            rows={1}
            className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 pl-12 pr-12 resize-none transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !currentMessage.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
         {speechError && <p className="mt-2 text-xs text-red-400 text-center">{speechError}</p>}
      </div>
    </div>
  );
};