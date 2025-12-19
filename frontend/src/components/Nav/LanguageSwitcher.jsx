import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
    { code: 'en', name: 'English', label: 'English' },
    { code: 'hi', name: 'Hindi', label: 'हिंदी' },
    { code: 'mr', name: 'Marathi', label: 'मराठी' }
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Ensure current language is valid, default to 'en'
    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];



    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                aria-label="Select Language"
            >
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="hidden sm:inline uppercase text-sm font-medium tracking-wide">
                    {currentLang.label}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="py-2">
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5 mb-1">
                                    Select Language
                                </div>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between group transition-colors duration-200
                                            ${currentLang.code === lang.code ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                                        `}
                                    >
                                        <span className="font-medium">{lang.label}</span>
                                        {currentLang.code === lang.code && (
                                            <Check className="w-4 h-4 text-cyan-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
