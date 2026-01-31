import React from 'react';
import { Trophy, Compass } from 'lucide-react';

export const LearningCenter: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-1">
                <Compass size={14} className="text-[#38bdf8]" />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#52527a' }}>
                    Mission Intel
                </span>
            </div>

            <div className="relative p-6 rounded-2xl overflow-hidden group" style={{ backgroundColor: '#08080c', border: '1px solid rgba(56,189,248,0.15)' }}>
                {/* Subtle background glow */}
                <div className="absolute" style={{ top: '-40px', right: '-40px', width: '128px', height: '128px', backgroundColor: 'rgba(56,189,248,0.1)', filter: 'blur(40px)', borderRadius: '50%' }} />

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.2px', marginBottom: '4px' }}>SHA-256 Protocol</h3>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Phase 01: Integrity</span>
                        </div>
                        <div className="p-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl">
                            <Trophy size={16} className="text-[#fbbf24] glow-text" />
                        </div>
                    </div>

                    <p style={{ fontSize: '11px', color: '#9494b8', lineHeight: '1.6' }}>
                        Construct a deterministic fingerprint for incoming data streams using the Secure Hash Algorithm.
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-end">
                            <span style={{ fontSize: '9px', fontWeight: 900, color: '#52527a', textTransform: 'uppercase' }}>System Mastery</span>
                            <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8' }}>40%</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#000000', borderRadius: '100px', padding: '2px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                                    borderRadius: '100px',
                                    boxShadow: '0 0 10px rgba(56,189,248,0.3)',
                                    width: '40%'
                                }}
                            />
                        </div>
                    </div>

                    <button className="flex items-center justify-center gap-2 mt-2 w-full py-2.5 rounded-lg transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f4f4f5', cursor: 'pointer' }}>
                        View briefings
                    </button>
                </div>
            </div>
        </div>
    );
};
