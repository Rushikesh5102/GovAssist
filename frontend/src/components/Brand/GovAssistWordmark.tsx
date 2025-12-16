import React from 'react';

const GovAssistWordmark = ({ className = '' }) => {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            {/* Logo Mark - Abstract Tri-color node */}
            <div className="relative h-8 w-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[2px]" />
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" className="text-primary" />
                    <path d="M12 22a10 10 0 0 1-10-10h2a8 8 0 0 0 8 8v2z" className="text-secondary" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" className="text-accent" />
                </svg>
            </div>

            {/* Text Container */}
            <h1 className="relative flex items-center tracking-tight text-3xl font-bold">
                <span className="text-gray-900 dark:text-white transition-colors">
                    Gov
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-light transition-colors">
                    Assist
                </span>

                {/* AI Gradient Text */}
                <span className="ml-1 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary font-extrabold relative">
                    AI
                    {/* Subtle Glow */}
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-lg -z-10 opacity-50" />
                </span>
            </h1>
        </div>
    );
};

export default GovAssistWordmark;
