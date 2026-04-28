import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Briefcase, Heart, FileText, Key, CheckCircle, Eye, EyeOff, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import AdminWelcome from '../components/Auth/AdminWelcome';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const { t } = useTranslation();
    const { login } = useAuth(); // We might use this after verification
    const navigate = useNavigate();

    const [showAdminWelcome, setShowAdminWelcome] = useState(false);
    const [roleForWelcome, setRoleForWelcome] = useState('');

    // Form State
    const [step, setStep] = useState(1); // 1: Signup Form, 2: OTP Verification
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('citizen');

    // OTP State
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    // UI State
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName || 'Dummy',
                    phone_number: phoneNumber || '0000000000',
                    role: role, // Intent handling
                    language: 'en' // Default for now
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed');
            }

            if (data.access_token) {
                // Admin or owner bypass
                setIsLoading(false);
                setRoleForWelcome(role);
                setShowAdminWelcome(true);
                login(data.access_token, null);
                return;
            }

            // Success: User created, OTP sent
            if (data.otp_debug) console.log("OTP DEBUG:", data.otp_debug);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'OTP Verification failed');
            }

            // Success: Token received
            // Login user implicitly (this sets the token in context)
            // But we don't have full user data yet, context might fetch 'me'
            // or we can pass partial data if we had it.
            // Let's rely on context fetching 'me' or just navigating.
            login(data.access_token, null); // Context will fetch /me

            // Navigate to Onboarding
            navigate('/onboarding');

        } catch (err) {
            setOtpError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnimationComplete = () => {
        navigate(`/${roleForWelcome}`);
    };

    return (
        <>
            <AnimatePresence>
                {showAdminWelcome && (
                    <AdminWelcome onComplete={handleAnimationComplete} role={roleForWelcome} />
                )}
            </AnimatePresence>

            <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="max-w-md w-full glass-panel p-8 backdrop-blur-xl border-t border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-saffron mb-2">
                        {step === 1 ? t('auth.signup.title') : "Verify OTP"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {step === 1 ? t('auth.signup.subtitle') : `Enter the code sent to ${phoneNumber}`}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Role Selection - Intent */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.labels.role')}</label>
                            <div className="relative">
                                <Briefcase className="absolute inset-y-0 left-0 pl-3 h-full w-8 text-gray-500" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 glass-input rounded-lg text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-gray-900"
                                >
                                    <option value="citizen">{t('auth.roles.citizen')}</option>
                                    <option value="student">{t('auth.roles.student')}</option>
                                    <option value="farmer">{t('auth.roles.farmer')}</option>
                                    <option value="business">{t('auth.roles.business')}</option>
                                    <option value="admin">Admin</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>
                        </div>

                        {/* Full Name */}
                        {role !== 'admin' && role !== 'owner' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.labels.full_name')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute inset-y-0 left-0 pl-3 h-full w-8 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 glass-input rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder={t('auth.labels.name_placeholder')}
                                />
                            </div>
                        </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.labels.email')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute inset-y-0 left-0 pl-3 h-full w-8 text-gray-500" />
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

                        {/* Phone */}
                        {role !== 'admin' && role !== 'owner' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.labels.phone')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute inset-y-0 left-0 pl-3 h-full w-8 text-gray-500" />
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 glass-input rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
                                    placeholder={t('auth.labels.phone_placeholder')}
                                />
                            </div>
                        </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.labels.password')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Lock className="absolute inset-y-0 left-0 pl-3 h-full w-8 text-gray-500" />
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
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 glass-button-primary rounded-lg text-sm font-medium text-white hover:scale-105 transform transition-all disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? "creating Account..." : "Continue"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                            <div className="relative">
                                <Key className="absolute inset-y-0 left-0 pl-3 h-full w-8 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 glass-input rounded-lg text-gray-900 dark:text-white placeholder-gray-500 tracking-widest text-lg"
                                    placeholder="123456"
                                    maxLength={6}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Check your console for the OTP (Dev Mode)</p>
                        </div>

                        {otpError && <p className="text-red-400 text-sm text-center">{otpError}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 glass-button-primary rounded-lg text-sm font-medium text-white hover:scale-105 transform transition-all disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? "Verifying..." : "Verify & Enable Account"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('auth.signup.has_account')}{' '}
                        <Link to="/login" className="font-medium text-saffron hover:text-orange-400">
                            {t('auth.signup.signin_link')}
                        </Link>
                    </p>
                </div>
            </div>
            </div>
        </>
    );
};

export default SignupPage;
