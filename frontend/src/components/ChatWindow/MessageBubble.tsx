import React, { useState } from 'react';
import logo from '../../assets/logo.png'; // Add import

// ...

// ... imports above
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Edit2, Check, X } from 'lucide-react';
import MessageToolbar from './MessageToolbar';
import StreamingRenderer from './StreamingRenderer';

const MessageBubble = ({ message, onRegenerate, onFeedback, onEdit, animate = false }) => {
    const isUser = message.role === 'user';
    const [shouldAnimate, setShouldAnimate] = useState(animate && !isUser);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);

    const handleSaveEdit = () => {
        if (editContent.trim() !== message.content) {
            onEdit(message.id, editContent);
        }
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-4 max-w-4xl mx-auto group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isUser
                ? 'bg-gradient-to-br from-saffron to-indiaGreen text-white shadow-lg'
                : 'bg-transparent text-saffron'
                }`}>
                {isUser ? <User size={20} /> : <img src={logo} alt="GovAssist" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(0,123,255,0.8)] dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[95%] md:max-w-[90%] ${isUser ? 'items-end' : 'items-start w-full'}`}>
                <div className={`
                    px-6 py-4 text-base leading-relaxed relative w-full
                    ${isUser
                        ? 'bg-gradient-to-br from-saffron to-saffron-dim text-white rounded-2xl rounded-tr-none shadow-lg shadow-saffron/20'
                        : 'bg-transparent pl-0 text-gray-900 dark:text-gray-100'
                    }
                `}>
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 rounded bg-white/20 text-inherit placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                                rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/20 rounded"><X size={16} /></button>
                                <button onClick={handleSaveEdit} className="p-1 hover:bg-white/20 rounded"><Check size={16} /></button>
                            </div>
                        </div>
                    ) : (
                        shouldAnimate ? (
                            <StreamingRenderer
                                content={message.content}
                                onComplete={() => setShouldAnimate(false)}
                            />
                        ) : (
                            <div className={`prose max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto my-2 rounded-lg bg-black/10 dark:bg-black/30 p-2">
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code: ({ node, inline, ...props }) => (
                                            inline
                                                ? <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5" {...props} />
                                                : <code {...props} />
                                        )
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )
                    )}
                </div>

                {/* Actions */}
                <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <MessageToolbar
                        message={message}
                        onRegenerate={onRegenerate}
                        onFeedback={onFeedback}
                        onEdit={() => setIsEditing(true)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
