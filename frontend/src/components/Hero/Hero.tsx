import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GovAssistWordmark from '../Brand/GovAssistWordmark';

const MinimalChakra = React.lazy(() => import('./MinimalChakra'));

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
            {/* Background Gradients (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left z-10"
                >
                    {/* Pill Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 mb-6 backdrop-blur-sm shadow-sm transition-colors hover:border-primary/30">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                            AI Governance 2.0
                        </span>
                    </div>

                    {/* Wordmark / Title */}
                    <div className="mb-6">
                        <GovAssistWordmark className="mb-4 text-5xl md:text-6xl origin-left scale-90 sm:scale-100" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                            Simplifying India's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Digital Future
                            </span>
                        </h1>
                    </div>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-light max-w-lg leading-relaxed">
                        "Desh Ki Pragati, Aapke Saath." <br />
                        Experience the next generation of citizen services with intelligent, multilingual AI support.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4">
                        <Link to="/chat" className="group px-6 py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:scale-105 transition-all shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center gap-2">
                            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/schemes" className="px-6 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                            View Schemes
                        </Link>
                    </div>
                </motion.div>

                {/* Right 3D Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center z-0"
                >
                    <Suspense fallback={<div className="w-64 h-64 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />}>
                        <MinimalChakra />
                    </Suspense>

                    {/* Background decorative glow behind 3D */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 rounded-full blur-[80px] -z-10" />
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
