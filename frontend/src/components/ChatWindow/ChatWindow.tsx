import React, { useState, useRef, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { useSearchParams } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Bot, Globe, Clock, Share2, X, Copy } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ChatWindow = () => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: t('chat.initial_message'),
            timestamp: new Date().toISOString(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [language, setLanguage] = useState('en');
    const [isTemporary, setIsTemporary] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const messagesEndRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (sessionId) {
            loadSession(sessionId);
        }
    }, [sessionId]);

    const loadSession = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/history/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const formattedMessages = data.map(msg => ({
                    id: msg.id || Date.now() + Math.random(),
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    sources: msg.sources ? JSON.parse(msg.sources) : []
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error("Failed to load session", error);
        }
    };

    const handleSend = async (text) => {
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setLoadingText("");

        // Show "Searching..." after 3 seconds
        const loadingTimer = setTimeout(() => {
            setLoadingText(t('chat.loading_analyzing') || "Analyzing documents...");
        }, 3000);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message: text,
                    session_id: isTemporary ? null : (sessionId ? parseInt(sessionId) : null),
                    language: i18n.language
                })
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            const botMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.answer,
                timestamp: new Date().toISOString(),
                sources: data.sources || []
            };
            setMessages(prev => [...prev, botMessage]);

            if (!isTemporary && !sessionId && data.session_id) {
                setSearchParams({ session_id: data.session_id });
            }
            clearTimeout(loadingTimer);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: `Error: ${error.message}. Please check console for details.`,
                timestamp: new Date().toISOString(),
            }]);
        } finally {
            setIsLoading(false);
            setLoadingText(""); // Clear loading text
        }
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            const uploadMessage = {
                id: Date.now() + Math.random(),
                role: 'user',
                content: `Uploaded file: ${file.name}`,
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, uploadMessage]);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    const successMessage = {
                        id: Date.now() + Math.random(),
                        role: 'assistant',
                        content: `${t('chat.upload_success')} **${file.name}**. \n\n**Extracted Text Summary:**\n${data.extracted_text.substring(0, 200)}...`,
                        timestamp: new Date().toISOString(),
                    };
                    setMessages(prev => [...prev, successMessage]);
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                const errorMessage = {
                    id: Date.now() + Math.random(),
                    role: 'assistant',
                    content: `${t('chat.upload_fail')} **${file.name}**.`,
                    timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        }
    };

    const handleRegenerate = () => {
        // Find last user message
        const lastUserMsgIndex = messages.findLastIndex(m => m.role === 'user');
        if (lastUserMsgIndex !== -1) {
            const lastUserMsg = messages[lastUserMsgIndex];
            // Remove messages after this
            setMessages(prev => prev.slice(0, lastUserMsgIndex + 1)); // Keep user message
            // Trigger send again (but we need to avoid adding user message again)
            // Actually, handleSend adds user message. We should extract logic.
            // For simplicity, just remove last bot message and call API with last user message content, 
            // but we need to ensure we don't duplicate the user message in UI.
            // Better: Remove last bot message, set loading, call API.

            setIsLoading(true);
            // ... API call logic similar to handleSend but without adding user message ...
            // Re-using handleSend logic requires refactoring. 
            // For now, let's just re-send the text which will add a new user message. 
            // Wait, that's not "regenerate". Regenerate should replace the answer.

            // Refactored approach:
            const text = lastUserMsg.content;
            // Remove last assistant message if exists
            if (messages[messages.length - 1].role === 'assistant') {
                setMessages(prev => prev.slice(0, -1));
            }

            // Call API
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            fetch('/api/chat/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message: text,
                    session_id: isTemporary ? null : (sessionId ? parseInt(sessionId) : null)
                })
            }).then(res => res.json()).then(data => {
                const botMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: data.answer,
                    timestamp: new Date().toISOString(),
                    sources: data.sources || []
                };
                setMessages(prev => [...prev, botMessage]);
            }).catch(err => setIsLoading(false));

        }
    };

    const handleFeedback = async (messageId, type) => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/chat/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message_id: messageId,
                    feedback: type // 'up' or 'down'
                })
            });
            // Optional: Show toast or update UI to show feedback recorded
            console.log("Feedback sent:", type);
        } catch (error) {
            console.error("Failed to send feedback", error);
        }
    };

    const handleEdit = (id, newContent) => {
        const msgIndex = messages.findIndex(m => m.id === id);
        if (msgIndex === -1) return;

        // Update content
        const newMessages = [...messages];
        newMessages[msgIndex].content = newContent;

        // Remove all subsequent messages
        const truncatedMessages = newMessages.slice(0, msgIndex + 1);
        setMessages(truncatedMessages);

        // Trigger API call for the edited message
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch('/api/chat', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                message: newContent,
                session_id: isTemporary ? null : (sessionId ? parseInt(sessionId) : null)
            })
        }).then(res => res.json()).then(data => {
            const botMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.answer,
                timestamp: new Date().toISOString(),
                sources: data.sources || []
            };
            setMessages(prev => [...prev, botMessage]);
        }).catch(err => setIsLoading(false)).finally(() => setIsLoading(false));
    };

    const handleShare = async () => {
        if (!sessionId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/share/${sessionId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setShareUrl(`${window.location.origin}${data.share_url}`);
                setShowShareModal(true);
            }
        } catch (error) {
            console.error("Share failed", error);
        }
    };

    // Check if we are in an empty state (only welcome message or no messages)
    // Actually, the welcome message is there by default. Let's assume if there are ONLY assistant messages at start, it's "start"
    // BUT user wants the "What can I help with?" centered look. 
    // Let's check if messages length is 1 (the default welcome)
    const isNewChat = messages.length <= 1;

    return (
        <div className="flex flex-col h-full relative w-full max-w-full bg-transparent text-gray-900 dark:text-gray-100">
            {/* Header / Model Selector */}
            <div className="absolute top-0 left-0 p-4 z-20">
                <button className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-xl transition-colors">
                    <span>{t('chat.title')}</span>
                    <span className="text-gray-500 text-xs">▼</span>
                </button>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-700 ${isNewChat ? 'flex items-center justify-center' : 'pt-16 pb-32'}`}>

                {isNewChat ? (
                    <div className="flex flex-col items-center justify-center max-w-2xl w-full px-4 text-center">
                        <div className="mb-8 p-6 bg-white dark:bg-white/5 rounded-3xl ring-1 ring-gray-200 dark:ring-white/10 shadow-xl dark:shadow-2xl backdrop-blur-sm">
                            <img
                                src={logo}
                                alt="GovAssist"
                                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(0,123,255,0.6)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                            />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-8">{t('chat.new_chat_title')}</h1>


                        {/* Input is rendered here in the center for new chat */}
                        <div className="w-full">
                            <MessageInput
                                onSend={handleSend}
                                onUpload={handleUpload}
                                isLoading={isLoading}
                                centered={true}
                            />
                        </div>

                        {/* Quick Actions / Suggestions */}
                        <div className="grid grid-cols-2 gap-2 w-full mt-8">
                            <button onClick={() => handleSend(t('chat.suggestions.pm_kisan'))} className="p-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-left transition-colors">
                                {t('chat.suggestions.pm_kisan')}
                            </button>
                            <button onClick={() => handleSend(t('chat.suggestions.eligibility'))} className="p-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-left transition-colors">
                                {t('chat.suggestions.eligibility')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto w-full space-y-6 px-4">
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                onRegenerate={handleRegenerate}
                                onFeedback={handleFeedback}
                                onEdit={handleEdit}
                            />
                        ))}

                        {isLoading && (
                            <div className="flex gap-4 animate-pulse">
                                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                    <img
                                        src={logo}
                                        alt="GovAssist"
                                        className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(0,123,255,0.8)] dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded rounded-tl-none"></div>
                                    {loadingText && <div className="text-xs text-green-400 animate-pulse">{loadingText}</div>}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area (Pinned to bottom if not new chat) */}
            {!isNewChat && (
                <div className="w-full max-w-3xl mx-auto px-4 pb-4">
                    <MessageInput
                        onSend={handleSend}
                        onUpload={handleUpload}
                        isLoading={isLoading}
                        centered={false}
                    />
                    <div className="text-center mt-2 text-xs text-gray-500">
                        {t('chat.disclaimer')}
                    </div>
                </div>
            )}

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('chat.share_modal.title')}</h3>
                                <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('chat.share_modal.desc')}</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:border-green-500"
                                />
                                <button
                                    onClick={() => { navigator.clipboard.writeText(shareUrl); }}
                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWindow;
