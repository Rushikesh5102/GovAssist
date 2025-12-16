import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, desc, delay, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={`group relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
        hover:shadow-lg dark:hover:shadow-gray-700/30 transition-all duration-300 ease-out hover:-translate-y-1 ${className}`}
        >
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 text-primary group-hover:bg-primary/5 dark:group-hover:bg-primary/20 transition-colors">
                {icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                {title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {desc}
            </p>

            {/* Subtle Micro-Glow on Hover */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-primary/10 pointer-events-none transition-all" />
        </motion.div>
    );
};

export default FeatureCard;
