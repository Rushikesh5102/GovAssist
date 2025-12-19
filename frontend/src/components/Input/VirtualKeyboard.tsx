import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const HINDI_LAYOUT = [
    ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'ऋ', 'अं', 'अः'],
    ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
    ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
    ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ळ'],
    ['ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ', 'श्र'],
    ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '्', '़']
];

const VirtualKeyboard = ({ onKeyPress, onClose, language = 'hi' }) => {
    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 z-50 shadow-2xl pb-safe"
        >
            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {language === 'mr' ? 'Marathi' : 'Hindi'} Keyboard
                </span>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                    <X size={16} />
                </button>
            </div>

            <div className="grid gap-1 pb-4">
                {HINDI_LAYOUT.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                        {row.map((char) => (
                            <button
                                key={char}
                                onClick={() => onKeyPress(char)}
                                className="min-w-[32px] h-10 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500 text-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                ))}
                <div className="flex justify-center gap-1 mt-1">
                    <button
                        onClick={() => onKeyPress(' ')}
                        className="w-1/3 h-10 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium"
                    >
                        Space
                    </button>
                    <button
                        onClick={() => onKeyPress('backspace')}
                        className="w-16 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded shadow-sm hover:bg-red-200 dark:hover:bg-red-900/50 text-sm font-medium"
                    >
                        ⌫
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default VirtualKeyboard;
