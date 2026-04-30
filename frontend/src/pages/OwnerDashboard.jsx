import React, { useState, useEffect } from 'react';
import { Activity, Users, Globe, Database, Server, AlertTriangle, Cpu, MapPin, ShieldAlert, Clock, ArrowUpRight, ArrowDownRight, Terminal, Lock, RefreshCw, Power, Code, Shield, GitCommit, HardDrive, Wifi, ShieldCheck, Zap, Trash2, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Fake global state for actions to show interaction
    const [isLockedDown, setIsLockedDown] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [metrics, setMetrics] = useState({
        activeUsers: 452,
        pageViews: 12450,
        serverUptime: "99.98%",
        responseTime: "120ms",
        errorRate: "0.02%",
        dbConnections: 145,
    });
    
    const [featureFlags, setFeatureFlags] = useState({
        ENABLE_SCRAPER: false,
        ENABLE_SUPABASE: true,
        ENABLE_LLM: true
    });

    useEffect(() => {
        checkOwner();
        fetchConfig();
        fetchMetrics();
        
        // Refresh metrics every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/metrics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMetrics(data);
            }
        } catch (e) {
            console.error("Failed to load metrics", e);
        }
    };

    const fetchConfig = async () => {
        try {
            const [configRes, metricsRes] = await Promise.all([
                fetch('/api/admin/config'),
                fetch('/api/admin/metrics')
            ]);
            
            if (configRes.ok) {
                const data = await configRes.json();
                setFeatureFlags(data);
            }
            if (metricsRes.ok) {
                const mData = await metricsRes.json();
                setMetrics(mData);
            }
        } catch (e) {
            console.error("Failed to load admin data", e);
        }
    };

    const toggleFeature = async (featureName) => {
        const newValue = !featureFlags[featureName];
        setFeatureFlags(prev => ({ ...prev, [featureName]: newValue }));
        try {
            await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [featureName]: newValue })
            });
            alert(`${featureName} is now ${newValue ? 'ENABLED' : 'DISABLED'}`);
        } catch (e) {
            console.error("Failed to update config", e);
            alert("Failed to update configuration.");
            setFeatureFlags(prev => ({ ...prev, [featureName]: !newValue })); // revert
        }
    };

    const checkOwner = async () => {
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
                if (user.role !== 'owner' && user.role !== 'admin') {
                    navigate('/');
                } else {
                    setLoading(false);
                }
            } else {
                navigate('/login');
            }
        } catch (e) {
            navigate('/login');
        }
    };

    const handleAction = (actionName) => {
        switch(actionName) {
            case 'lockdown':
                setIsLockedDown(!isLockedDown);
                alert(isLockedDown ? "Emergency Lockdown Lifted. Services restored." : "EMERGENCY LOCKDOWN INITIATED. All non-admin traffic blocked.");
                break;
            case 'refresh':
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 1000);
                break;
            case 'clearCache':
                alert("Redis Cache cleared successfully. Memory freed: 1.2GB");
                break;
            case 'restart':
                alert("Rolling restart initiated for API Gateways and Background Workers.");
                break;
            case 'scan':
                alert("Deep Security Scan triggered. This may take a few minutes...");
                break;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050510]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header & Quick Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0f1020] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
                    {isLockedDown && (
                        <div className="absolute inset-0 bg-red-900/20 border-2 border-red-500 rounded-2xl pointer-events-none animate-pulse"></div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Terminal className="text-saffron" />
                            DevOps Command Center
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isLockedDown ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
                            {isLockedDown ? 'SYSTEM IN LOCKDOWN MODE' : 'All systems operational'}
                        </p>
                    </div>
                    
                    {/* Safety Responses & Triggers */}
                    <div className="flex flex-wrap gap-3 z-10">
                        <button onClick={() => handleAction('refresh')} className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white font-medium rounded-xl text-sm transition-colors flex items-center gap-2">
                            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> Refresh
                        </button>
                        <button onClick={() => handleAction('clearCache')} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl text-sm transition-colors flex items-center gap-2">
                            <Trash2 size={16} /> Clear Cache
                        </button>
                        <button onClick={() => handleAction('restart')} className="px-4 py-2 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 font-medium rounded-xl text-sm transition-colors flex items-center gap-2">
                            <Power size={16} /> Restart API
                        </button>
                        <button onClick={() => handleAction('lockdown')} className={`px-4 py-2 font-medium rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg ${isLockedDown ? 'bg-gray-800 text-white hover:bg-gray-900 border border-gray-700' : 'bg-red-500 hover:bg-red-600 text-white border border-red-600 shadow-red-500/20'}`}>
                            <Lock size={16} /> {isLockedDown ? 'Lift Lockdown' : 'Emergency Lockdown'}
                        </button>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-2 bg-white dark:bg-[#0f1020] p-2 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Activity size={18} />} label="Overview" />
                    <TabButton active={activeTab === 'infrastructure'} onClick={() => setActiveTab('infrastructure')} icon={<Server size={18} />} label="Infrastructure" />
                    <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18} />} label="Security & Audits" />
                    <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')} icon={<Code size={18} />} label="Code & APM" />
                    <TabButton active={activeTab === 'features'} onClick={() => setActiveTab('features')} icon={<Zap size={18} />} label="Feature Flags" />
                </div>

                {/* Dynamic Content Based on Tab */}
                
                {/* --- TAB: OVERVIEW --- */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <MiniMetricCard icon={<Users />} title="Active Users" value={metrics.activeUsers} trend="+12%" color="blue" />
                            <MiniMetricCard icon={<Globe />} title="Page Views" value={(metrics.pageViews / 1000).toFixed(1) + 'k'} trend="+5.4%" color="green" />
                            <MiniMetricCard icon={<Server />} title="Uptime" value={metrics.serverUptime} color="purple" />
                            <MiniMetricCard icon={<Activity />} title="Avg Latency" value={metrics.responseTime} trend="-15ms" trendDown color="orange" />
                            <MiniMetricCard icon={<Database />} title="DB Conns" value={metrics.dbConnections} color="indigo" />
                            <MiniMetricCard icon={<AlertTriangle />} title="Error Rate" value={metrics.errorRate} trend="-0.01%" trendDown color="red" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Globe size={20} className="text-blue-400" /> Hourly Traffic Volume
                                </h2>
                                <div className="h-64 flex items-end gap-2 px-2">
                                    {/* CSS Bar Chart */}
                                    {[40, 60, 45, 80, 50, 90, 70, 60, 85, 100, 75, 50, 40, 30, 20, 35, 65, 85, 95, 80, 70, 60, 50, 40].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500 hover:from-saffron/20 hover:to-saffron rounded-t-sm transition-all duration-300 group relative" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {h * 12} reqs
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                                    <span>00:00</span><span>12:00</span><span>24:00</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <MapPin size={18} className="text-indigo-400" /> Traffic by Region
                                </h2>
                                <div className="space-y-4">
                                    <RegionRow name="Maharashtra" value="45%" color="bg-indigo-500" />
                                    <RegionRow name="Delhi" value="22%" color="bg-blue-500" />
                                    <RegionRow name="Karnataka" value="15%" color="bg-purple-500" />
                                    <RegionRow name="Gujarat" value="10%" color="bg-pink-500" />
                                    <RegionRow name="Others" value="8%" color="bg-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: INFRASTRUCTURE --- */}
                {activeTab === 'infrastructure' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Server Resources */}
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Cpu size={20} className="text-purple-400" /> Hardware Telemetry
                                </h2>
                                <div className="space-y-6">
                                    <ResourceBar label="CPU Usage (AWS c5.2xlarge - 8 Cores)" value="42%" percent={42} color="bg-purple-500" />
                                    <ResourceBar label="RAM (16 GB Total)" value="11.2 GB" percent={70} color="bg-blue-500" />
                                    <ResourceBar label="Swap Space" value="2.1 GB" percent={15} color="bg-orange-500" />
                                    <ResourceBar label="NVMe Storage (/dev/xvda1)" value="240 GB / 1 TB" percent={24} color="bg-green-500" />
                                </div>
                            </div>

                            {/* Network I/O */}
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Wifi size={20} className="text-blue-400" /> Network I/O
                                </h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent dark:border-white/5">
                                        <div className="text-sm text-gray-500 mb-1">Inbound (Rx)</div>
                                        <div className="text-2xl font-mono text-green-500">452 Mbps</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent dark:border-white/5">
                                        <div className="text-sm text-gray-500 mb-1">Outbound (Tx)</div>
                                        <div className="text-2xl font-mono text-blue-500">890 Mbps</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm text-gray-400"><span>Active TCP Connections:</span> <span className="text-white font-mono">1,402</span></div>
                                    <div className="flex justify-between text-sm text-gray-400"><span>Dropped Packets:</span> <span className="text-green-500 font-mono">0.001%</span></div>
                                    <div className="flex justify-between text-sm text-gray-400"><span>Bandwidth Saturation:</span> <span className="text-saffron font-mono">65%</span></div>
                                </div>
                            </div>

                            {/* Microservices Nodes */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                    <Server size={20} className="text-green-400" /> Docker Swarm / Microservices
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <HealthBar label="Gateway (Nginx / API Route)" status="Optimal" percent={95} color="bg-green-500" />
                                    <HealthBar label="Auth Service (JWT)" status="Healthy" percent={88} color="bg-green-400" />
                                    <HealthBar label="Document AI Parser" status="Warning" percent={65} color="bg-saffron" />
                                    <HealthBar label="PostgreSQL Master DB" status="Optimal" percent={92} color="bg-green-500" />
                                    <HealthBar label="Redis Cache Cluster" status="Optimal" percent={98} color="bg-green-500" />
                                    <HealthBar label="Celery Background Workers" status="Healthy" percent={80} color="bg-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: SECURITY --- */}
                {activeTab === 'security' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><ShieldCheck size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-white">SSL Certificate</h3>
                                        <p className="text-sm text-gray-400">Valid & Active</p>
                                    </div>
                                </div>
                                <div className="text-sm space-y-2 text-gray-400">
                                    <div className="flex justify-between"><span>Issuer:</span> <span className="text-white">Let's Encrypt</span></div>
                                    <div className="flex justify-between"><span>Expires in:</span> <span className="text-white">64 Days</span></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Lock size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-white">WAF Status</h3>
                                        <p className="text-sm text-gray-400">Strict Mode</p>
                                    </div>
                                </div>
                                <div className="text-sm space-y-2 text-gray-400">
                                    <div className="flex justify-between"><span>Rules Active:</span> <span className="text-white">142</span></div>
                                    <div className="flex justify-between"><span>Blocked Today:</span> <span className="text-white">1,204 reqs</span></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 flex flex-col justify-center">
                                <button onClick={() => handleAction('scan')} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Bug size={18} /> Run Vulnerability Scan
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-3">Scans NPM dependencies & CVE databases</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ShieldAlert size={20} className="text-red-400" /> Active Security Threat Logs
                                </h2>
                                <span className="text-xs text-saffron hover:underline cursor-pointer">Export CSV</span>
                            </div>
                            <div className="space-y-3">
                                <AlertItem time="10 mins ago" msg="DDoS Attack Mitigated: 50k req/sec blocked from IP Range 185.xxx.xxx.xxx" type="danger" />
                                <AlertItem time="1 hour ago" msg="SQL Injection Attempt Blocked on /api/auth/login" type="danger" />
                                <AlertItem time="2 hours ago" msg="Suspicious Admin privilege escalation attempt by user ID #402" type="warning" />
                                <AlertItem time="5 hours ago" msg="Automated AWS Security Group Audit Completed. 0 Open Ports detected." type="success" />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: CODE & APM --- */}
                {activeTab === 'code' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Deployment Info */}
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <GitCommit size={20} className="text-gray-400" /> Build & Deployment
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                        <span className="text-gray-500">Environment</span>
                                        <span className="text-green-500 font-bold px-2 py-1 bg-green-500/10 rounded">PRODUCTION</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                        <span className="text-gray-500">Active Branch</span>
                                        <span className="text-white font-mono flex items-center gap-2"><GitCommit size={14}/> main</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                        <span className="text-gray-500">Latest Commit</span>
                                        <span className="text-blue-400 font-mono text-sm hover:underline cursor-pointer">a7f92b4 • "fix auth bypass"</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                        <span className="text-gray-500">Frontend Bundle Size</span>
                                        <span className="text-white font-mono">1.2 MB (Gzipped)</span>
                                    </div>
                                </div>
                            </div>

                            {/* APM Slow Endpoints */}
                            <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Zap size={20} className="text-orange-400" /> Slowest API Endpoints
                                </h2>
                                <div className="space-y-3">
                                    <EndpointRow method="POST" path="/api/ai/analyze-document" time="1,240ms" status="critical" />
                                    <EndpointRow method="GET" path="/api/schemes/search?q=agri" time="850ms" status="warning" />
                                    <EndpointRow method="POST" path="/api/admin/generate-report" time="720ms" status="warning" />
                                    <EndpointRow method="POST" path="/api/auth/verify-otp" time="420ms" status="normal" />
                                    <EndpointRow method="GET" path="/api/admin/updates" time="310ms" status="normal" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Exceptions Log */}
                        <div className="bg-[#0a0a14] rounded-2xl shadow-sm border border-gray-800 p-6 overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-mono text-gray-300 flex items-center gap-2">
                                    <Code size={18} /> backend_error.log
                                </h2>
                            </div>
                            <pre className="text-xs font-mono text-red-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`[2026-04-28 17:36:48] ERROR in app: Exception on /api/ai/analyze-document [POST]
Traceback (most recent call last):
  File "fastapi/routing.py", line 273, in app
    response = await run_endpoint_function(dependant=dependant, values=values, is_coroutine=is_coroutine)
  File "app/services/ocr_service.py", line 45, in extract_text
    raise ConnectionTimeout("OCR Engine failed to respond within 1000ms")
ConnectionTimeout: OCR Engine failed to respond within 1000ms`}
                            </pre>
                        </div>
                    </div>
                )}

                {/* --- TAB: FEATURES --- */}
                {activeTab === 'features' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white dark:bg-[#0f1020] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                <Zap size={20} className="text-saffron" /> Live Service Integrations
                            </h2>
                            <div className="space-y-4">
                                <FeatureToggle 
                                    title="Automated Data Scraper" 
                                    description="Run the Python APScheduler CRON job every 24 hours to pull real schemes from india.gov.in."
                                    enabled={featureFlags.ENABLE_SCRAPER} 
                                    onToggle={() => toggleFeature('ENABLE_SCRAPER')} 
                                    icon={<Database />}
                                />
                                <FeatureToggle 
                                    title="Supabase Cloud Storage" 
                                    description="Automatically backup uploaded user documents to the govassist-documents bucket."
                                    enabled={featureFlags.ENABLE_SUPABASE} 
                                    onToggle={() => toggleFeature('ENABLE_SUPABASE')} 
                                    icon={<Server />}
                                />
                                <FeatureToggle 
                                    title="Gemini LLM Engine" 
                                    description="Enable live AI responses for RAG chat. If disabled, system will use local static fallbacks."
                                    enabled={featureFlags.ENABLE_LLM} 
                                    onToggle={() => toggleFeature('ENABLE_LLM')} 
                                    icon={<Cpu />}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Subcomponents ---

const TabButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
            active 
            ? 'bg-saffron text-white shadow-lg shadow-saffron/20' 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
        }`}
    >
        {icon} {label}
    </button>
);

const MiniMetricCard = ({ icon, title, value, trend, trendDown, color }) => {
    const colorStyles = {
        blue: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
        green: 'text-green-500 bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20',
        purple: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20',
        orange: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20',
        indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
        red: 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20',
    };

    return (
        <div className={`p-4 rounded-xl shadow-sm border bg-white dark:bg-[#0f1020] dark:border-white/5`}>
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colorStyles[color].replace('border-', 'ring-1 ring-')}`}>
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                {trend && (
                    <span className={`text-xs font-bold flex items-center ${trendDown ? 'text-green-500' : 'text-red-500'}`}>
                        {trendDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
    );
};

const ResourceBar = ({ label, value, percent, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
            <span className="text-gray-900 dark:text-white font-bold">{value}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const EndpointRow = ({ method, path, time, status }) => {
    const statusColors = {
        critical: 'text-red-500',
        warning: 'text-saffron',
        normal: 'text-green-500'
    };
    const methodColors = {
        GET: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        POST: 'text-green-500 bg-green-500/10 border-green-500/20',
        PUT: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    };

    return (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-transparent dark:hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${methodColors[method]}`}>{method}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono">{path}</span>
            </div>
            <span className={`text-sm font-bold font-mono whitespace-nowrap ${statusColors[status]}`}>{time}</span>
        </div>
    );
};

