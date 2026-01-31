import React from 'react';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';

interface Instruction {
    op: string;
    desc: string;
    type: 'STACK' | 'CRYPTO' | 'CTRL';
}

const INSTRUCTIONS: Instruction[] = [
    { op: 'PUSH', desc: 'Append data to memory pipeline', type: 'STACK' },
    { op: 'POP', desc: 'Evict last element from stack', type: 'STACK' },
    { op: 'HASH', desc: 'SHA-256 integrity calculation', type: 'CRYPTO' },
    { op: 'AES_ENC', desc: 'AES-128-GCM cipher operation', type: 'CRYPTO' },
    { op: 'HALT', desc: 'Terminate runtime execution', type: 'CTRL' },
];

export const InstructionSet: React.FC = () => {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-1">
                <div style={{ width: '6px', height: '6px', backgroundColor: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 8px #38bdf8' }} />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#52527a' }}>
                    Runtime Instructions
                </span>
            </div>

            <div className="flex flex-col gap-2.5">
                {INSTRUCTIONS.map((item) => (
                    <div
                        key={item.op}
                        className="instruction-card group"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                {item.type === 'CRYPTO' ? <ShieldCheck size={12} className="text-[#818cf8]" /> : <Terminal size={12} className="text-[#38bdf8]" />}
                                <code className="mono" style={{ fontWeight: 700, fontSize: '12px', color: '#ffffff', letterSpacing: '0.05em' }}>{item.op}</code>
                            </div>
                            <span style={{
                                fontSize: '8px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                backgroundColor: item.type === 'CRYPTO' ? 'rgba(129,140,248,0.1)' : 'rgba(82,82,122,0.1)',
                                color: item.type === 'CRYPTO' ? '#818cf8' : '#52527a',
                                border: `1px solid ${item.type === 'CRYPTO' ? 'rgba(129,140,248,0.2)' : 'rgba(82,82,122,0.2)'}`
                            }}>
                                {item.type}
                            </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#9494b8', opacity: 0.6, lineHeight: '1.4' }}>
                            {item.desc}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 flex items-start gap-3" style={{ marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Cpu size={14} style={{ color: '#52527a', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '9px', color: '#52527a', lineHeight: '1.5', fontStyle: 'italic' }}>
                    All instructions are verified by the WASM runtime before execution.
                </p>
            </div>
        </div>
    );
};
