import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { STATIONS } from '../../data/stations';
import { useSignalStore } from '../../store/useSignalStore';
import { BeaconTower } from './BeaconTower';
import { RadioDial } from './RadioDial';
import { PostProcessing } from './PostProcessing';

const CameraController: React.FC = () => {
  const reducedMotion = useSignalStore((s) => s.reducedMotion);

  useFrame((state) => {
    const cam = state.camera;
    const t = state.clock.getElapsedTime();

    if (reducedMotion) {
      cam.position.set(0, 1.35, 5.2);
      cam.lookAt(0, 0.70, -4);
      return;
    }

    // Steady, stable eye-level workbench camera with gentle natural breathing
    cam.position.set(
      Math.sin(t * 0.2) * 0.02,
      1.35 + Math.cos(t * 0.25) * 0.015,
      5.2
    );
    cam.lookAt(0, 0.70, -4);
  });

  return null;
};

// Atmospheric radio ionosphere embers / stars in the sky
const SkyAtmosphere: React.FC = () => {
  const particlesCount = 90;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = 3 + Math.random() * 25;
      pos[i * 3 + 2] = -8 - Math.random() * 32;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#f4be60"
        transparent
        opacity={0.65}
        toneMapped={false}
      />
    </points>
  );
};

export const Scene: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1.35, 5.2], fov: 46, near: 0.1, far: 250 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        {/* Deep atmospheric night sky */}
        <color attach="background" args={['#0e0a07']} />
        <fog attach="fog" args={['#0e0a07', 45, 130]} />

        {/* =================================================== */}
        {/* WARM VINTAGE LIGHTING SYSTEM                        */}
        {/* =================================================== */}
        <ambientLight intensity={1.6} color="#d4a860" />

        {/* Warm key lamplight casting from top-right */}
        <directionalLight position={[6, 12, 8]} intensity={3.2} color="#f4caa0" />

        {/* Soft amber fill light from left */}
        <directionalLight position={[-6, 10, 4]} intensity={1.8} color="#d48a30" />

        {/* Back rim light highlighting tower lattice and radio shoulders */}
        <directionalLight position={[0, 8, -15]} intensity={1.6} color="#ff9040" />

        {/* Dedicated warm spotlight illuminating the radio face directly */}
        <spotLight
          position={[-0.45, 4.2, 5.5]}
          angle={0.65}
          penumbra={0.6}
          intensity={4.5}
          color="#ffe8b8"
          distance={12}
        />

        {/* Warm desk bounce light */}
        <pointLight position={[-0.45, -0.6, 3.2]} intensity={1.8} color="#ffaa44" distance={5} />

        {/* Camera Controller */}
        <CameraController />

        {/* Atmospheric stars */}
        <SkyAtmosphere />

        {/* Distant terrain horizon plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, -25]}>
          <planeGeometry args={[180, 120]} />
          <meshStandardMaterial color="#120d09" roughness={0.95} metalness={0.05} />
        </mesh>

        {/* Horizon warm glow ribbon */}
        <mesh position={[0, -3.4, -45]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[160, 4]} />
          <meshBasicMaterial color="#b87820" transparent opacity={0.12} />
        </mesh>

        {/* 8 Radio Transmission Towers across the horizon */}
        {STATIONS.map((station) => (
          <BeaconTower key={station.id} station={station} />
        ))}

        {/* Vintage 1940s Radio Receiver in the foreground */}
        <RadioDial />

        {/* Warm post-processing */}
        <PostProcessing />
      </Canvas>
    </div>
  );
};
