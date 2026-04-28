import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Heart, Accessibility, CheckCircle, ArrowRight, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OnboardingPage = () => {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form State
    const [role, setRole] = useState(user?.role || 'citizen');
    const [location, setLocation] = useState({ state: '', district: '' });
    const [interests, setInterests] = useState([]);
    const [preferences, setPreferences] = useState({ accessibility: 'standard', language: 'en' });
    const [aadhar, setAadhar] = useState('');

    const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"]; // Demo list
    const interestOptions = [
        "Agriculture", "Education", "Healthcare", "Business", "Housing", "Social Welfare"
    ];

    const handleInterestToggle = (interest) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/complete-onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    role,
                    interests,
                    location,
                    preferences,
                    aadhar_number: aadhar || null
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Onboarding failed');
            }

            const data = await response.json();

            // Update context user
            updateUser({
                ...user,
                role: data.user.role,
                onboarding_completed: true,
                is_active: true
            });

            navigate('/');

        } catch (error) {
            console.error("Onboarding error:", error);
            // Show error toast/alert
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!location.state || !location.district.trim()) {
                alert("Please select your State and enter your District to continue.");
                return;
            }
        }
        if (step === 2) {
            if (interests.length === 0) {
                alert("Please select at least one interest to continue.");
                return;
            }
        }
        setStep(step + 1);
    };
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-2xl w-full glass-panel p-8 backdrop-blur-xl border-t border-white/20 shadow-2xl relative overflow-hidden">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-full bg-saffron transition-all duration-500 ease-in-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to GovAssist</h1>
                    <p className="text-gray-500 dark:text-gray-400">Let's personalize your experience</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Role & Location */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <User className="w-5 h-5 text-saffron" /> About You
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am a...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['citizen', 'student', 'farmer', 'business'].map((r) => (
                                        <div
                                            key={r}
                                            onClick={() => setRole(r)}
                                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${role === r
                                                    ? 'border-saffron bg-orange-50 dark:bg-orange-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                                                }`}
                                        >
                                            <div className="font-semibold capitalize text-gray-900 dark:text-white">{r}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={location.state}
                                        onChange={(e) => setLocation({ ...location, state: e.target.value })}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={location.district}
                                        onChange={(e) => setLocation({ ...location, district: e.target.value })}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="Enter District"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Interests */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-saffron" /> Your Interests
                            </h2>
                            <p className="text-sm text-gray-500">Select topics you are interested in to see relevant schemes. <span className="text-red-500 font-medium">(Required)</span></p>

                            <div className="flex flex-wrap gap-3">
                                {interestOptions.map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => handleInterestToggle(interest)}
                                        className={`px-4 py-2 rounded-full border transition-all ${interests.includes(interest)
                                                ? 'bg-saffron text-white border-saffron'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-saffron'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Preferences & Finish */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Accessibility className="w-5 h-5 text-saffron" /> Preferences
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accessibility Mode</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPreferences({ ...preferences, accessibility: 'standard' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${preferences.accessibility === 'standard'
                                                ? 'border-saffron bg-orange-50 dark:bg-orange-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-900 dark:text-white">Standard</div>
                                        <div className="text-xs text-gray-500">Regular interface</div>
                                    </div>
                                    <div
                                        onClick={() => setPreferences({ ...preferences, accessibility: 'voice' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${preferences.accessibility === 'voice'
                                                ? 'border-saffron bg-orange-50 dark:bg-orange-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-900 dark:text-white">Voice First</div>
                                        <div className="text-xs text-gray-500">Optimized for screen readers</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aadhar Number (Optional)</label>
                                <input
                                    type="text"
                                    value={aadhar}
                                    onChange={(e) => setAadhar(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Link Aadhar now or later"
                                    pattern="\d*"
                                    maxLength={12}
                                />
                            </div>

                            <div className="flex justify-between pt-6">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {isLoading ? "Completing..." : "Complete Setup"} <CheckCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;
