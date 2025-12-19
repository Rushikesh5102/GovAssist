import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import ChatLayout from './ChatLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const SchemesPage = lazy(() => import('./pages/SchemesPage'));
const SchemeDetailsPage = lazy(() => import('./pages/SchemeDetailsPage'));
const EligibilityPage = lazy(() => import('./pages/EligibilityPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const SharePage = lazy(() => import('./pages/SharePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));

// Loading Fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading GovAssist AI...</p>
        </div>
    </div>
);

const App = () => {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <Router>
                    <Suspense fallback={<PageLoader />}>
                        <AuthProvider>
                            <Routes>
                                <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
                                <Route path="/chat" element={<ChatLayout><ChatPage /></ChatLayout>} />
                                <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
                                <Route path="/privacy" element={<AppLayout><PrivacyPage /></AppLayout>} />
                                <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
                                <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
                                <Route path="/signup" element={<AppLayout><SignupPage /></AppLayout>} />
                                <Route path="/schemes" element={<AppLayout><SchemesPage /></AppLayout>} />
                                <Route path="/schemes/:id" element={<AppLayout><SchemeDetailsPage /></AppLayout>} />
                                <Route path="/eligibility" element={<AppLayout><EligibilityPage /></AppLayout>} />
                                <Route path="/upload" element={<AppLayout><UploadPage /></AppLayout>} />
                                <Route path="/share/:token" element={<SharePage />} />
                                <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
                                <Route path="/onboarding" element={<AppLayout><OnboardingPage /></AppLayout>} />
                                <Route path="/admin" element={<AppLayout><AdminPage /></AppLayout>} />
                            </Routes>
                        </AuthProvider>
                    </Suspense>
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
