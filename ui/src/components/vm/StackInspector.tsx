import React from 'react';
import { Database, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StackItem } from '../../types/vm';

interface StackInspectorProps {
    stack: StackItem[];
}

export const StackInspector: React.FC<StackInspectorProps> = ({ stack }) => {
    return (
        <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
            {/* Header with gradient line */}
            <div className="relative">
                <div className="flex items-center gap-3 px-6 py-5" style={{ backgroundColor: 'var(--bg-panel)' }}>
                    <div className="p-1.5 rounded-md" style={{ backgroundColor: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
                        <Layers size={14} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)' }}>
                        Memory Stack
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.2), transparent)' }} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                <div className="flex flex-col">
                    {stack.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4" style={{ opacity: 0.2 }}>
                            <Database size={40} style={{ color: 'var(--text-dim)' }} />
                            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                                Empty Pipeline
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {stack.slice().reverse().map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                    className="stack-item group"
                                >
                                    {/* Address Badge */}
                                    <div
                                        className="absolute"
                                        style={{
                                            top: '-8px',
                                            right: '-4px',
                                            padding: '2px 8px',
                                            backgroundColor: '#0a0a0f',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: '6px',
                                            fontSize: '9px',
                                            fontFamily: 'var(--font-mono)',
                                        color: 'var(--text-muted)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }}
                                >
                                        0x{(stack.length - 1 - index).toString(16).padStart(2, '0').toUpperCase()}
                                    </div>

                                    {/* Type Indicator */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div
                                            style={{
                                                width: '4px',
                                                height: '12px',
                                                borderRadius: '10px',
                                                backgroundColor: item.type === 'hex' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                                boxShadow: `0 0 8px ${item.type === 'hex' ? 'rgba(34,211,238,0.6)' : 'rgba(163,230,53,0.6)'}`
                                            }}
                                        />
                                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            {item.type}
                                        </span>
                                    </div>

                                    {/* Value Display */}
                                    <div className="mono" style={{ fontSize: '13px', color: 'var(--text-bright)', lineHeight: '1.6', wordBreak: 'break-all', fontWeight: 500 }}>
                                        {item.value}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t" style={{ backgroundColor: 'var(--bg-panel)', borderTopColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4 }}>
                <span className="mono" style={{ fontSize: '9px' }}>ADDR_RANGE: 0x00...0xFF</span>
                <span className="mono" style={{ fontSize: '9px' }}>{stack.length} ITEMS</span>
            </div>
        </div>
    );
};
