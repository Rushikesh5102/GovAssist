import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AboutSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white/90">
                        {t('about.title')}
                    </h2>

                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-10 rounded-full" />

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-8">
                        {t('about.desc_1')}
                    </p>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                        {t('about.desc_2')}
                    </p>
                </motion.div>
            </div>

            {/* Subtle Background Elements */}
            <div className="absolute top-1/2 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-1/2 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
        </section>
    );
};

export default AboutSection;
