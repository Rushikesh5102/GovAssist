import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Search, Layout, Settings, LogOut, User, Box } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';


const Sidebar = ({ className = "" }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const menuItems = [
        { icon: MessageSquare, label: t('sidebar.nav.chats'), path: '/chat' },
        { icon: Box, label: t('sidebar.nav.schemes'), path: '/schemes' },
        { icon: Layout, label: t('sidebar.nav.dashboard'), path: '/admin' },
        { icon: Search, label: t('sidebar.nav.search'), path: '/search' },
    ];

    const handleNewChat = () => {
        navigate('/chat');
        window.location.href = '/chat';
    };

    return (
        <aside
            className={`flex flex-col h-screen bg-white/80 dark:bg-[#050510]/60 backdrop-blur-xl border-r border-gray-200 dark:border-glass-border transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                } ${className}`}
        >
            {/* Header / New Chat */}
            <div className={`p-4 flex flex-col gap-4 ${isCollapsed ? "items-center" : ""}`}>
                {/* Toggle Button (internal for now, could be moved to header if preferred) */}
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    {!isCollapsed && <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">GovAssist</span>}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-glass-white transition-colors"
                    >
                        {isCollapsed ? <Layout size={20} /> : <div className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1">◀</div>}
                        {/* Using simple icons/text for toggle for now */}
                    </button>
                </div>

                <button
                    onClick={handleNewChat}
                    className={`glass-button-primary flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-all shadow-lg hover:shadow-saffron-glow/20 text-white font-bold ${isCollapsed ? "w-10 h-10 p-0" : "w-full"}`}
                    title={t('sidebar.new_chat')}
                >
                    <Plus size={isCollapsed ? 20 : 18} />
                    {!isCollapsed && <span>{t('sidebar.new_chat')}</span>}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-glass-border">
                {!isCollapsed && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('sidebar.menu')}
                    </div>
                )}
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 text-sm border border-transparent ${isActive
                                ? 'bg-gray-100 dark:bg-glass-whiteHover text-gray-900 dark:text-white border-gray-200 dark:border-glass-border shadow-sm dark:shadow-glass'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-glass-white hover:text-gray-900 dark:hover:text-white hover:border-gray-200/50 dark:hover:border-glass-border/30'
                            } ${isCollapsed ? "justify-center px-0" : ""}`
                        }
                        title={isCollapsed ? item.label : ""}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}

                {!isCollapsed && (
                    <>
                        <div className="mt-6 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('sidebar.recents')}
                        </div>
                        <div className="space-y-1">
                            {['PM Kisan Scheme Info', 'Eligibility Check', 'Document Upload Help'].map((chat, i) => (
                                <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-glass-white hover:text-gray-900 dark:hover:text-white rounded-lg truncate transition-all border border-transparent hover:border-gray-200/50 dark:hover:border-glass-border/30">
                                    {chat}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* User Profile / Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-glass-border bg-gray-50/50 dark:bg-glass-white/5">
                {user ? (
                    <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-glass-white cursor-pointer transition-colors border border-transparent hover:border-gray-200/50 dark:hover:border-glass-border/30 ${isCollapsed ? "justify-center" : ""}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-saffron to-indiaGreen flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 shrink-0">
                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.full_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                </div>
                                <Settings size={16} className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            </>
                        )}
                    </div>
                ) : (
                    <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-glass-white cursor-pointer transition-colors border border-transparent hover:border-gray-200/50 dark:hover:border-glass-border/30 ${isCollapsed ? "justify-center" : ""}`}>
                        {!isCollapsed ? (
                            <button onClick={() => navigate('/login')} className="w-full text-sm text-center text-primary font-bold">Sign In</button>
                        ) : (
                            <button onClick={() => navigate('/login')}><User size={20} /></button>
                        )}
                    </div>
                )}
            </div>
        </aside >
    );
};

export default Sidebar;
