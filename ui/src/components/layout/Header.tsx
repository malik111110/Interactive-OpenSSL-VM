import React from 'react';
import { Shield, Zap, Cpu, Play, RotateCcw } from 'lucide-react';
import type { VmStatus } from '../../types/vm';

interface HeaderProps {
    status: VmStatus;
    fuel: number;
    pc: number;
    onRun: () => void;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, fuel, pc, onRun, onReset }) => {
    return (
        <header className="header-bar flex items-center justify-between flex-wrap relative z-50" style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-sidebar)' }}>
            {/* Decorative backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(56,189,248,0.03)] to-transparent pointer-events-none" />

            <div className="header-left flex items-center gap-6 relative z-10">
                <div className="flex items-center gap-4 group">
                    <div
                        className="flex items-center justify-center p-2.5 bg-[#0a0a0f] border border-[rgba(255,255,255,0.05)] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        style={{ color: 'var(--accent-primary)' }}
                    >
                        <Shield size={22} className="glow-text" />
                    </div>
                    <div>
                        <h1 className="flex items-center gap-2" style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px' }}>
                            OPENSSL VM
                            <span style={{ fontSize: '10px', backgroundColor: 'rgba(34,211,238,0.1)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontWeight: 700, border: '1px solid rgba(34,211,238,0.3)' }}>
                                PRO-ENV
                            </span>
                        </h1>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>
                            SessionID: {Math.random().toString(16).slice(2, 6).toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="header-right flex items-center gap-8 relative z-10">
                <div className="header-metrics flex items-center gap-4">
                    {/* Status Metrics */}
                    <div className="flex flex-col items-end gap-1">
                        <span style={{ fontSize: '8px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Energy Reserve</span>
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-lg">
                            <Zap size={13} style={{ color: fuel < 20 ? 'var(--accent-danger)' : 'var(--accent-primary)' }} />
                            <div style={{ width: '96px', height: '4px', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${fuel}%`,
                                        backgroundColor: fuel < 20 ? 'var(--accent-danger)' : 'var(--accent-primary)',
                                        boxShadow: `0 0 10px ${fuel < 20 ? 'var(--accent-danger)' : 'var(--accent-primary)'}`,
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#f4f4f5', width: '32px', textAlign: 'right' }}>{fuel}%</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <span style={{ fontSize: '8px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cycle Counter</span>
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-lg min-w-[100px] justify-center">
                            <Cpu size={13} style={{ color: 'var(--text-dim)' }} />
                            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>PC_{pc.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>

                <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0 8px' }} />

                <div className="header-actions flex items-center gap-3">
                    <button
                        onClick={onRun}
                        disabled={status === 'running'}
                        className="btn btn-primary"
                        style={{ height: '40px', padding: '0 24px' }}
                    >
                        <Play size={15} fill="currentColor" />
                        <span style={{ letterSpacing: '-0.2px' }}>INITIALIZE</span>
                    </button>

                    <button
                        onClick={onReset}
                        className="btn btn-ghost"
                        style={{ padding: '10px', borderRadius: '12px' }}
                        title="Reset VM"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};
