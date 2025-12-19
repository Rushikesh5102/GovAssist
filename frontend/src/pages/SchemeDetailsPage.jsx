import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, Award, ExternalLink } from 'lucide-react';

const SchemeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchemeDetails = async () => {
            try {
                const response = await fetch(`/api/schemes/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setScheme(data);
                }
            } catch (error) {
                console.error('Failed to fetch scheme details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemeDetails();
    }, [id]);

    if (loading) return <div className="p-8"><div className="animate-pulse h-64 bg-gray-200 dark:bg-white/5 rounded-xl"></div></div>;
    if (!scheme) return <div className="p-8 text-center text-gray-500">Scheme not found.</div>;

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-saffron mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Schemes
                </button>

                <div className="glass-panel p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="p-4 bg-saffron-glass rounded-xl border border-saffron/20 h-fit">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="w-12 h-12 opacity-90 invert brightness-0" />
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                                    {scheme.ministry}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">
                                    {scheme.category}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{scheme.name}</h1>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                {scheme.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Benefits */}
                        {scheme.benefits && (
                            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    <Award className="text-saffron" size={20} /> Benefits
                                </h3>
                                <ul className="space-y-3">
                                    {Object.entries(scheme.benefits).map(([key, value]) => (
                                        <li key={key} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                            <CheckCircle className="text-green-500 mt-1 shrink-0" size={16} />
                                            <span><strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Eligibility */}
                        {scheme.eligibility_criteria && (
                            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    <CheckCircle className="text-saffron" size={20} /> Eligibility
                                </h3>
                                <ul className="space-y-3">
                                    {Object.entries(scheme.eligibility_criteria).map(([key, value]) => (
                                        <li key={key} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0"></div>
                                            <span><strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Documents */}
                    {scheme.documents_required && (
                        <div className="mt-8 bg-white/50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                <FileText className="text-saffron" size={20} /> Documents Required
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {scheme.documents_required.map((doc, index) => (
                                    <span key={index} className="px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg text-sm border border-gray-200 dark:border-white/5">
                                        {doc}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-3 bg-saffron hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-saffron/20 transition-all transform hover:scale-105">
                            Apply Now <ExternalLink size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemeDetailsPage;
