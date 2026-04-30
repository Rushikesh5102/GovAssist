import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

// ... (existing imports)

interface TopbarProps {
    onOpenSettings: () => void;
}

const Topbar = ({ onOpenSettings }: TopbarProps) => {
    const { t } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.schemes'), path: '/schemes' },
        { name: t('nav.eligibility'), path: '/eligibility' },
        { name: t('nav.documents'), path: '/upload' },
        // { name: 'Chat', path: '/chat' }, // Removed Chat from main nav since it's a separate app-like experience now
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.contact'), path: '/contact' },
    ];

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-gray-900/95 dark:bg-[#050510]/80 backdrop-blur-xl border-b border-white/10 dark:border-glass-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src={logo}
                            alt="GovAssist Logo"
                            className="h-10 w-auto object-contain transition-transform hover:scale-105 drop-shadow-[0_0_8px_rgba(0,123,255,0.8)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-saffron via-white to-indiaGreen tracking-tight">
                            GovAssist
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-saffron bg-white/10 shadow-glass border border-white/20'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {!isAdmin && <LanguageSwitcher />}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? <Sun size={20} className="text-saffron" /> : <Moon size={20} className="text-gray-400" />}
                        </button>

                        {user ? (
                            /* Profile Dropdown */
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-white/10 hover:bg-white/10 transition-all bg-white/5"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-saffron to-indiaGreen flex items-center justify-center text-white font-medium text-sm ring-1 ring-white/20">
                                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        {(user.role === 'owner' || user.role === 'admin') && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-saffron bg-saffron/10 border border-saffron/20 rounded-full">
                                                {user.role}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-gray-900 dark:bg-[#1a1a2e] border border-white/10 shadow-xl rounded-2xl py-2 z-50 origin-top-right ring-1 ring-black ring-opacity-5"
                                        >
                                            <div className="px-4 py-3 border-b border-glass-border">
                                                <p className="text-sm font-medium text-white">{user.full_name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                {(user.role === 'owner' || user.role === 'admin') && (
                                                    <Link to={user.role === 'owner' ? '/owner' : '/admin'} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                                        <Settings size={16} /> Dashboard
                                                    </Link>
                                                )}
                                                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                                    <User size={16} /> {t('nav.profile')}
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        onOpenSettings();
                                                    }}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    <Settings size={16} /> {t('nav.settings')}
                                                </button>
                                            </div>
                                            <div className="border-t border-glass-border mt-1 pt-1">
                                                <button
                                                    onClick={logout}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                >
                                                    <LogOut size={16} /> {t('nav.sign_out')}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-saffron to-saffron-dim text-white hover:shadow-neon-saffron transition-all transform hover:-translate-y-0.5 border border-saffron-glow/30"
                                >
                                    {t('auth.signup.btn_signup')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {!isAdmin && <LanguageSwitcher />}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} className="text-saffron" /> : <Moon size={20} className="text-gray-400" />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-4 py-2 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-3 rounded-lg text-base font-medium ${location.pathname === link.path
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/signup"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-3 rounded-lg text-base font-medium text-primary hover:bg-primary/5"
                            >
                                {t('auth.signup.btn_signup')}
                            </Link>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2 pt-2">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onOpenSettings();
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <Settings size={18} /> {t('nav.settings')}
                                </button>
                                <button className="flex items-center gap-2 w-full px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                    <LogOut size={18} /> {t('nav.sign_out')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Topbar;
