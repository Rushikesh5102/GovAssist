import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MessageBubble from '../components/ChatWindow/MessageBubble';
import { Bot } from 'lucide-react';

const SharePage = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedChat = async () => {
            try {
                const response = await fetch(`/api/share/${token}`);
                if (!response.ok) throw new Error('Chat not found or expired');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSharedChat();
    }, [token]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen text-red-500">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <Bot size={24} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{data.title || 'Shared Conversation'}</h1>
                    <p className="text-gray-500 text-sm">
                        Shared via GovAssist AI • {new Date(data.created_at).toLocaleDateString()}
                    </p>
                </div>

                <div className="space-y-6">
                    {data.messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={{
                                ...msg,
                                sources: msg.sources ? JSON.parse(msg.sources) : []
                            }}
                            // Read-only mode: no handlers
                            onRegenerate={() => { }}
                            onFeedback={() => { }}
                            onEdit={() => { }}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                        Start your own chat
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SharePage;
