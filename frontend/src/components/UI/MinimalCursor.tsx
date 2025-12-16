import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MinimalCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [variant, setVariant] = useState('default');
    const [isVisible, setIsVisible] = useState(false);

    // Smooth springs for movement
    const springConfig = { damping: 40, stiffness: 600, mass: 0.5 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Check if device is touch
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        setIsVisible(true);

        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        // Interactive elements detection
        const handleMouseEnter = () => setVariant('interactive');
        const handleMouseLeave = () => setVariant('default');

        const setupListeners = () => {
            const interactives = document.querySelectorAll('a, button, input, [role="button"], .cursor-pointer');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
            return interactives;
        };

        let elements = setupListeners();

        // Observer for dynamic content
        const observer = new MutationObserver(() => {
            // Clean up old listeners (ideal world) or just re-attach
            // For simplicity in this scope, we just re-attach to new ones
            elements = setupListeners();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            observer.disconnect();
            elements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-exclusion"
                style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
                animate={variant}
                variants={{
                    default: { scale: 1 },
                    interactive: { scale: 0.5 } // Shrink dot on hover
                }}
            />

            {/* Trailing Ring / Glow */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9998]"
                style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
                animate={variant}
                variants={{
                    default: { scale: 1, opacity: 0.5 },
                    interactive: { scale: 1.5, borderColor: '#ffffff', opacity: 1 } // Expand ring on hover
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />
        </>
    );
};

export default MinimalCursor;
