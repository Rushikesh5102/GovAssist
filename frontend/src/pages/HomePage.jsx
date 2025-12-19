import React from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { ArrowRight, Shield, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen transition-colors">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl drop-shadow-lg">
                                <span className="block mb-2">{t('home.hero.title_1')}</span>
                                <span className="block text-gradient-tricolor text-transparent bg-clip-text animate-gradient-x pb-2">
                                    {t('home.hero.title_2')}
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-6 max-w-md mx-auto text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl leading-relaxed"
                        >
                            {t('home.hero.subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4"
                        >
                            <a
                                href="/chat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button-primary group flex items-center justify-center px-8 py-3 text-base font-bold rounded-xl md:py-4 md:text-lg transform hover:scale-105"
                            >
                                {t('home.hero.cta_try')}
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </a>
                            <Link
                                to="/signup"
                                className="flex items-center justify-center px-8 py-3 border border-glass-border text-base font-medium rounded-xl text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-glass-white hover:bg-white/80 dark:hover:bg-glass-whiteHover md:py-4 md:text-lg transition-all transform hover:scale-105 backdrop-blur-sm shadow-sm"
                            >
                                {t('home.hero.cta_signup')}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>


            {/* Features Section */}
            <div className="py-16 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {t('home.features.title')}
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: MessageSquare, title: t('home.features.chat_title'), desc: t('home.features.chat_desc'), color: "saffron" },
                            { icon: BookOpen, title: t('home.features.schemes_title'), desc: t('home.features.schemes_desc'), color: "navy" },
                            { icon: FileText, title: t('home.features.docs_title'), desc: t('home.features.docs_desc'), color: "indiaGreen" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="glass-panel p-8 hover:bg-white/80 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 border border-gray-200/50 dark:border-glass-border/50"
                            >
                                <div className={`w-12 h-12 bg-${feature.color}-glass text-${feature.color}-glow rounded-xl flex items-center justify-center mb-6`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subscribe Section */}
            <div className="py-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center glass-panel p-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('home.subscribe.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        {t('home.subscribe.desc')}
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder={t('home.subscribe.placeholder')}
                            className="glass-input px-6 py-3 rounded-xl w-full sm:w-auto min-w-[300px] outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className="glass-button-primary px-8 py-3 rounded-xl transform hover:-translate-y-1"
                        >
                            {t('home.subscribe.btn')}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;
