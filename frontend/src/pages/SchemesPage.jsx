import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SchemesPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'recommended'

    useEffect(() => {
        fetchSchemes();
    }, [activeTab]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeTab === 'all') fetchSchemes();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const HARDCODED_SCHEMES = [
        {
            id: 101,
            name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            description: "Income support of ₹6,000/- per year in three equal installments to all landholding farmer families.",
            category: "Agriculture",
            ministry: "Ministry of Agriculture and Farmers Welfare",
            active: true
        },
        {
            id: 102,
            name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
            description: "Financial assistance for construction of pucca house for homeless and those living in dilapidated houses in rural areas.",
            category: "Housing",
            ministry: "Ministry of Rural Development",
            active: true
        },
        {
            id: 103,
            name: "Ayushman Bharat - PMJAY",
            description: "Health coverage of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
            category: "Health",
            ministry: "Ministry of Health and Family Welfare",
            active: true
        },
        {
            id: 104,
            name: "Atal Pension Yojana (APY)",
            description: "Pension scheme for citizens of India focused on unorganized sector workers.",
            category: "Pension",
            ministry: "Ministry of Finance",
            active: true
        },
        {
            id: 105,
            name: "Skill India Mission",
            description: "Vocational training and certification to youth for better employability.",
            category: "Education",
            ministry: "Ministry of Skill Development",
            active: true
        }
    ];

    const fetchSchemes = async () => {
        setLoading(true);
        try {
            let url = '/api/schemes';
            if (activeTab === 'recommended') {
                url = '/api/schemes/recommend';
            } else if (searchTerm) {
                url = `/api/schemes?search=${encodeURIComponent(searchTerm)}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setSchemes(data);
                } else {
                    // Fallback if API returns empty list (e.g. empty DB)
                    console.warn("API returned empty list. Using Hardcoded Fallback.");
                    setSchemes(HARDCODED_SCHEMES);
                }
            } else {
                throw new Error("API Response not OK");
            }
        } catch (error) {
            console.error('Failed to fetch schemes, using fallback', error);
            // Fallback on error (e.g. Network Error, 500)
            setSchemes(HARDCODED_SCHEMES);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 h-full">
            <div className="max-w-7xl mx-auto glass-panel p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('schemes_page.title')}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{t('schemes_page.subtitle')}</p>
                    </div>

                    <div className="flex gap-3">
                        {user && (
                            <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white dark:bg-white/10 shadow-sm text-saffron' : 'text-gray-500'}`}
                                >
                                    <LayoutGrid size={16} className="inline mr-2" />
                                    All Schemes
                                </button>
                                <button
                                    onClick={() => setActiveTab('recommended')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'recommended' ? 'bg-white dark:bg-white/10 shadow-sm text-saffron' : 'text-gray-500'}`}
                                >
                                    <Sparkles size={16} className="inline mr-2" />
                                    For You
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {activeTab === 'all' && (
                    <div className="mb-6 flex gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('schemes_page.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="glass-input pl-9 pr-4 py-2 rounded-lg text-sm w-full"
                            />
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schemes.map((scheme) => (
                            <div key={scheme.id} className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:bg-white dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 flex flex-col group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-saffron-glass rounded-lg border border-saffron/20">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="w-8 h-8 opacity-90 invert brightness-0" />
                                    </div>
                                    {scheme.active && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 text-xs font-medium rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-saffron transition-colors">{scheme.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                    {scheme.description}
                                </p>
                                <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                                    <span className="text-xs text-gray-500 truncate max-w-[60%]">{scheme.ministry}</span>
                                    <button
                                        onClick={() => navigate(`/schemes/${scheme.id}`)}
                                        className="text-saffron hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
                                    >
                                        View Details <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {schemes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No schemes found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchemesPage;
