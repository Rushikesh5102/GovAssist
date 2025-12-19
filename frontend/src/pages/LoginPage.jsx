import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import AdminWelcome from '../components/Auth/AdminWelcome';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAdminWelcome, setShowAdminWelcome] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`/api/auth/login?remember_me=${rememberMe}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Login failed');
            }

            const data = await response.json();
            // Direct login (Token received immediately)
            await handleLoginSuccess(data.access_token);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = async (token) => {
        try {
            const userResponse = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();

                // Admin Flow
                if (userData.is_admin || userData.role === 'admin') {
                    setIsLoading(false);
                    setShowAdminWelcome(true);
                    login(token, userData);
                    return;
                }

                // Set User State
                login(token, userData);

                // Check Onboarding Logic
                if (userData.onboarding_completed === false) {
                    navigate('/onboarding');
                } else {
                    navigate('/');
                }
            } else {
                throw new Error("Failed to fetch user profile");
            }
        } catch (e) {
            console.error("Error fetching user details", e);
            setError("Failed to load user profile");
            setIsLoading(false);
        }
    };

    const handleAnimationComplete = () => {
        navigate('/');
    };

    return (
        <>
            <AnimatePresence>
                {showAdminWelcome && (
                    <AdminWelcome onComplete={handleAnimationComplete} />
                )}
            </AnimatePresence>

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full glass-panel p-8 backdrop-blur-xl border-t border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-saffron mb-2">{t('auth.login.title')}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{t('auth.login.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.labels.email')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 glass-input rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder={t('auth.labels.email_placeholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.labels.password')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 glass-input rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-white/10 text-saffron focus:ring-saffron"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 glass-button-primary rounded-lg text-sm font-medium text-white hover:scale-105 transform transition-all disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? t('auth.login.btn_signing_in') : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.login.no_account')}{' '}
                            <Link to="/signup" className="font-medium text-saffron hover:text-orange-400">
                                {t('auth.login.signup_link')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
