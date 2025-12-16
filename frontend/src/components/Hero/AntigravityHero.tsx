import React, { Suspense } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import InteractiveParticles from './InteractiveParticles';
import GovAssistWordmark from '../Brand/GovAssistWordmark';

import { motion } from 'framer-motion';

const AntigravityHero = () => {
    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden text-center px-4">
            {/* Background Particles */}
            <Suspense fallback={null}>
                <InteractiveParticles />
            </Suspense>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
                className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
            >
                {/* Logo / Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="mb-8"
                >
                    <GovAssistWordmark className="scale-125 origin-center" />
                </motion.div>

                {/* Hero Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 mb-6 leading-[1.1]"
                >
                    Experience intelligent <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
                        governance liftoff
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl font-light tracking-wide"
                >
                    GovAssist AI uses browser-in-the-loop interaction to speed up your access to schemes and documents.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                >
                    <button className="group px-8 py-4 bg-black text-white rounded-full font-medium text-lg hover:bg-gray-900 hover:scale-105 transition-all flex items-center gap-2 shadow-2xl shadow-black/20 ring-1 ring-white/20">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform">
                            <path d="M1 18h22v2H1zm0-7h22v2H1zm0-7h22v2H1z" />
                        </svg>
                        Download for Windows
                    </button>
                    <button className="px-8 py-4 bg-gray-50 text-gray-900 border border-gray-200 rounded-full font-medium text-lg hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all flex items-center gap-2">
                        Explore use cases
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AntigravityHero;
