import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const ParticleField = (props) => {
    const ref = useRef();
    const { mouse, viewport } = useThree();

    // Generate particles
    const count = 2000; // Manageable count for performance
    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3);
        const distance = 4; // Spread radius
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Random distribution in a sphere slightly flattened
            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            // Gentle rotation
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;

            // Interactive movement based on mouse
            // Mouse is normalized -1 to 1
            const x = (mouse.x * viewport.width) / 50;
            const y = (mouse.y * viewport.height) / 50;

            // Look slightly towards mouse
            ref.current.rotation.x += (y - ref.current.rotation.x) * 0.05;
            ref.current.rotation.y += (x - ref.current.rotation.y) * 0.05;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color={props.color || "#ffa500"}
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};

const InteractiveHero = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const particleColor = isDark ? '#FF9933' : '#FF9933'; // Primary Orange
    const bgColor = isDark ? '#111827' : '#f9fafb'; // Match tailwind gray-900 / gray-50

    return (
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ambientLight intensity={0.5} />
                <ParticleField color={particleColor} />
            </Canvas>

            {/* Gradient Overlay for Text Readability */}
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-b ${isDark
                ? 'from-gray-900/80 via-transparent to-gray-900/80'
                : 'from-white/80 via-transparent to-white/80'
                }`} />
        </div>
    );
};

export default InteractiveHero;
