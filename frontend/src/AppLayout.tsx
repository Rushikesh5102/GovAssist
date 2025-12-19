import React, { useState, useEffect } from 'react';
import Topbar from './components/Nav/Topbar';
import Footer from './components/Nav/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import OnboardWizard from './components/Onboarding/OnboardWizard';
import SettingsModal from './components/Settings/SettingsModal';

const AppLayout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Old Tour Logic
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (!hasOnboarded && !isAuthPage) {
            const timer = setTimeout(() => setShowOnboarding(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [isAuthPage]);

    // Mandatory Profile Onboarding Protection
    useEffect(() => {
        if (!loading && user && !(user as any).onboarding_completed && location.pathname !== '/onboarding') {
            navigate('/onboarding');
        }
    }, [user, loading, location.pathname, navigate]);

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        localStorage.setItem('hasOnboarded', 'true');
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-transparent transition-colors duration-300 relative z-0">
            <Topbar onOpenSettings={() => setShowSettings(true)} />

            <main className="pt-16 min-h-screen flex flex-col relative z-10">
                {children}
            </main>

            <Footer />

            {/* Background Gradients - Adjusted for Deep Space Theme */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-saffron-glow/10 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indiaGreen-glow/10 blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-navy-light/5 blur-[150px]" />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showOnboarding && <OnboardWizard onClose={handleOnboardingComplete} />}
                {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default AppLayout;
