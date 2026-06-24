import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Artifact = () => {
    const groupRef = useRef();
    const ringsRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
        if (ringsRef.current) {
            ringsRef.current.rotation.x += delta * 0.1;
            ringsRef.current.rotation.y -= delta * 0.15;
            ringsRef.current.rotation.z += delta * 0.05;
        }
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
                <group ref={groupRef}>
                    {/* Inner Glowing Core */}
                    <mesh position={[0, -0.2, 0]}>
                        <octahedronGeometry args={[1.5, 0]} />
                        <meshStandardMaterial
                            color="#d4af37"
                            emissive="#d4af37"
                            emissiveIntensity={1.5}
                            wireframe={false}
                        />
                    </mesh>

                    {/* Outer Glass Pyramid */}
                    <mesh position={[0, 0, 0]}>
                        <coneGeometry args={[2.5, 4.5, 4]} />
                        <MeshTransmissionMaterial
                            backside
                            backsideThickness={5}
                            thickness={2}
                            chromaticAberration={0.5}
                            anisotropy={0.2}
                            distortion={0.5}
                            distortionScale={0.5}
                            temporalDistortion={0.2}
                            color="#ffffff"
                            transparent
                            opacity={0.9}
                            roughness={0.1}
                            metalness={0.8}
                        />
                    </mesh>

                    {/* Golden Wireframe Frame */}
                    <mesh position={[0, 0, 0]}>
                        <coneGeometry args={[2.55, 4.55, 4]} />
                        <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.6} />
                    </mesh>

                    {/* Pedestal Top */}
                    <mesh position={[0, -2.4, 0]} receiveShadow>
                        <cylinderGeometry args={[2.2, 2.5, 0.4, 4]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Pedestal Bottom */}
                    <mesh position={[0, -2.8, 0]} receiveShadow>
                        <cylinderGeometry args={[2.6, 3.2, 0.6, 4]} />
                        <meshStandardMaterial color="#0d0d0d" metalness={0.9} roughness={0.4} />
                    </mesh>

                    {/* 4 Floating Small Obelisks around it */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <group key={i} rotation-y={(i * Math.PI) / 2}>
                            <mesh position={[3.5, 0, 0]}>
                                <cylinderGeometry args={[0.2, 0.4, 3, 4]} />
                                <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
                            </mesh>
                            {/* Glowing gold tip */}
                            <mesh position={[3.5, 1.6, 0]}>
                                <coneGeometry args={[0.2, 0.4, 4]} />
                                <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2} />
                            </mesh>
                            {/* Glowing rings around obelisk */}
                            <mesh position={[3.5, 0, 0]} rotation-x={Math.PI / 2}>
                                <torusGeometry args={[0.6, 0.02, 16, 50]} />
                                <meshBasicMaterial color="#d4af37" />
                            </mesh>
                        </group>
                    ))}
                </group>

                {/* Cosmic Rotating Rings */}
                <group ref={ringsRef} position={[0, 0, 0]}>
                    <mesh rotation-x={Math.PI / 2}>
                        <torusGeometry args={[4.5, 0.03, 16, 100]} />
                        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1} />
                    </mesh>
                    <mesh rotation-y={Math.PI / 2} rotation-x={Math.PI / 4} scale={1.1}>
                        <torusGeometry args={[4.5, 0.01, 16, 100]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.8} />
                    </mesh>
                    <mesh rotation-y={-Math.PI / 4} rotation-x={-Math.PI / 6} scale={1.2}>
                        <torusGeometry args={[4.5, 0.02, 16, 100]} />
                        <meshStandardMaterial color="#d4af37" transparent opacity={0.5} />
                    </mesh>
                </group>
            </Float>
        </group>
    );
};

const PharaohModel = () => {
    return (
        <div className="w-full h-full min-w-[300px] min-h-[300px] pointer-events-auto cursor-grab active:cursor-grabbing">
            <Canvas shadows camera={{ position: [0, 2, 14], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={2}
                    castShadow
                />
                {/* Golden ambient glows */}
                <pointLight position={[-5, 2, -5]} intensity={1.5} color="#d4af37" />
                <pointLight position={[5, -2, 5]} intensity={1} color="#ffffff" />

                <Artifact />

                {/* Floating essence particles */}
                <Sparkles count={150} scale={12} size={3} speed={0.4} opacity={0.6} color="#d4af37" />
                <Sparkles count={80} scale={8} size={2} speed={0.8} opacity={0.8} color="#ffffff" />

                <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={15} blur={2.5} far={10} color="#000000" />

                <Environment preset="night" />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={1}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
};

export default PharaohModel;
