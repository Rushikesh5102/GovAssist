import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Upload, CheckCircle, FileText, Settings, User, LogOut, LogIn, History } from 'lucide-react';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode token to get user info (mock for now or fetch profile)
            // For now, just assume logged in. Ideally fetch /api/auth/me
            setUser({ name: 'User', email: 'user@example.com' }); // Placeholder
            fetchHistory();
        }
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setHistory([]);
        navigate('/login');
    };

    const navItems = [
        { name: 'Chat', href: '/', icon: MessageSquare },
        { name: 'Schemes', href: '/schemes', icon: FileText },
        { name: 'Eligibility', href: '/eligibility', icon: CheckCircle },
        { name: 'Upload', href: '/upload', icon: Upload },
        { name: 'Admin', href: '/admin', icon: Settings },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold flex items-center gap-1">
                        <span className="text-[#FF9933]">Gov</span>
                        <span className="text-white bg-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">A</span>
                        <span className="text-[#138808]">ssist</span>
                    </h1>
                </div>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-600 dark:text-gray-300">
                    {isMobileMenuOpen ? <LogOut size={24} className="rotate-180" /> : <div className="space-y-1.5">
                        <span className="block w-6 h-0.5 bg-current"></span>
                        <span className="block w-6 h-0.5 bg-current"></span>
                        <span className="block w-6 h-0.5 bg-current"></span>
                    </div>}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
                isMobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 hidden md:block">
                    <h1 className="text-2xl font-bold flex items-center gap-1 drop-shadow-sm">
                        <span className="text-[#FF9933]">Gov</span>
                        <span className="text-[#138808]">Assist</span>
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Governance Assistant</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-india-saffron dark:bg-gray-700 dark:text-orange-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                )}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Chat History Section */}
                    {user && history.length > 0 && (
                        <div className="mt-6">
                            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Recent Chats
                            </h3>
                            <div className="space-y-1">
                                {history.map((session) => (
                                    <Link
                                        key={session.id}
                                        to={`/?session_id=${session.id}`}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg truncate"
                                    >
                                        <History size={16} className="flex-shrink-0" />
                                        <span className="truncate">{session.title || 'New Chat'}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                <User size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-0.5">
                                    <LogOut size={12} /> Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <LogIn size={16} />
                            </div>
                            <span className="text-sm font-medium">Sign In</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
                {children}
            </main>
        </div>
    );
};

export default Layout;
