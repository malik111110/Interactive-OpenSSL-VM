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
        <div className="terminal-container flex flex-col h-full">
            <div className="terminal-header flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: status === 'running' ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
                Terminal Output
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-auto p-4 custom-scrollbar"
                onClick={() => inputRef.current?.focus()}
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-2" style={{ marginBottom: '2px' }}>
                        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>$</span>
                        <span style={{ color: log.includes('Error') ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                            {log}
                        </span>
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="flex gap-2 items-center" style={{ marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold', flexShrink: 0 }}>➜</span>
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-primary)',
                                padding: 0,
                                fontFamily: 'inherit',
                                fontSize: 'inherit'
                            }}
                            spellCheck={false}
                            autoComplete="off"
                        />
                        {input === '' && (
                            <div className="cursor-blink" style={{ position: 'absolute', left: 0, top: 2 }} />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
