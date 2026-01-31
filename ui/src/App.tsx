import { useState, useEffect } from 'react';
import {
  Play,
  StepForward,
  RotateCcw,
  Shield,
  Cpu,
  Terminal as TerminalIcon,
  Database,
  BookOpen,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript'; // Use JS for now as placeholder for DSL
import './index.css';

// @ts-ignore
import init, { run_vm } from '../../wasm/pkg/openssl_vm_wasm.js';

// --- VM State Types ---
interface StackItem {
  id: string;
  value: string;
  type: 'string' | 'hex' | 'number';
}

interface TraceFrame {
  pc: number;
  op: string;
  fuelConsumed: number;
  timestamp: string;
}

interface Step {
  pc: number;
  opcode: string;
}

interface VmState {
  stack: string[];
  pc: number;
  halted: boolean;
  trace: { steps: Step[] };
  error?: string;
}

const DEFAULT_CODE = `// Interactive OpenSSL VM DSL
PUSH "hello world"
HASH
PUSH "mykey"
AES_ENC
HALT`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [logs, setLogs] = useState<string[]>(['VM Initialized...', 'Ready for input.']);
  const [trace, setTrace] = useState<TraceFrame[]>([]);
  const [pc, setPc] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState<'idle' | 'running' | 'halted' | 'error'>('idle');
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    init().then(() => {
      setWasmReady(true);
      addLog('WASM Engine Loaded.');
    }).catch((e: any) => {
      console.error('WASM init failed:', e);
      addLog('Error: WASM Engine failed to load.');
    });
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runAll = async () => {
    if (!wasmReady) {
      addLog('Error: WASM engine not ready.');
      return;
    }

    setStatus('running');
    addLog('Executing program in WASM VM...');

    try {
      const resultJson = run_vm(code);
      const state: VmState = JSON.parse(resultJson);

      if (state.error) {
        addLog(`VM Error: ${state.error}`);
        setStatus('error');
        return;
      }

      // Update state
      setPc(state.pc);
      setStack(state.stack.map((val, i) => ({
        id: `stack-${i}`,
        value: val,
        type: val.startsWith('0x') ? 'hex' : 'string'
      })));

      if (state.trace && state.trace.steps) {
        setTrace(state.trace.steps.map(step => ({
          pc: step.pc,
          op: step.opcode,
          fuelConsumed: 0,
          timestamp: new Date().toLocaleTimeString()
        })));
      }

      setStatus(state.halted ? 'halted' : 'idle');
      addLog('Execution completed.');

    } catch (err) {
      console.error('Execution failed:', err);
      addLog('Error: Execution failed.');
      setStatus('error');
    }
  };

  const step = () => {
    addLog('Stepping instruction...');
    setPc(prev => prev + 1);
  };

  const reset = () => {
    setPc(0);
    setFuel(100);
    setStack([]);
    setStatus('idle');
    setTrace([]);
    addLog('VM Reset.');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-primary)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Shield size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', lineHeight: '1.2', letterSpacing: '0.02em' }}>OpenSSL VM</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.1.0-alpha</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', marginRight: '12px' }}>
            <div className="status-badge" style={{ background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
              <Zap size={14} color={status === 'running' ? 'var(--accent-secondary)' : 'var(--text-muted)'} />
              <span className="mono">FUEL: {fuel}%</span>
            </div>
            <div className="status-badge" style={{ background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
              <Cpu size={14} color="var(--accent-primary)" />
              <span className="mono">PC: {pc.toString().padStart(3, '0')}</span>
            </div>
          </div>

          <button onClick={runAll} disabled={status === 'running'} style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '0.875rem' }}>
            <Play size={16} fill="currentColor" /> Run
          </button>
          <button onClick={step} disabled={status === 'running'} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <StepForward size={16} /> Step
          </button>
          <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '8px', borderRadius: '6px' }}>
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="main-content">
        {/* Sidebar: Learning Guide */}
        <section className="sidebar">
          <div className="panel-header">
            <BookOpen size={16} style={{ marginRight: '8px', opacity: 0.7 }} /> Learning Center
          </div>
          <div className="panel-content">
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '0.75rem', marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Module</h3>
              <div style={{ background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 600 }}>SHA-256 Hashing</h4>
                <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '40%', height: '100%', background: 'var(--accent-primary)' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>
                  Learn how to hash data using the SHA-256 algorithm.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.75rem', marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instruction Set
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  { op: 'PUSH', desc: 'Push value to stack', type: 'STACK' },
                  { op: 'POP', desc: 'Remove top item', type: 'STACK' },
                  { op: 'HASH', desc: 'Compute SHA256', type: 'CRYPTO' },
                  { op: 'AES_ENC', desc: 'AES-128-GCM Encrypt', type: 'CRYPTO' },
                  { op: 'HALT', desc: 'Stop execution', type: 'CTRL' },
                ].map(item => (
                  <div key={item.op} className="retro-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                      <code className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8125rem' }}>{item.op}</code>
                      <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', background: item.type === 'CRYPTO' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)', color: item.type === 'CRYPTO' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                        {item.type}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Center: Editor & Console */}
        <section className="editor-pane">
          <div className="panel-header" style={{ justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <TerminalIcon size={16} style={{ marginRight: '8px', opacity: 0.7 }} /> script.osh
            </span>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>UTF-8</span>
              <span>WASM</span>
            </div>
          </div>
          <div className="cli-editor-container">
            <div className="cli-line-numbers">
              {code.split('\n').map((_, n) => (
                <div key={n} style={{ height: '21px', color: '#52525b' }}>{n + 1}</div>
              ))}
            </div>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, languages.javascript)}
              padding={24}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 14,
                color: '#e4e4e7',
                marginLeft: '48px',
                minHeight: '100%',
                lineHeight: '21px'
              }}
              textareaClassName="focus:outline-none"
            />
          </div>

          {/* Console Output */}
          <div className="console-output">
            <div className="panel-header" style={{ height: '36px', minHeight: '36px', background: '#09090b', borderBottom: '1px solid #1f1f23' }}>
              <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: status === 'running' ? 'var(--accent-secondary)' : '#3f3f46' }}></div>
                TERMINAL OUTPUT
              </span>
            </div>
            <div className="console-logs">
              {logs.map((log, i) => (
                <div key={i} className={`log-entry ${log.includes('Error') ? 'error' : ''}`}>
                  <span style={{ color: '#52525b', userSelect: 'none' }}>$</span>
                  <span>{log}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>➜</span>
                <span className="cursor-blink" style={{ width: '8px', height: '16px', background: 'var(--text-muted)', display: 'inline-block' }}></span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: State Inspector */}
        <section className="state-pane">
          <div className="panel-header">
            <Database size={16} style={{ marginRight: '8px', opacity: 0.7 }} /> Memory Stack
          </div>
          <div className="panel-content" style={{ background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stack.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ marginBottom: '8px', opacity: 0.5 }}><Database size={24} /></div>
                  <span style={{ fontSize: '0.75rem' }}>Stack Empty</span>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {stack.slice().reverse().map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.95, opacity: 0, x: -10 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="stack-slot"
                    >
                      <div className="stack-slot-label">0x{(stack.length - 1 - index).toString(16).padStart(2, '0')}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: item.type === 'hex' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}></span>
                        {item.type.toUpperCase()}
                      </div>
                      <div className="mono" style={{ fontSize: '0.8125rem', wordBreak: 'break-all', lineHeight: '1.4', color: item.type === 'hex' ? '#60a5fa' : 'var(--text-primary)' }}>
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={12} /> Live Trace
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {trace.slice(-6).reverse().map((t, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    borderLeft: `2px solid ${i === 0 ? 'var(--accent-secondary)' : 'var(--border-color)'}`,
                    background: i === 0 ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    marginBottom: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="mono" style={{ fontSize: '0.8rem', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{t.op}</span>
                      <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.timestamp.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer style={{ height: '32px', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '0.65rem', color: 'var(--text-muted)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: wasmReady ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}></div>
            WASM CORE
          </span>
          <span className="mono">MEM: 128MB</span>
        </div>
        <div className="mono">
          Interactive OpenSSL VM
        </div>
      </footer>
    </div>
  );
}
