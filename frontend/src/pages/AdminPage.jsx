import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Settings, Check, X, RefreshCw, Globe, Server, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ users: 0, chats: 0, schemes: 0 });
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdmin();
        fetchStats();
        fetchUpdates();
    }, []);

    const checkAdmin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                if (!user.is_admin) {
                    navigate('/');
                }
            } else {
                navigate('/login');
            }
        } catch (e) {
            navigate('/login');
        }
    };

    const fetchStats = async () => {
        // Mock stats for now
        setStats({ users: 1250, chats: 5430, schemes: 85 });
    };

    const fetchUpdates = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/updates?status=pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUpdates(data);
            }
        } catch (e) {
            console.error("Failed to fetch updates", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCrawl = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/crawl', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Crawl triggered successfully!");
                fetchUpdates();
            }
        } catch (e) {
            alert("Failed to trigger crawl");
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/updates/${id}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUpdates(prev => prev.filter(u => u.id !== id));
            }
        } catch (e) {
            alert(`Failed to ${action} update`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Shield className="text-primary" />
                        Admin Dashboard
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCrawl}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <RefreshCw size={18} />
                            Trigger Crawler
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                                <h3 className="text-2xl font-bold">{stats.users}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Chats</p>
                                <h3 className="text-2xl font-bold">{stats.chats}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                                <Settings size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Schemes</p>
                                <h3 className="text-2xl font-bold">{stats.schemes}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Updates Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold">Pending Scheme Updates</h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading updates...</div>
                        ) : updates.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No pending updates found.</div>
                        ) : (
                            updates.map((update) => (
                                <div key={update.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{update.title}</h3>
                                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                                    {update.source}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 mb-2">{update.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{update.ministry}</span>
                                                {update.url && (
                                                    <a href={update.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                                                        <Globe size={14} /> Official Link
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(update.id, 'approve')}
                                                className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(update.id, 'reject')}
                                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                                title="Reject"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Additional Monitoring Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* System Health */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <Server size={20} /> System Health Nodes
                        </h2>
                        <div className="space-y-4">
                            <HealthBar label="Web Server (Nginx)" status="Healthy" percent={95} color="bg-green-500" />
                            <HealthBar label="API Gateway (FastAPI)" status="Healthy" percent={90} color="bg-green-500" />
                            <HealthBar label="Primary Database (PostgreSQL)" status="Warning" percent={75} color="bg-saffron" />
                            <HealthBar label="Cache Layer (Redis)" status="Healthy" percent={98} color="bg-green-500" />
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle size={20} /> Recent Anomalies
                        </h2>
                        <div className="space-y-3">
                            <AlertItem time="10 mins ago" msg="Spike in DB connection pooling" type="warning" />
                            <AlertItem time="1 hour ago" msg="Failed login attempts from IP 192.168.1.5" type="danger" />
                            <AlertItem time="3 hours ago" msg="Routine backup completed successfully" type="success" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HealthBar = ({ label, status, percent, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
            <span className={status === 'Healthy' ? 'text-green-500' : 'text-saffron'}>{status}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const AlertItem = ({ time, msg, type }) => {
    const typeStyles = {
        warning: 'border-saffron text-saffron bg-saffron/10',
        danger: 'border-red-500 text-red-500 bg-red-500/10',
        success: 'border-green-500 text-green-500 bg-green-500/10',
    };
    return (
        <div className={`p-3 rounded-lg border-l-4 text-sm ${typeStyles[type]}`}>
            <span className="font-semibold block mb-0.5">{time}</span>
            <span className="text-gray-800 dark:text-gray-200">{msg}</span>
        </div>
    );
};

export default AdminPage;
