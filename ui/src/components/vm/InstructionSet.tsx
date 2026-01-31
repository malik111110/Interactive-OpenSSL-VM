import React from 'react';
import { Cpu } from 'lucide-react';

interface Instruction {
    op: string;
    desc: string;
    type: 'STACK' | 'CRYPTO' | 'CTRL';
}

const INSTRUCTIONS: Instruction[] = [
    { op: 'PUSH', desc: 'Push value to stack', type: 'STACK' },
    { op: 'POP', desc: 'Remove top item', type: 'STACK' },
    { op: 'HASH', desc: 'Compute SHA256', type: 'CRYPTO' },
    { op: 'AES_ENC', desc: 'AES-128-GCM Encrypt', type: 'CRYPTO' },
    { op: 'HALT', desc: 'Stop execution', type: 'CTRL' },
];

export const InstructionSet: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                <Cpu size={12} />
                Instruction Set
            </div>

            <div className="flex flex-col gap-2">
                {INSTRUCTIONS.map((item) => (
                    <div
                        key={item.op}
                        className="stack-item-card"
                        style={{ padding: '0.6rem 0.75rem', marginBottom: 0 }}
                    >
                        <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                            <code className="mono" style={{ fontSize: '11px', fontWeight: 'bold' }}>{item.op}</code>
                            <span style={{
                                fontSize: '8px',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                background: item.type === 'CRYPTO' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                                color: item.type === 'CRYPTO' ? 'var(--accent-blue)' : 'var(--text-muted)',
                                border: '1px solid var(--border-color)'
                            }}>
                                {item.type}
                            </span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
