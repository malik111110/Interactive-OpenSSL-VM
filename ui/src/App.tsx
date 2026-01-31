import { useState } from 'react';
import {
  Play,
  StepForward,
  RotateCcw,
  Shield,
  Cpu,
  Terminal as TerminalIcon,
  Database,
  Info,
  BookOpen,
  Lock,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript'; // Use JS for now as placeholder for DSL
import './index.css';

// --- Mock VM State ---
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

const DEFAULT_CODE = `// Interactive OpenSSL VM DSL
PUSH "password123"
HASH SHA256
PUSH "salt_value"
PBKDF2 1000
AES_128_GCM_ENC
HALT`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [stack, setStack] = useState<StackItem[]>([
    { id: '1', value: '0x48656c6c6f', type: 'hex' },
    { id: '2', value: 'SHA256_INIT', type: 'string' },
  ]);
  const [logs, setLogs] = useState<string[]>(['VM Initialized...', 'Ready for input.']);
  const [trace, setTrace] = useState<TraceFrame[]>([]);
  const [pc, setPc] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState<'idle' | 'running' | 'halted' | 'error'>('idle');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runAll = () => {
    setStatus('running');
    addLog('Executing full program...');

    // Simulate execution steps
    const steps = [
      { op: 'PUSH "password123"', fuel: 1 },
      { op: 'HASH SHA256', fuel: 5 },
      { op: 'PUSH "salt_value"', fuel: 1 },
      { op: 'PBKDF2 1000', fuel: 15 },
      { op: 'AES_128_GCM_ENC', fuel: 8 },
      { op: 'HALT', fuel: 0 },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setPc(i);
        setFuel(prev => {
          const next = prev - step.fuel;
          return next < 0 ? 0 : next;
        });
        setTrace(prev => [...prev, {
          pc: i,
          op: step.op.split(' ')[0],
          fuelConsumed: step.fuel,
          timestamp: new Date().toLocaleTimeString()
        }]);
        if (i === steps.length - 1) {
          setStatus('halted');
          addLog('Execution completed successfully.');
        }
      }, i * 300);
    });
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
    setLogs(['VM Reset.']);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--accent-primary)', borderRadius: '8px', color: 'white' }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: '1' }}>OpenSSL VM</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v0.1.0-alpha (Experimental)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', marginRight: '24px' }}>
            <div className="status-badge" style={{ background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={12} color={status === 'running' ? 'var(--accent-secondary)' : 'var(--text-muted)'} />
              Fuel: {fuel}%
            </div>
            <div className="status-badge" style={{ background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={12} color="var(--accent-primary)" />
              PC: {pc}
            </div>
          </div>

          <button onClick={runAll} disabled={status === 'running'} style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={16} fill="currentColor" /> Run
          </button>
          <button onClick={step} disabled={status === 'running'} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <BookOpen size={14} style={{ marginRight: '8px' }} /> Learning Center
          </div>
          <div className="panel-content">
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--accent-primary)' }}>Introduction</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Welcome to the Interactive OpenSSL VM. This environment allows you to experiment with low-level cryptographic primitives in a safe, sandboxed environment.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} /> Available Opcodes
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  { op: 'PUSH', desc: 'Push value to stack' },
                  { op: 'POP', desc: 'Remove top item' },
                  { op: 'HASH', desc: 'Compute SHA256/512' },
                  { op: 'PBKDF2', desc: 'Key derivation' },
                  { op: 'AES_ENC', desc: 'Symmetric encrypt' },
                  { op: 'HALT', desc: 'Stop execution' },
                ].map(item => (
                  <div key={item.op} style={{ background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <code className="mono" style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{item.op}</code>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>CRYPTO</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} /> Execution Trace
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {trace.slice(-5).reverse().map((t, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '12px', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-primary)' }}>{t.op}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>PC: {t.pc} • Fuel: -{t.fuelConsumed}</div>
                  </div>
                ))}
                {trace.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>No trace data</div>}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', marginBottom: '4px' }}>CURRENT LESSON</h4>
              <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Mastering SHA-256 Hashing</p>
              <div style={{ height: '4px', background: '#334155', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--accent-primary)' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Center: Editor & Console */}
        <section className="editor-pane">
          <div className="panel-header" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <TerminalIcon size={14} style={{ marginRight: '8px' }} /> VM Editor
            </span>
            <span style={{ fontSize: '0.65rem' }}>main.crypto</span>
          </div>
          <div style={{ flex: 1, padding: '0', overflowY: 'auto', background: '#0d0d0f', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40px',
              height: '100%',
              background: '#0a0a0c',
              borderRight: '1px solid #1a1a1e',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '20px',
              alignItems: 'center',
              color: '#3a3a40',
              fontSize: '12px',
              zIndex: 1
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <div key={n} style={{ height: '21px' }}>{n}</div>)}
            </div>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, languages.javascript)}
              padding={20}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 14,
                color: '#e4e4e7',
                marginLeft: '40px',
                minHeight: '100%'
              }}
            />
          </div>

          {/* Console Output */}
          <div style={{ height: '220px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <Database size={14} style={{ marginRight: '8px' }} /> VM Console
            </div>
            <div style={{ flex: 1, overflowY: 'auto', background: '#050505', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ color: log.includes('error') ? '#ef4444' : '#888', marginBottom: '4px' }}>
                  <span style={{ color: '#555' }}>&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar: State Inspector */}
        <section className="state-pane">
          <div className="panel-header">
            <Database size={14} style={{ marginRight: '8px' }} /> Stack Inspector
          </div>
          <div className="panel-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stack.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.875rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                  Stack is empty
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {stack.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.8, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, x: 50 }}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '10px',
                        position: 'relative',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--accent-primary)', width: '4px', height: '16px', borderRadius: '4px' }}></div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Slot {stack.length - 1 - index} • {item.type}</div>
                      <div className="mono" style={{ fontSize: '0.8125rem', wordBreak: 'break-all', color: item.type === 'hex' ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>
                        {item.value}
                      </div>
                    </motion.div>
                  )).reverse()}
                </AnimatePresence>
              )}
            </div>

            <div style={{ marginTop: '32px' }}>
              <div className="panel-header" style={{ padding: '0', background: 'transparent', border: 'none', height: 'auto', marginBottom: '12px' }}>
                <Lock size={14} style={{ marginRight: '8px' }} /> Registers
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>FUEL</div>
                  <div className="mono" style={{ fontSize: '0.875rem' }}>{fuel}</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>PC</div>
                  <div className="mono" style={{ fontSize: '0.875rem' }}>{pc}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer style={{ height: '32px', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '0.65rem', color: 'var(--text-muted)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>WASM ENGINE: <span style={{ color: 'var(--accent-secondary)' }}>ONLINE</span></span>
          <span>MEMORY BASE: 0x00000000</span>
        </div>
        <div>
          UTF-8 • CRYPTO-VM v1.0
        </div>
      </footer>
    </div>
  );
}
