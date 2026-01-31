import React from 'react';
import { Shield, Zap, Cpu, Play, StepForward, RotateCcw } from 'lucide-react';
import type { VmStatus } from '../../types/vm';

interface HeaderProps {
    status: VmStatus;
    fuel: number;
    pc: number;
    onRun: () => void;
    onStep: () => void;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, fuel, pc, onRun, onStep, onReset }) => {
    return (
        <header className="flex items-center justify-between" style={{ height: 64, borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '0 1.5rem', zIndex: 10 }}>
            <div className="flex items-center gap-4">
                <div style={{ padding: 8, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 8, color: 'var(--accent-blue)' }}>
                    <Shield size={20} />
                </div>
                <div>
                    <h1 style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        OpenSSL VM
                        <span style={{ fontSize: '10px', background: 'var(--bg-accent)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: 4, marginLeft: 8, fontWeight: 'normal', fontFamily: 'var(--font-mono)' }}>
                            v0.1.0
                        </span>
                    </h1>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Interactive Virtual Sandbox</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
                        <Zap size={14} style={{ color: fuel < 20 ? 'var(--accent-amber)' : 'var(--text-muted)' }} />
                        <span className="mono" style={{ fontSize: '11px', fontWeight: 'bold' }}>FUEL: {fuel}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
                        <Cpu size={14} style={{ color: 'var(--text-muted)' }} />
                        <span className="mono" style={{ fontSize: '11px', fontWeight: 'bold' }}>PC: {pc.toString().padStart(3, '0')}</span>
                    </div>
                </div>

                <div style={{ width: 1, height: 24, background: 'var(--border-color)' }} />

                <div className="flex items-center gap-2">
                    <button
                        onClick={onRun}
                        disabled={status === 'running'}
                        className="btn-primary"
                        style={{ fontSize: '12px' }}
                    >
                        <Play size={14} fill="currentColor" />
                        Run
                    </button>
                    <button
                        onClick={onStep}
                        disabled={status === 'running'}
                        className="btn-secondary"
                        style={{ fontSize: '12px', padding: '0.5rem 0.75rem' }}
                    >
                        <StepForward size={14} />
                        Step
                    </button>
                    <button
                        onClick={onReset}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
};
