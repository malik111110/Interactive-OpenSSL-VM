import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useVm } from '../hooks/useVm';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Terminal } from '../components/vm/Terminal';
import { StackInspector } from '../components/vm/StackInspector';
import { InstructionSet } from '../components/vm/InstructionSet';
import { LearningCenter } from '../components/vm/LearningCenter';
import { OpenSslService } from '../services/openSslService';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { Terminal as TerminalIcon, FileCode, Plus, X } from 'lucide-react';

const DEFAULT_CODE = `// Interactive OpenSSL VM DSL
// Perform cryptographic operations on the stack
PUSH "hello world"
HASH
PUSH "mykey"
AES_ENC
HALT`;

interface ViewTab {
    id: string;
    name: string;
    type: 'script' | 'terminal';
    content: string;
}

export const VmPage: React.FC = () => {
    const [tabs, setTabs] = useState<ViewTab[]>([
        { id: 'main', name: 'main_script.osh', type: 'script', content: DEFAULT_CODE }
    ]);
    const [activeTabId, setActiveTabId] = useState('main');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const {
        stack,
        logs,
        status,
        fuel,
        pc,
        wasmReady,
        execute,
        reset,
        addLog
    } = useVm();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isMenuOpen) return;
            const target = event.target as Node;
            const isInsideMenu = menuRef.current?.contains(target);
            const isInsideButton = menuButtonRef.current?.contains(target);
            if (!isInsideMenu && !isInsideButton) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    const updateActiveTabContent = (newContent: string) => {
        setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content: newContent } : t));
    };

    const closeTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (tabs.length === 1) return; // Don't close the last tab
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id) {
            const last = newTabs.at(-1);
            if (last) {
                setActiveTabId(last.id);
            }
        }
    };

    const createNewTab = (type: 'script' | 'terminal') => {
        const id = Math.random().toString(36).substring(7);
        const count = tabs.filter(t => t.type === type).length;
        const name = type === 'script' ? `script_${count + 1}.osh` : `cli_bash_${count + 1}`;
        const newTab: ViewTab = {
            id,
            name,
            type,
            content: type === 'script' ? `// New OpenSSL Script\n// Start typing your instructions here\n\nPUSH "secret data"\nHASH\nHALT` : ''
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(id);
        setIsMenuOpen(false);
    };

    const handleCommand = (command: string) => {
        const cmd = command.trim();
        if (!cmd) return;

        addLog(`➜ ${cmd}`);

        if (OpenSslService.isHelp(cmd)) {
            addLog(OpenSslService.getHelpText());
            return;
        }

        if (cmd === 'clear') {
            addLog("Terminal cleared.");
            return;
        }

        if (cmd === 'reset') {
            reset();
            return;
        }

        const dsl = OpenSslService.translateToDsl(cmd);
        if (dsl) {
            if (dsl.startsWith('MANUAL:')) {
                const page = dsl.split(':')[1].trim();
                const content = OpenSslService.MAN_PAGES[page] || `No manual entry for ${page}`;
                addLog(content);
            } else {
                execute(dsl);
            }
        } else {
            addLog(`Error: Command initialization failed. Unknown directive: '${cmd}'`);
        }
    };

    return (
        <div className="vm-app flex flex-col h-screen w-full select-none bg-black relative overflow-hidden">
            <div className="page-aurora" />
            <div className="page-noise" />
            <Header
                status={status}
                fuel={fuel}
                pc={pc}
                onRun={() => activeTab.type === 'script' && execute(activeTab.content)}
                onReset={reset}
            />

            <main className="app-shell flex-1 flex overflow-hidden">
                {/* Navigation / Instruction Sidebar */}
                <aside
                    className="sidebar-left flex flex-col overflow-y-auto custom-scrollbar p-8 space-y-10 flex-shrink-0"
                    style={{ width: '320px', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-dim)' }}
                >
                    <LearningCenter />
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--border-subtle), transparent)' }} />
                    <InstructionSet />
                </aside>

                {/* Central Workspace */}
                <section className="workspace flex-1 flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--bg-page)' }}>
                    {/* Subtle grid background */}
                    <div className="page-grid" />

                    {/* Editor Header / Tabs */}
                    <div className="tabs-bar flex items-center justify-between px-6 relative z-40" style={{ height: '56px', borderBottom: '1px solid var(--border-dim)', backgroundColor: '#000' }}>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[80%]">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`tab-button group flex items-center gap-3 px-4 py-2 rounded-t-lg transition-all duration-300 relative ${activeTabId === tab.id
                                        ? 'is-active bg-[#111] text-white border-x border-t border-white/10'
                                        : 'text-[#666] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.type === 'script' ? <FileCode size={13} strokeWidth={2.5} /> : <TerminalIcon size={13} strokeWidth={2.5} />}
                                    <span className="text-[10px] uppercase font-black tracking-widest whitespace-nowrap">{tab.name}</span>
                                    {tabs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={(e) => closeTab(tab.id, e)}
                                            className="ml-2 opacity-30 group-hover:opacity-100 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-all"
                                            aria-label={`Close ${tab.name}`}
                                        >
                                            <X size={10} strokeWidth={3} />
                                        </button>
                                    )}
                                    {activeTabId === tab.id && (
                                        <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-[#111] z-50"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <button
                                ref={menuButtonRef}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const nextOpen = !isMenuOpen;
                                    setIsMenuOpen(nextOpen);
                                    if (nextOpen && menuButtonRef.current) {
                                        const rect = menuButtonRef.current.getBoundingClientRect();
                                        const menuWidth = 180;
                                        const left = Math.max(16, rect.right - menuWidth);
                                        const top = rect.bottom + 10;
                                        setMenuPosition({ top, left });
                                    }
                                }}
                                className="tab-new flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-md transition-all active:scale-95"
                            >
                                <Plus size={12} strokeWidth={4} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} />
                                New
                            </button>

                            {isMenuOpen && createPortal(
                                <div
                                    ref={menuRef}
                                    className="tab-menu menu-panel"
                                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                                >
                                    <button
                                        onClick={() => createNewTab('script')}
                                        className="menu-item"
                                    >
                                        <div className="menu-item__icon">
                                            <FileCode size={13} strokeWidth={2.5} />
                                        </div>
                                        File
                                    </button>
                                    <button
                                        onClick={() => createNewTab('terminal')}
                                        className="menu-item"
                                    >
                                        <div className="menu-item__icon">
                                            <TerminalIcon size={13} strokeWidth={2.5} />
                                        </div>
                                        CLI
                                    </button>
                                </div>,
                                document.body
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                        {activeTab.type === 'script' ? (
                            <div className="flex-1 relative overflow-auto custom-scrollbar" style={{ backgroundColor: 'var(--bg-page)' }}>
                                <div className="absolute top-0 left-0 h-full flex flex-col pt-6 items-center pointer-events-none select-none" style={{ width: '40px', backgroundColor: '#030303', borderRight: '1px solid var(--border-dim)', color: '#222', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                                    {activeTab.content.split('\n').map((line, i) => (
                                        <div key={`${line}-${i}`} style={{ height: '24px' }}>{i + 1}</div>
                                    ))}
                                </div>
                                <Editor
                                    value={activeTab.content}
                                    onValueChange={updateActiveTabContent}
                                    highlight={code => highlight(code, languages.javascript)}
                                    padding={24}
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 13,
                                        color: '#e4e4e7',
                                        marginLeft: 40,
                                        minHeight: '100%',
                                        lineHeight: '24px',
                                        letterSpacing: '-0.01em'
                                    }}
                                    textareaClassName="outline-none"
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <Terminal
                                    logs={logs}
                                    status={status}
                                    onCommand={handleCommand}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bottom Console (Only visible if not in full-screen terminal mode) */}
                    {activeTab.type === 'script' && (
                        <div style={{ height: '220px', borderTop: '1px solid var(--border-dim)', flexShrink: 0 }}>
                            <Terminal
                                logs={logs}
                                status={status}
                                onCommand={handleCommand}
                            />
                        </div>
                    )}
                </section>

                {/* State/Memory inspector */}
                <aside
                    className="sidebar-right flex-shrink-0"
                    style={{ width: '340px', borderLeft: '1px solid var(--border-dim)', backgroundColor: 'var(--bg-sidebar)' }}
                >
                    <StackInspector stack={stack} />
                </aside>
            </main>

            <Footer wasmReady={wasmReady} />
        </div>
    );
};
