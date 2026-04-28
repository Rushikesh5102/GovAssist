import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminWelcome = ({ onComplete, role = "Owner" }) => {
    const letters = "GovAssist".split("");
    const subText = `Welcomes ${role.charAt(0).toUpperCase() + role.slice(1)}`.split("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete && onComplete();
        }, 4500); // Animation duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
            transition: { duration: 0.8 }
        }
    };

    const letterVariants = {
        hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
        visible: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] animate-pulse delay-75" />
            </div>

            {/* Main Title */}
            <motion.div
                className="flex z-10 mb-4"
                variants={containerVariants}
            >
                {letters.map((char, index) => (
                    <motion.span
                        key={index}
                        variants={letterVariants}
                        className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-[0_0_15px_rgba(100,100,255,0.5)]"
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>

            {/* Subtitle */}
            <motion.div
                className="flex z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
            >
                {subText.map((char, index) => (
                    <motion.span
                        key={index}
                        variants={letterVariants}
                        className="text-2xl md:text-4xl font-light text-gray-300 tracking-widest"
                        style={{ marginRight: char === ' ' ? '1rem' : '0' }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>

            {/* Scanning Line Effect */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20 opacity-50"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            />

        </motion.div>
    );
};

export default AdminWelcome;
