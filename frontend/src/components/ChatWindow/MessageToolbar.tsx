import React from 'react';
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, Check, Edit2 } from 'lucide-react';

const MessageToolbar = ({ message, onRegenerate, onFeedback, onEdit }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
                onClick={handleCopy}
                className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy"
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            {message.role === 'user' && (
                <button
                    onClick={onEdit}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit2 size={14} />
                </button>
            )}

            {message.role === 'assistant' && (
                <>
                    <button
                        onClick={onRegenerate}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Regenerate"
                    >
                        <RotateCcw size={14} />
                    </button>
                    <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1" />
                    <button
                        onClick={() => onFeedback('up')}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Helpful"
                    >
                        <ThumbsUp size={14} />
                    </button>
                    <button
                        onClick={() => onFeedback('down')}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Not Helpful"
                    >
                        <ThumbsDown size={14} />
                    </button>
                </>
            )}
        </div>
    );
};

export default MessageToolbar;
