import React from 'react';
import { Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StackItem } from '../../types/vm';

interface StackInspectorProps {
    stack: StackItem[];
}

export const StackInspector: React.FC<StackInspectorProps> = ({ stack }) => {
    return (
        <div className="flex flex-col h-full bg-secondary">
            <div className="terminal-header flex items-center gap-2" style={{ padding: '0.75rem 1rem', background: 'var(--bg-accent)' }}>
                <Database size={14} style={{ color: 'var(--accent-blue)' }} />
                Memory Stack
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <div className="flex flex-col">
                    {stack.length === 0 ? (
                        <div className="flex flex-col items-center justify-center" style={{ padding: '5rem 0', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                            <Database size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                            <span style={{ fontSize: '12px' }}>Stack is empty</span>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {stack.slice().reverse().map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="stack-item-card"
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '12px',
                                        padding: '2px 6px',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        fontSize: '9px',
                                        fontFamily: 'var(--font-mono)',
                                        color: 'var(--text-muted)'
                                    }}>
                                        0x{(stack.length - 1 - index).toString(16).padStart(2, '0')}
                                    </div>

                                    <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.type === 'hex' ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                            {item.type}
                                        </span>
                                    </div>

                                    <div className="mono" style={{ fontSize: '12px', wordBreak: 'break-all', color: 'var(--text-primary)' }}>
                                        {item.value}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};
