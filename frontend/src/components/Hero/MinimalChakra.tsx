import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Float, Environment, Sphere, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ChakraScene = () => {
    const outerRingRef = useRef(null);
    const innerRingRef = useRef(null);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (!outerRingRef.current || !innerRingRef.current) return;

        // Slow rotation
        outerRingRef.current.rotation.z += delta * 0.1;
        outerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        outerRingRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;

        innerRingRef.current.rotation.z -= delta * 0.15;

        // Interactive mouse parallax
        const { x, y } = state.mouse;
        const lerpFactor = 0.1;
        outerRingRef.current.rotation.x += (y * 0.2 - outerRingRef.current.rotation.x) * lerpFactor;
        outerRingRef.current.rotation.y += (x * 0.2 - outerRingRef.current.rotation.y) * lerpFactor;
    });

    return (
        <>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#FF9933" />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Outer Glassy Ring (Saffron Tint) */}
                <Torus
                    ref={outerRingRef}
                    args={[2.2, 0.15, 32, 100]}
                    rotation={[Math.PI / 2, 0, 0]}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={5}
                        thickness={2}
                        chromaticAberration={0.05}
                        anisotropy={0.1}
                        color="#FFB366"
                        roughness={0.1}
                        metalness={0.1}
                        envMapIntensity={2}
                    />
                </Torus>

                {/* Middle Ring (White/Neutral) */}
                <Torus
                    ref={innerRingRef}
                    args={[1.8, 0.05, 32, 100]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshStandardMaterial
                        color="#ffffff"
                        roughness={0.3}
                        metalness={0.8}
                        emissive="#ffffff"
                        emissiveIntensity={0.1}
                    />
                </Torus>

                {/* Inner Abstract Geometry (Green Tint) */}
                <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                    <Torus args={[1.4, 0.02, 16, 64]}>
                        <meshStandardMaterial color="#33A329" metalness={0.8} roughness={0.2} />
                    </Torus>
                    <Sphere args={[0.3, 32, 32]}>
                        <meshStandardMaterial color="#000080" metalness={0.9} roughness={0.1} emissive="#000080" emissiveIntensity={0.2} />
                    </Sphere>
                </group>
            </Float>

            <Environment preset="city" />
        </>
    );
};

const MinimalChakra = () => {
    // Lazy loading placeholder could go here if we were loading a huge model, 
    // but for primitive shapes, it's fast. 
    // The heaviest part is the Canvas initialization.
    return (
        <div className="w-full h-[400px] md:h-[500px] relative cursor-pointer">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ChakraScene />
            </Canvas>
        </div>
    );
};

export default MinimalChakra;
