import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const StreamingRenderer = ({ content, onComplete }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < content.length) {
                setDisplayedContent((prev) => prev + content.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
                if (onComplete) onComplete();
            }
        }, 15); // Adjust speed here

        return () => clearInterval(interval);
    }, [content, onComplete]);

    return (
        <div className="streaming-content prose dark:prose-invert max-w-none">
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
                {displayedContent + (isTyping ? '▍' : '')}
            </ReactMarkdown>
        </div>
    );
};

export default StreamingRenderer;
