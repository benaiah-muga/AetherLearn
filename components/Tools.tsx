
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

const ScientificCalculator: React.FC = () => {
    const [display, setDisplay] = useState('0');

    const handleInput = (value: string) => {
        if (display === '0' && value !== '.') {
            setDisplay(value);
        } else {
            setDisplay(display + value);
        }
    };

    const handleOperator = (op: string) => {
        setDisplay(display + ` ${op} `);
    };

    const handleClear = () => {
        setDisplay('0');
    };

    const handleBackspace = () => {
        setDisplay(display.slice(0, -1) || '0');
    };
    
    const handleEquals = () => {
        try {
            // Basic replacements for safety and functionality
            let expression = display.replace(/×/g, '*').replace(/÷/g, '/');
            // This is a simplified eval, not a full parser. It's a PoC.
            // A production app should use a proper math expression parser library.
            const result = new Function(`return ${expression}`)();
            setDisplay(String(result));
        } catch (error) {
            setDisplay('Error');
        }
    };

    const buttons = [
        'C', '⌫', '(', ')',
        'sin', 'cos', 'tan', '÷',
        '7', '8', '9', '×',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '0', '.', 'π', '=',
    ];

    const handleClick = (btn: string) => {
        if (['+', '-', '×', '÷'].includes(btn)) {
            handleOperator(btn);
        } else if (btn === 'C') {
            handleClear();
        } else if (btn === '⌫') {
            handleBackspace();
        } else if (btn === '=') {
            handleEquals();
        } else if (['sin', 'cos', 'tan'].includes(btn)) {
            setDisplay(`${btn}(`);
        } else if (btn === 'π') {
            handleInput(String(Math.PI));
        }
        else {
            handleInput(btn);
        }
    }

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 w-full max-w-xs mx-auto">
            <div className="bg-slate-900 text-white text-right p-4 rounded-md mb-4 text-3xl font-mono break-all">{display}</div>
            <div className="grid grid-cols-4 gap-2">
                {buttons.map(btn => (
                    <button
                        key={btn}
                        onClick={() => handleClick(btn)}
                        className={`
                            p-4 rounded-md text-lg font-semibold transition-colors
                            ${['=', '+', '-', '×', '÷'].includes(btn) ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            ${['C', '⌫'].includes(btn) ? 'bg-rose-600 hover:bg-rose-700' : ''}
                            ${['sin', 'cos', 'tan', '(', ')'].includes(btn) ? 'bg-slate-600 hover:bg-slate-700' : ''}
                            ${!['=', '+', '-', '×', '÷', 'C', '⌫', 'sin', 'cos', 'tan', '(', ')'].includes(btn) ? 'bg-slate-700 hover:bg-slate-600' : ''}
                        `}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

const NotesApp: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    useEffect(() => {
        const savedNotes = localStorage.getItem('aetherlearn-notes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('aetherlearn-notes', JSON.stringify(notes));
    }, [notes]);

    const createNote = () => {
        const newNote: Note = {
            id: `note_${Date.now()}`,
            content: '# New Note\n\nStart writing here...',
            lastModified: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
        if (activeNoteId === id) {
            setActiveNoteId(null);
        }
    };
    
    const updateNoteContent = (content: string) => {
        const now = new Date().toISOString();
        setNotes(notes.map(note => 
            note.id === activeNoteId 
                ? { ...note, content, lastModified: now }
                : note
        ));
    };

    const activeNote = notes.find(note => note.id === activeNoteId);

    return (
        <div className="flex-1 flex h-full bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <aside className="w-1/3 border-r border-slate-700 flex flex-col">
                <div className="p-3 border-b border-slate-700">
                    <button onClick={createNote} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors">
                        <PlusIcon className="w-4 h-4" /> New Note
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    {notes.map(note => (
                        <div key={note.id}
                             onClick={() => setActiveNoteId(note.id)}
                             className={`p-3 cursor-pointer border-b border-slate-700/50 ${activeNoteId === note.id ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
                            <h4 className="text-sm font-semibold text-slate-200 truncate">{note.content.split('\n')[0].replace('#', '').trim() || 'Untitled Note'}</h4>
                            <p className="text-xs text-slate-400 mt-1">{new Date(note.lastModified).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </aside>
            <main className="w-2/3 flex flex-col">
                {activeNote ? (
                    <>
                        <div className="p-3 border-b border-slate-700 flex justify-end">
                            <button onClick={() => deleteNote(activeNote.id)} className="p-1 text-slate-400 hover:text-red-400">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => updateNoteContent(e.target.value)}
                            className="w-full h-full bg-slate-800 p-4 text-slate-200 resize-none focus:outline-none"
                            placeholder="Start typing..."
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <p>Select a note or create a new one.</p>
                    </div>
                )}
            </main>
        </div>
    );
};


export const Tools: React.FC = () => {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Study Tools</h2>
                <p className="text-slate-400 mt-1">Your personal toolkit for enhanced learning.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4">Scientific Calculator</h3>
                    <ScientificCalculator />
                </div>
                <div className="flex flex-col items-center h-[500px] w-full">
                    <h3 className="text-xl font-semibold mb-4">Notes</h3>
                    <NotesApp />
                </div>
            </div>
        </div>
    );
};