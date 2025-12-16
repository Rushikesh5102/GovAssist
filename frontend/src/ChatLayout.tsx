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
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <div className="hidden md:block shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden bg-[#212121]">
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
