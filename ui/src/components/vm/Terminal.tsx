import React, { useState, useRef, useEffect } from 'react';

interface TerminalProps {
    logs: string[];
    onCommand: (command: string) => void;
    status: 'idle' | 'running' | 'halted' | 'error';
}

export const Terminal: React.FC<TerminalProps> = ({ logs, onCommand, status }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        onCommand(input);
        setHistory((prev: string[]) => [input, ...prev]);
        setHistoryIndex(-1);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const nextIndex = historyIndex + 1;
            if (nextIndex < history.length) {
                setHistoryIndex(nextIndex);
                setInput(history[nextIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = historyIndex - 1;
            if (nextIndex >= 0) {
                setHistoryIndex(nextIndex);
                setInput(history[nextIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden" style={{ backgroundColor: '#030303' }}>
            {/* Scanline Effect */}
            <div className="scanline"></div>

            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 select-none" style={{ backgroundColor: '#080808', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3">
                    <div
                        className="transition-all duration-300"
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: status === 'running' ? '#4ade80' : '#1e1e1e',
                            boxShadow: status === 'running' ? '0 0 10px #4ade80' : 'none'
                        }}
                    />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#52527a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Virtual Console v2.0
                    </span>
                </div>
                <div className="flex gap-2">
                    <div style={{ width: '10px', height: '2px', backgroundColor: '#1e1e1e' }} />
                    <div style={{ width: '10px', height: '2px', backgroundColor: '#1e1e1e' }} />
                </div>
            </div>

            {/* Logs Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-2 custom-scrollbar relative z-40"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', cursor: 'text' }}
                onClick={() => inputRef.current?.focus()}
            >
                {logs.map((log, i) => {
                    const isCommand = log.startsWith('➜');
                    return (
                        <div key={i} className="flex gap-3 leading-relaxed" style={{ opacity: isCommand ? 0.6 : 0.9 }}>
                            {!isCommand && <span style={{ color: '#38bdf8', userSelect: 'none', fontWeight: 700 }}>~</span>}
                            <span style={{
                                color: isCommand ? '#4ade80' : (log.includes('Error') ? '#f87171' : '#e2e8f0'),
                                fontWeight: isCommand ? 700 : 400
                            }}>
                                {log}
                            </span>
                        </div>
                    );
                })}

                {/* Active Command Line */}
                <form onSubmit={handleSubmit} className="flex gap-3 items-center pt-2 relative z-50">
                    <span style={{ color: '#4ade80', fontWeight: 900, userSelect: 'none' }}>➜</span>
                    <div className="relative flex-1 flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            autoComplete="off"
                            spellCheck="false"
                            style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#ffffff',
                                fontFamily: 'var(--font-mono)',
                                padding: 0,
                                fontSize: '13px',
                                caretColor: 'transparent'
                            }}
                            placeholder=""
                        />
                        <span className="terminal-cursor" style={{
                            position: 'absolute',
                            left: `${input.length * 8.1}px`, // Adjusted for JetBrains Mono
                            display: 'inline-block'
                        }} />
                    </div>
                </form>
            </div>

            {/* CRT Vignette shadow - backdrop */}
            <div className="absolute inset-0 pointer-events-none z-30" style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)' }} />
        </div>
    );
};
