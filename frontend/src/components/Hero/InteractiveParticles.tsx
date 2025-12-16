import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ count = 2500 }) => {
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Create particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20; // Wide spread
            const y = (Math.random() - 0.5) * 12;
            const z = (Math.random() - 0.5) * 10;

            // Brand Identity Colors (mostly Subtle / Google Grey)
            const rand = Math.random();
            let color;
            if (rand > 0.98) color = new THREE.Color('#FF9933'); // Saffron (Accents)
            else if (rand > 0.96) color = new THREE.Color('#138808'); // Green (Accents)
            else if (rand > 0.94) color = new THREE.Color('#000080'); // Blue (Accents)
            else color = new THREE.Color('#BDC1C6'); // Light Grey (Base)

            temp.push({
                position: new THREE.Vector3(x, y, z),
                color,
                originalPos: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(0, 0, 0)
            });
        }
        return temp;
    }, [count]);


    useFrame((state) => {
        if (!mesh.current) return;

        const { mouse } = state;
        // Mouse interaction vector (World space approx)
        const target = new THREE.Vector3(mouse.x * 12, mouse.y * 7, 0);

        particles.forEach((particle, i) => {
            // 1. Hover Repulsion
            const dist = particle.position.distanceTo(target);

            // Floating animation
            particle.position.y += Math.sin(state.clock.elapsedTime + particle.originalPos.x) * 0.002;

            // Mouse Interaction
            if (dist < 4) {
                const dir = particle.position.clone().sub(target).normalize();
                const force = (4 - dist) * 0.08;
                particle.position.add(dir.multiplyScalar(force));
            } else {
                // Return to original slowly
                particle.position.lerp(particle.originalPos, 0.02);
            }

            // Update Instance
            dummy.position.copy(particle.position);
            dummy.scale.setScalar(0.035); // Fine dust size
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
            mesh.current.setColorAt(i, particle.color);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
        mesh.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <circleGeometry args={[0.5, 16]} />
            <meshBasicMaterial transparent opacity={0.6} />
        </instancedMesh>
    );
};

const InteractiveParticles = () => {
    return (
        <div className="absolute inset-0 -z-10 pointer-events-none">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ParticleField />
            </Canvas>
        </div>
    );
};

export default InteractiveParticles;