const HealthBar = ({ label, status, percent, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
            <span className={`font-medium ${status === 'Healthy' || status === 'Optimal' ? 'text-green-500' : 'text-saffron'}`}>{status}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
            <div className={`${color} h-full rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const RegionRow = ({ name, value, color }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-2 flex-1">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
        </div>
        <div className="w-24 bg-gray-100 dark:bg-white/5 rounded-full h-1.5 mx-3 hidden sm:block">
            <div className={`${color} h-full rounded-full`} style={{ width: value }}></div>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white w-10 text-right">{value}</span>
    </div>
);

const AlertItem = ({ time, msg, type }) => {
    const typeStyles = {
        warning: 'border-saffron text-saffron bg-saffron/10',
        danger: 'border-red-500 text-red-500 bg-red-500/10',
        info: 'border-blue-500 text-blue-400 bg-blue-500/10',
        success: 'border-green-500 text-green-500 bg-green-500/10',
    };
    return (
        <div className={`p-3 rounded-lg border-l-4 text-sm ${typeStyles[type]}`}>
            <span className="font-semibold block mb-0.5 opacity-80 text-xs uppercase tracking-wider">{time}</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{msg}</span>
        </div>
    );
};

const FeatureToggle = ({ title, description, enabled, onToggle, icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
        <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${enabled ? 'bg-saffron/10 text-saffron' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">{description}</p>
            </div>
        </div>
        <button 
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-saffron' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export default OwnerDashboard;
