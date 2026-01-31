import React, { useState } from 'react';
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
import { FileCode, Sparkles } from 'lucide-react';

const DEFAULT_CODE = `// Interactive OpenSSL VM DSL
// Perform cryptographic operations on the stack
PUSH "hello world"
HASH
PUSH "mykey"
AES_ENC
HALT`;

export const VmPage: React.FC = () => {
    const [code, setCode] = useState(DEFAULT_CODE);
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

    const handleCommand = (command: string) => {
        const cmd = command.trim();

        if (OpenSslService.isHelp(cmd)) {
            addLog(OpenSslService.getHelpText());
            return;
        }

        if (cmd === 'clear') {
            return;
        }

        if (cmd === 'reset') {
            reset();
            return;
        }

        const dsl = OpenSslService.translateToDsl(cmd);
        if (dsl) {
            execute(dsl);
        } else {
            addLog(`Error: Command initialization failed. Unknown directive: '${cmd}'`);
        }
    };

    return (
        <div className="vm-app flex flex-col h-screen w-full select-none">
            <Header
                status={status}
                fuel={fuel}
                pc={pc}
                onRun={() => execute(code)}
                onReset={reset}
            />

            <main className="flex-1 flex overflow-hidden">
                {/* Navigation / Instruction Sidebar */}
                <aside
                    className="flex flex-col overflow-y-auto custom-scrollbar p-8 space-y-10 flex-shrink-0"
                    style={{ width: '320px', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-dim)' }}
                >
                    <LearningCenter />
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--border-subtle), transparent)' }} />
                    <InstructionSet />
                </aside>

                {/* Central Workspace */}
                <section className="flex-1 flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--bg-page)' }}>
                    {/* Subtle grid background */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-6 relative z-10" style={{ height: '48px', borderBottom: '1px solid var(--border-dim)', backgroundColor: 'var(--bg-sidebar)' }}>
                        <div className="flex items-center gap-3">
                            <FileCode size={14} className="text-[#38bdf8]" />
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#52527a]">main_script.osh</span>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-mono text-[#333] font-black uppercase tracking-widest">
                            <span>Encoding: UTF-8</span>
                            <span className="text-[#38bdf8]/40 flex items-center gap-1">
                                <Sparkles size={10} />
                                Cloud_Sync_Enabled
                            </span>
                        </div>
                    </div>

                    {/* Code Editor Container */}
                    <div className="flex-1 relative overflow-auto custom-scrollbar relative z-10" style={{ backgroundColor: 'var(--bg-page)' }}>
                        <div className="absolute top-0 left-0 h-full flex flex-col pt-6 items-center pointer-events-none select-none" style={{ width: '48px', backgroundColor: '#030303', borderRight: '1px solid var(--border-dim)', color: '#222', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {code.split('\n').map((_, i) => (
                                <div key={i} style={{ height: '24px' }}>{i + 1}</div>
                            ))}
                        </div>
                        <Editor
                            value={code}
                            onValueChange={setCode}
                            highlight={code => highlight(code, languages.javascript)}
                            padding={24}
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 14,
                                color: '#e4e4e7',
                                marginLeft: 48,
                                minHeight: '100%',
                                lineHeight: '24px',
                                letterSpacing: '-0.01em'
                            }}
                            textareaClassName="outline-none"
                        />
                    </div>

                    {/* Interactive Console UI */}
                    <div style={{ height: '300px', borderTop: '1px solid var(--border-dim)' }}>
                        <Terminal
                            logs={logs}
                            status={status}
                            onCommand={handleCommand}
                        />
                    </div>
                </section>

                {/* State/Memory inspector */}
                <aside
                    className="flex-shrink-0"
                    style={{ width: '340px', borderLeft: '1px solid var(--border-dim)', backgroundColor: 'var(--bg-sidebar)' }}
                >
                    <StackInspector stack={stack} />
                </aside>
            </main>

            <Footer wasmReady={wasmReady} />
        </div>
    );
};
