import React from 'react';
import { BookOpen, Trophy } from 'lucide-react';

export const LearningCenter: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                <BookOpen size={12} />
                Learning Path
            </div>

            <div style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 5, right: 5, opacity: 0.1 }}>
                    <Trophy size={40} />
                </div>

                <h3 style={{ fontSize: '13px', color: 'var(--accent-blue)', marginBottom: '0.25rem' }}>SHA-256 Hashing</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Master the fundamentals of cryptographic hashing.
                </p>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        <span>Progress</span>
                        <span>40%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--bg-primary)', borderRadius: 2 }}>
                        <div style={{ height: '100%', background: 'var(--accent-blue)', width: '40%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
