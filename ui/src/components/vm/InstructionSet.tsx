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
    { op: 'MD5', desc: 'MD5 legacy hash calculation', type: 'CRYPTO' },
    { op: 'SHA512', desc: 'SHA-512 strong hash calculation', type: 'CRYPTO' },
    { op: 'AES_ENC', desc: 'AES-128-GCM encryption', type: 'CRYPTO' },
    { op: 'AES_DEC', desc: 'AES-128-GCM decryption', type: 'CRYPTO' },
    { op: 'RSA_GEN', desc: 'RSA 2048-bit keypair generation', type: 'CRYPTO' },
    { op: 'RSA_ENC', desc: 'RSA public key encryption', type: 'CRYPTO' },
    { op: 'RSA_DEC', desc: 'RSA private key decryption', type: 'CRYPTO' },
    { op: 'CERT_GEN', desc: 'X.509 certificate generation', type: 'CRYPTO' },
    { op: 'HALT', desc: 'Terminate runtime execution', type: 'CTRL' },
];

export const InstructionSet: React.FC = () => {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-1">
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 8px rgba(34, 211, 238, 0.6)' }} />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--text-muted)' }}>
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
                                {item.type === 'CRYPTO'
                                    ? <ShieldCheck size={12} style={{ color: 'var(--accent-primary)' }} />
                                    : <Terminal size={12} style={{ color: 'var(--accent-secondary)' }} />
                                }
                                <code className="mono" style={{ fontWeight: 700, fontSize: '12px', color: '#ffffff', letterSpacing: '0.05em' }}>{item.op}</code>
                            </div>
                            <span style={{
                                fontSize: '8px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                backgroundColor: item.type === 'CRYPTO' ? 'rgba(34, 211, 238, 0.12)' : 'rgba(163, 230, 53, 0.12)',
                                color: item.type === 'CRYPTO' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                border: `1px solid ${item.type === 'CRYPTO' ? 'rgba(34, 211, 238, 0.28)' : 'rgba(163, 230, 53, 0.28)'}`
                            }}>
                                {item.type}
                            </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', opacity: 0.8, lineHeight: '1.4' }}>
                            {item.desc}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 flex items-start gap-3" style={{ marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Cpu size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
                    All instructions are verified by the WASM runtime before execution.
                </p>
            </div>
        </div >
    );
};
