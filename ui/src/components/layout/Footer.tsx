import React from 'react';

interface FooterProps {
    wasmReady: boolean;
}

export const Footer: React.FC<FooterProps> = ({ wasmReady }) => {
    return (
        <footer className="flex items-center justify-between" style={{ height: 32, padding: '0 1rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', zIndex: 10 }}>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: wasmReady ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
                    <span className="mono" style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                        WASM CORE: {wasmReady ? 'ONLINE' : 'BOOTING'}
                    </span>
                </div>
                <div style={{ width: 1, height: 12, background: 'var(--border-color)' }} />
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MEM: 128MB</span>
            </div>

            <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Interactive OpenSSL Virtual Machine
            </div>
        </footer>
    );
};
