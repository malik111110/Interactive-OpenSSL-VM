import React from 'react';
import { Compass, BookOpen } from 'lucide-react';

export const LearningCenter: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-1">
                <Compass size={14} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--text-muted)' }}>
                    Learning Center
                </span>
            </div>

            <div className="learning-panel">
                <div className="learning-panel__icon">
                    <BookOpen size={16} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div className="learning-panel__content">
                    <h3>VM + OpenSSL Learning</h3>
                    <p>Explore stack operations, hashing, and encryption flows with the DSL and terminal.</p>
                </div>
            </div>
        </div>
    );
};
