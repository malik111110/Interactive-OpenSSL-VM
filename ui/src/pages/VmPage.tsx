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
import { FileCode } from 'lucide-react';

const DEFAULT_CODE = `// Interactive OpenSSL VM DSL
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
            // Logic would be in hook if needed
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
            addLog(`Error: Command not found: ${cmd}. Type 'help' for available commands.`);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-primary overflow-hidden">
            <Header
                status={status}
                fuel={fuel}
                pc={pc}
                onRun={() => execute(code)}
                onStep={() => { }}
                onReset={reset}
            />

            <main className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <aside style={{ width: 300, borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '1.5rem', overflowY: 'auto' }} className="custom-scrollbar">
                    <div className="flex flex-col gap-8">
                        <LearningCenter />
                        <div style={{ height: 1, background: 'var(--border-color)' }} />
                        <InstructionSet />
                    </div>
                </aside>

                {/* Center Content */}
                <section className="flex-1 flex flex-col overflow-hidden">
                    {/* Editor Header */}
                    <div className="flex items-center justify-between" style={{ height: 40, borderBottom: '1px solid var(--bg-accent)', background: 'var(--bg-secondary)', padding: '0 1rem' }}>
                        <div className="flex items-center gap-2" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                            <FileCode size={12} style={{ color: 'var(--accent-blue)' }} />
                            script.osh
                        </div>
                        <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            UTF-8 WASM_VM
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative overflow-auto custom-scrollbar" style={{ background: 'var(--bg-primary)' }}>
                        <div className="absolute" style={{ top: 0, left: 0, width: 48, height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', paddingTop: 24, alignItems: 'center', color: 'var(--text-muted)', fontSize: 11, pointerEvents: 'none' }}>
                            {code.split('\n').map((_, i) => (
                                <div key={i} style={{ height: 21 }}>{i + 1}</div>
                            ))}
                        </div>
                        <Editor
                            value={code}
                            onValueChange={setCode}
                            highlight={code => highlight(code, languages.javascript)}
                            padding={24}
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 13,
                                color: 'var(--text-primary)',
                                marginLeft: 48,
                                minHeight: '100%',
                                lineHeight: '21px'
                            }}
                            textareaClassName="focus:outline-none"
                        />
                    </div>

                    {/* Terminal */}
                    <div style={{ height: 280 }}>
                        <Terminal
                            logs={logs}
                            status={status}
                            onCommand={handleCommand}
                        />
                    </div>
                </section>

                {/* Right Sidebar */}
                <aside style={{ width: 340, borderLeft: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                    <StackInspector stack={stack} />
                </aside>
            </main>

            <Footer wasmReady={wasmReady} />
        </div>
    );
};
