import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
    onOpenSettings: () => void;
}

const Topbar = ({ onOpenSettings }: TopbarProps) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
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
        { name: 'Home', path: '/' },
        { name: 'Schemes', path: '/schemes' },
        { name: 'Eligibility', path: '/eligibility' },
        { name: 'Documents', path: '/upload' },
        // { name: 'Chat', path: '/chat' }, // Removed Chat from main nav since it's a separate app-like experience now
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-[#050510]/60 backdrop-blur-xl border-b border-glass-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron via-white to-indiaGreen flex items-center justify-center text-navy font-bold text-lg shadow-lg group-hover:shadow-saffron-glow/40 transition-shadow ring-1 ring-white/20">
                            G
                        </div>
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
                                        ? 'text-saffron bg-glass-whiteHover shadow-glass border border-glass-border/30'
                                        : 'text-gray-300 hover:text-white hover:bg-glass-white border border-transparent hover:border-glass-border/20'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* New Chat Button (Highlighted) */}
                        <Link
                            to="/chat"
                            target="_blank"
                            className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-saffron to-saffron-dim text-white hover:shadow-neon-saffron transition-all transform hover:-translate-y-0.5 border border-saffron-glow/30"
                        >
                            Try AI Assistant
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-glass-white transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? <Sun size={20} className="text-saffron" /> : <Moon size={20} className="text-gray-400" />}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-glass-border hover:bg-glass-white transition-all bg-glass-white/5"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-saffron to-indiaGreen flex items-center justify-center text-white font-medium text-sm ring-1 ring-white/20">
                                    R
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 glass-panel py-2 z-50 origin-top-right ring-1 ring-black ring-opacity-5"
                                    >
                                        <div className="px-4 py-3 border-b border-glass-border">
                                            <p className="text-sm font-medium text-white">Rushi</p>
                                            <p className="text-xs text-gray-400 truncate">rushi@example.com</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-glass-whiteHover hover:text-white transition-colors">
                                                <User size={16} /> Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    onOpenSettings();
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-glass-whiteHover hover:text-white transition-colors"
                                            >
                                                <Settings size={16} /> Settings
                                            </button>
                                        </div>
                                        <div className="border-t border-glass-border mt-1 pt-1">
                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                                                <LogOut size={16} /> Sign out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-glass-white transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} className="text-saffron" /> : <Moon size={20} className="text-gray-400" />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-glass-white transition-colors"
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
                                to="/chat"
                                target="_blank"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-3 rounded-lg text-base font-medium text-primary hover:bg-primary/5"
                            >
                                Try AI Assistant
                            </Link>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2 pt-2">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onOpenSettings();
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <Settings size={18} /> Settings
                                </button>
                                <button className="flex items-center gap-2 w-full px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                    <LogOut size={18} /> Sign out
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
