import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

const EligibilityPage = () => {
    const [formData, setFormData] = useState({
        age: '',
        income: '',
        caste: 'General',
        gender: 'Male',
        occupation: 'Student',
        state: 'Maharashtra'
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/eligibility/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    age: parseInt(formData.age),
                    income: parseInt(formData.income),
                    caste: formData.caste,
                    gender: formData.gender,
                    occupation: formData.occupation,
                    state: formData.state
                })
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results);
            }
        } catch (error) {
            console.error("Error checking eligibility", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 h-full">
            <div className="max-w-4xl mx-auto glass-panel p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Check Eligibility</h1>
                    <p className="text-gray-300 mt-1">Find out which government schemes apply to you</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">Your Profile</h3>
                            <form onSubmit={handleCheck} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 glass-input rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Annual Income (₹)</label>
                                    <input
                                        type="number"
                                        name="income"
                                        value={formData.income}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 glass-input rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Occupation</label>
                                    <select
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 glass-input rounded-lg text-sm [&>option]:bg-gray-900"
                                    >
                                        <option>Student</option>
                                        <option>Farmer</option>
                                        <option>Business</option>
                                        <option>Unemployed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Caste Category</label>
                                    <select
                                        name="caste"
                                        value={formData.caste}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 glass-input rounded-lg text-sm [&>option]:bg-gray-900"
                                    >
                                        <option>General</option>
                                        <option>OBC</option>
                                        <option>SC</option>
                                        <option>ST</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 glass-input rounded-lg text-sm [&>option]:bg-gray-900"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 glass-button-primary rounded-lg font-medium hover:scale-105 transform transition-all disabled:opacity-50 disabled:transform-none"
                                >
                                    {loading ? 'Checking...' : 'Check Eligibility'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        {!results && !loading && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-white">No Results Yet</h3>
                                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                                    Fill out the form to see which government schemes you are eligible for.
                                </p>
                            </div>
                        )}

                        {results && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    Results Found <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded-full text-xs">{results.length}</span>
                                </h3>
                                {results.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-xl p-5 shadow-lg border border-white/10 flex items-start gap-4 backdrop-blur-sm">
                                        <div className={item.eligible ? "text-green-400" : "text-red-400"}>
                                            {item.eligible ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base font-semibold text-white">{item.scheme}</h4>
                                                {item.eligible && <span className="text-xs font-medium text-green-300 bg-green-900/30 px-2 py-1 rounded-full border border-green-500/30">Eligible</span>}
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {item.eligible
                                                    ? "You meet all the criteria for this scheme."
                                                    : `Missing criteria: ${item.missing_criteria?.join(', ') || 'N/A'}`
                                                }
                                            </p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-saffron transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EligibilityPage;
