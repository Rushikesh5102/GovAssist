import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, FileText, Briefcase, Heart, Layout, LogOut, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, loading: authLoading, logout } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(false);
    // We can alias loading to avoid conflict if we had local loading, but checking code...

    // Original code had local state user, isLoading.
    // We can replace them.

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [authLoading, user, navigate]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!user) return null; // Should redirect via useEffect

    // handleLogout can now just call logout() from context
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-saffron via-gray-900 to-indiaGreen dark:from-saffron dark:via-white dark:to-indiaGreen">
                {t('nav.profile', 'My Profile')}
            </h1>

            <div className="glass-panel p-8 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron via-white to-indiaGreen"></div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Section */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-1 mb-4 shadow-lg ring-2 ring-saffron/50">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                                <span className="text-4xl font-bold text-gray-600 dark:text-gray-400">
                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.full_name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{user.role}</p>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2 rounded-full glass-button-secondary text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all font-medium text-sm w-full justification-center"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/3 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail size={14} className="text-saffron" /> Email
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium glass-input px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">{user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Phone size={14} className="text-saffron" /> Phone
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium glass-input px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">{user.phone_number || 'N/A'}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FileText size={14} className="text-saffron" /> Aadhar Number
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium glass-input px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">{user.aadhar_number || 'Not Verified'}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Briefcase size={14} className="text-saffron" /> Role
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium glass-input px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5 capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="space-y-1 mt-4">
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Heart size={14} className="text-saffron" /> Interests
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.interests ? (
                                    (() => {
                                        try {
                                            const interestsList = JSON.parse(user.interests);
                                            return Array.isArray(interestsList) && interestsList.length > 0
                                                ? interestsList.map((interest, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-saffron/10 border border-saffron/30 text-orange-700 dark:text-saffron-light rounded-full text-xs">
                                                        {interest}
                                                    </span>
                                                ))
                                                : <span className="text-gray-500 italic pb-2">No specific interests listed</span>;
                                        } catch (e) {
                                            return <span className="text-gray-500 italic">No specific interests listed</span>;
                                        }
                                    })()
                                ) : (
                                    <span className="text-gray-500 italic">No specific interests listed</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="text-indiaGreen" size={20} /> Recommended Schemes For You
                        </h3>
                        <span className="text-xs text-gray-500 italic">Based on your documents & profile</span>
                    </div>

                    {recLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indiaGreen"></div>
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendations.map((rec) => (
                                <div
                                    key={rec.scheme_id}
                                    onClick={() => navigate(`/schemes/${rec.scheme_id}`)}
                                    className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indiaGreen transition-colors line-clamp-1">{rec.scheme_name}</h4>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${rec.status === 'Eligible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                            {rec.match_score}% Match
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{rec.category} • {rec.status}</p>

                                    {rec.missing_criteria.length > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] text-orange-500">
                                            <AlertCircle size={10} /> Missing: {rec.missing_criteria.join(', ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                            <Info className="mx-auto text-gray-400 mb-2" size={24} />
                            <p className="text-sm text-gray-500 dark:text-gray-400">No specific matches yet. Upload documents or update your interests to see recommendations.</p>
                            <button
                                onClick={() => navigate('/upload')}
                                className="mt-4 text-saffron text-sm font-medium hover:underline"
                            >
                                Go to Document Upload →
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
