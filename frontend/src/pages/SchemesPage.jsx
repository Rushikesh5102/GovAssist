import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';

const SchemesPage = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const response = await fetch('/api/schemes');
            if (response.ok) {
                const data = await response.json();
                setSchemes(data);
            }
        } catch (error) {
            console.error('Failed to fetch schemes', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSchemes = schemes.filter(scheme => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || scheme.category === filter; // Assuming category exists or we add it
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 md:p-8 h-full">
            <div className="max-w-7xl mx-auto glass-panel p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Government Schemes</h1>
                        <p className="text-gray-300 mt-1">Explore available schemes and benefits</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search schemes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="glass-input pl-9 pr-4 py-2 rounded-lg text-sm w-full md:w-64"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 glass-input rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchemes.map((scheme) => (
                            <div key={scheme.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:bg-white/10 transition-all border border-white/10 flex flex-col group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-saffron-glass rounded-lg border border-saffron/20">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="w-8 h-8 opacity-90 invert brightness-0" />
                                    </div>
                                    <span className="px-2 py-1 bg-green-900/40 text-green-400 border border-green-500/30 text-xs font-medium rounded-full">
                                        Active
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-saffron transition-colors">{scheme.name}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                    {scheme.description}
                                </p>
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Ministry of Agriculture</span>
                                    <button className="text-saffron hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
                                        View Details <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchemesPage;
