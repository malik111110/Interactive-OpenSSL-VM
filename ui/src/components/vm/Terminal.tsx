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
    const scrollRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
        <div className="flex flex-col h-full relative overflow-hidden" style={{ backgroundColor: 'var(--bg-panel)' }}>
            {/* Scanline Effect */}
            <div className="scanline"></div>

            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 select-none" style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3">
                    <div
                        className="transition-all duration-300"
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: status === 'running' ? 'var(--accent-secondary)' : '#1e1e1e',
                            boxShadow: status === 'running' ? '0 0 10px rgba(163, 230, 53, 0.6)' : 'none'
                        }}
                    />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Virtual Console v2.0
                    </span>
                </div>
                <div className="flex gap-2">
                    <div style={{ width: '10px', height: '2px', backgroundColor: '#1e1e1e' }} />
                    <div style={{ width: '10px', height: '2px', backgroundColor: '#1e1e1e' }} />
                </div>
            </div>

            {/* Logs Area */}
            <button
                ref={scrollRef}
                type="button"
                className="flex-1 overflow-y-auto p-5 space-y-2 custom-scrollbar relative z-40 text-left"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', cursor: 'text', background: 'transparent', border: 'none' }}
                onClick={() => inputRef.current?.focus()}
            >
                {logs.map((log, i) => {
                    const isCommand = log.startsWith('➜');
                    const isError = log.includes('Error');
                    const key = `${log}-${i}`;

                    let color = 'var(--text-bright)';
                    if (isCommand) {
                        color = 'var(--accent-secondary)';
                    } else if (isError) {
                        color = 'var(--accent-danger)';
                    }

                    return (
                        <div key={key} className="flex gap-3 leading-relaxed" style={{ opacity: isCommand ? 0.6 : 0.9 }}>
                            {!isCommand && <span style={{ color: 'var(--accent-primary)', userSelect: 'none', fontWeight: 700 }}>~</span>}
                            <span style={{
                                color,
                                fontWeight: isCommand ? 700 : 400
                            }}>
                                {log}
                            </span>
                        </div>
                    );
                })}

                {/* Active Command Line */}
                <form onSubmit={handleSubmit} className="flex gap-3 items-center pt-2 relative z-50">
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: 900, userSelect: 'none' }}>➜</span>
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
                                color: 'var(--text-pure)',
                                fontFamily: 'var(--font-mono)',
                                padding: 0,
                                fontSize: '13px',
                                caretColor: 'transparent'
                            }}
                            placeholder=""
                        />
                        <span className="terminal-cursor" style={{
                            position: 'absolute',
                            left: `${input.length}ch`,
                            display: 'inline-block'
                        }} />
                    </div>
                </form>
            </button>

            {/* CRT Vignette shadow - backdrop */}
            <div className="absolute inset-0 pointer-events-none z-30" style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)' }} />
        </div>
    );
};
