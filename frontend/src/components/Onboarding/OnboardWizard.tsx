import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, Bot, FileText, Upload } from 'lucide-react';

const steps = [
    {
        title: "Welcome to GovAssist AI",
        description: "Your intelligent companion for navigating Indian Government schemes and documents.",
        icon: <Bot size={48} className="text-primary" />,
    },
    {
        title: "Smart Chat",
        description: "Ask questions in English, Hindi, or Marathi. Get instant, accurate answers.",
        icon: <FileText size={48} className="text-secondary" />,
    },
    {
        title: "Document Analysis",
        description: "Upload PDFs or images. We'll analyze them and help you understand the details.",
        icon: <Upload size={48} className="text-accent" />,
    },
];

const OnboardWizard = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-800"
            >
                <div className="p-8 flex flex-col items-center text-center min-h-[400px]">
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                                    {steps[currentStep].icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {steps[currentStep].title}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {steps[currentStep].description}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="w-full mt-8 flex flex-col gap-4">
                        <div className="flex justify-center gap-2 mb-4">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStep
                                        ? 'bg-primary w-6'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {currentStep === steps.length - 1 ? (
                                <>Get Started <Check size={20} /></>
                            ) : (
                                <>Next <ChevronRight size={20} /></>
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardWizard;
