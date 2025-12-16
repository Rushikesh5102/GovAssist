import React, { useRef, useState } from 'react';
import { Send, Paperclip, Mic, X, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import VirtualKeyboard from '../Input/VirtualKeyboard';
import { Keyboard } from 'lucide-react';

const MessageInput = ({ onSend, onUpload, isLoading, centered }) => {
    const [input, setInput] = useState('');
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleInput = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVirtualKeyPress = (char) => {
        if (char === 'backspace') {
            setInput(prev => prev.slice(0, -1));
        } else {
            setInput(prev => prev + char);
        }
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setShowKeyboard(false);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await transcribeAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const transcribeAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');

        try {
            // Show some loading state for transcription if needed
            setInput("Transcribing...");

            const response = await fetch('/api/voice/transcribe', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setInput(data.text);
                // Adjust height
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
                    }
                }, 100);
            } else {
                setInput("Transcription failed.");
            }
        } catch (error) {
            console.error("Transcription error:", error);
            setInput("Error transcribing audio.");
        }
    };

    return (
        <>
            <div className="w-full relative">
                <motion.div
                    layout
                    className={`
                    relative flex items-end gap-2 
                    bg-[#2f2f2f] rounded-[26px] p-2 
                    border border-transparent focus-within:border-gray-600 
                    transition-all shadow-lg
                    ${isRecording ? 'ring-2 ring-red-500/50' : ''}
                `}
                >
                    {/* File Upload / Attach */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onUpload}
                        multiple
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors self-end mb-0.5"
                        title="Upload file"
                        disabled={isRecording}
                    >
                        <Paperclip size={20} className="rotate-45" />
                    </button>

                    {/* Text Input */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        rows={1}
                        disabled={isRecording}
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 text-gray-100 placeholder-gray-400 max-h-[200px] scrollbar-hide text-base"
                        style={{ minHeight: '48px' }}
                    />

                    {/* Right Actions Group */}
                    <div className="flex items-center gap-1 self-end mb-0.5">
                        {/* Voice Input */}
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-2.5 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-900/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            title={isRecording ? "Stop recording" : "Voice input"}
                        >
                            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                        </button>

                        {/* Send Button - Only show if input active? ChatGPT shows it always but greyed. Or shows it when typing. */}
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading || isRecording}
                            className={`
                            p-2.5 rounded-full transition-all duration-200
                            ${input.trim() && !isLoading && !isRecording
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-transparent text-gray-500 cursor-not-allowed'
                                }
                        `}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showKeyboard && (
                    <VirtualKeyboard
                        onKeyPress={handleVirtualKeyPress}
                        onClose={() => setShowKeyboard(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MessageInput;
