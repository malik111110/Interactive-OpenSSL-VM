import React from 'react';
import { Activity } from 'lucide-react';

interface FooterProps {
    wasmReady: boolean;
}

export const Footer: React.FC<FooterProps> = ({ wasmReady }) => {
    return (
        <footer className="flex items-center justify-between px-8 relative z-50" style={{ height: '40px', backgroundColor: '#020202', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <Activity size={12} className={wasmReady ? 'text-[#4ade80]' : 'text-[#fbbf24] animate-pulse'} />
                    <span className="mono" style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#52527a' }}>
                        WASM CORE: <span style={{ color: wasmReady ? '#4ade80' : '#fbbf24' }}>{wasmReady ? 'OPTIMIZED' : 'SYNCING'}</span>
                    </span>
                </div>

                <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

                <div className="flex gap-4">
                    <span className="mono" style={{ fontSize: '9px', color: '#52527a', textTransform: 'uppercase' }}>Latency: 2ms</span>
                    <span className="mono" style={{ fontSize: '9px', color: '#52527a', textTransform: 'uppercase' }}>Buffers: Validated</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <span className="mono" style={{ fontSize: '9px', color: '#333333', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                    OpenSSL Virtual Machine Lab // 2026.PROTO.01
                </span>
                <div className="flex gap-1.5" style={{ opacity: 0.2 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                    ))}
                </div>
            </div>
        </footer>
    );
};
