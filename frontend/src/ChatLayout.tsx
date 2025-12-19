import React, { useState, useEffect } from 'react';
import Sidebar from './components/Nav/Sidebar';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import OnboardWizard from './components/Onboarding/OnboardWizard';
import SettingsModal from './components/Settings/SettingsModal';

const ChatLayout = ({ children }) => {
    const location = useLocation();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (!hasOnboarded) {
            const timer = setTimeout(() => setShowOnboarding(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        localStorage.setItem('hasOnboarded', 'true');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <div className="hidden md:block shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden bg-white dark:bg-[#050510] bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#050510] dark:via-gray-900 dark:to-[#050510]">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-saffron/10 dark:bg-saffron/5 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indiaGreen/10 dark:bg-indiaGreen/5 blur-[100px]" />
                </div>
                {children}
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showOnboarding && <OnboardWizard onClose={handleOnboardingComplete} />}
                {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default ChatLayout;
