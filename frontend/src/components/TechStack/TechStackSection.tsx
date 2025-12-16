import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { techStackData } from './techStack.data';

const TechStackSection: React.FC = () => {
    // Triple the data to ensure smooth infinite scrolling
    const duplicatedTech = [...techStackData, ...techStackData, ...techStackData];

    return (
        <section className="py-24 overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Core Technology Stack</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-400 mx-auto rounded-full opacity-80"></div>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                    Built with industry-leading tools and frameworks for maximum performance and scalability.
                </p>
            </div>

            <div
                className="relative w-full overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <motion.div
                    className="flex gap-12 sm:gap-16 md:gap-20 w-max px-4 py-8"
                    animate={{
                        x: ["0%", "-33.33%"]
                    }}
                    transition={{
                        duration: 35, // Slower for better readability
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {duplicatedTech.map((tech, index) => {
                        const Icon = tech.icon;
                        const [isHovered, setIsHovered] = useState(false);

                        return (
                            <motion.div
                                key={`${tech.id}-${index}`}
                                className="group relative flex flex-col items-center justify-center cursor-pointer"
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                whileHover={{ scale: 1.15, y: -5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{
                                    // @ts-ignore
                                    '--glow-color': tech.color
                                }}
                            >
                                {/* Glow Effect - Stronger on hover, subtle always */}
                                <div
                                    className="absolute inset-0 rounded-full blur-2xl transition-opacity duration-500"
                                    style={{
                                        backgroundColor: tech.color,
                                        opacity: isHovered ? 0.6 : 0.15
                                    }}
                                />

                                {/* Icon Container */}
                                <div
                                    className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-700/50 bg-gray-900/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:border-[var(--glow-color)] group-hover:bg-gray-800"
                                    style={{
                                        boxShadow: isHovered ? `0 0 20px -5px ${tech.color}` : `0 0 0 1px rgba(255,255,255,0.05)`
                                    }}
                                >
                                    {/* Icon with "Ideology" Animation */}
                                    <motion.div
                                        animate={isHovered ? {
                                            rotate: [0, -10, 10, -5, 5, 0], // Shake/Wiggle
                                            transition: { duration: 0.5 }
                                        } : {}}
                                    >
                                        <Icon
                                            size={40}
                                            className="transition-all duration-300"
                                            style={{
                                                color: tech.color, // Always colored as requested
                                                filter: isHovered ? `drop-shadow(0 0 8px ${tech.color})` : 'none'
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Tech Name Label */}
                                <span
                                    className="mt-5 text-sm font-bold tracking-wide transition-colors duration-300"
                                    style={{ color: isHovered ? tech.color : '#9CA3AF' }}
                                >
                                    {tech.name}
                                </span>

                                {/* Description Tooltip / Reveal */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 p-3 bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl z-50 pointer-events-none"
                                        >
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-t border-l border-gray-700 rotate-45"></div>
                                            <p className="text-xs text-gray-300 text-center leading-relaxed">
                                                {tech.description}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default TechStackSection;
