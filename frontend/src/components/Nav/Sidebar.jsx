import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Search, Layout, Settings, LogOut, User, Box } from 'lucide-react';


const Sidebar = ({ className = "" }) => {
    const navigate = useNavigate();


    const menuItems = [
        { icon: MessageSquare, label: 'Chats', path: '/chat' },
        { icon: Box, label: 'Schemes', path: '/schemes' },
        { icon: Layout, label: 'Dashboard', path: '/admin' }, // Assuming admin is dashboard-like
        { icon: Search, label: 'Search', path: '/search' }, // Placeholder
    ];

    const handleNewChat = () => {
        // Navigate to chat without session_id to start new
        navigate('/chat');
        // Optionally trigger a reload or state clear if needed, but router change should be enough if implemented right
        window.location.href = '/chat';
    };

    return (
        <aside className={`flex flex-col w-64 h-screen bg-[#050510]/60 backdrop-blur-xl border-r border-glass-border ${className}`}>
            {/* Header / New Chat */}
            <div className="p-4">
                <button
                    onClick={handleNewChat}
                    className="glass-button-primary flex items-center gap-2 w-full px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-saffron-glow/20 text-white font-bold"
                >
                    <Plus size={18} />
                    <span>New chat</span>
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-glass-border">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Menu
                </div>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 text-sm border border-transparent ${isActive
                                ? 'bg-glass-whiteHover text-white border-glass-border shadow-glass'
                                : 'text-gray-400 hover:bg-glass-white hover:text-white hover:border-glass-border/30'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <div className="mt-6 px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recents
                </div>
                {/* Placeholder for recent chats */}
                <div className="space-y-1">
                    {['PM Kisan Scheme Info', 'Eligibility Check', 'Document Upload Help'].map((chat, i) => (
                        <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-glass-white hover:text-white rounded-lg truncate transition-all border border-transparent hover:border-glass-border/30">
                            {chat}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Profile / Bottom Actions */}
            <div className="p-4 border-t border-glass-border bg-glass-white/5">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-glass-white cursor-pointer transition-colors border border-transparent hover:border-glass-border/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-saffron to-indiaGreen flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                        R
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Rushi</p>
                        <p className="text-xs text-gray-400 truncate">Free Plan</p>
                    </div>
                    <Settings size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
