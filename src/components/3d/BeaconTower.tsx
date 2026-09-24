import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Station } from '../../types/station';
import { useSignalStore } from '../../store/useSignalStore';

interface BeaconTowerProps {
  station: Station;
}

/**
 * Vintage Transmission Tower — Perfectly Scaled & Centered in Sky
 * 
 * Scaled so the flashing summit beacon, halo flare, and broadcast wave rings
 * sit majestically in the upper-third of the screen.
 */
export const BeaconTower: React.FC<BeaconTowerProps> = ({ station }) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const waveRingRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const [hovered, setHovered] = useState(false);

  const frequency = useSignalStore((s) => s.frequency);
  const lockedStation = useSignalStore((s) => s.lockedStation);
  const isLocked = useSignalStore((s) => s.isLocked);
  const jumpToStation = useSignalStore((s) => s.jumpToStation);

  const isCurrentStationLocked = isLocked && lockedStation?.id === station.id;

  // Tower scaled to 7.5 units tall so summits are in full view
  const scale = (station.towerScale || 1.0) * 0.75;
  const towerHeight = 7.5;
  const spireTip = towerHeight + 2.2;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const diff = Math.abs(frequency - station.frequency);
    const proximity = Math.max(0, 1 - diff / 1.5);

    // 1. Summit beacon pulsing & strobe flash
    if (beaconMeshRef.current) {
      const mat = beaconMeshRef.current.material as THREE.MeshBasicMaterial;
      const strobe = isCurrentStationLocked
        ? 1.0 + Math.sin(elapsed * 9) * 0.35
        : hovered
        ? 1.0 + Math.sin(elapsed * 6) * 0.3
        : 0.7 + Math.sin(elapsed * 2.5 + station.frequency * 2) * 0.3 + proximity * 0.4;
      mat.opacity = Math.max(0.5, Math.min(1.0, strobe));
    }

    // 2. Beacon halo billboard scale pulse
    if (haloRef.current) {
      const pulseScale = isCurrentStationLocked
        ? 1.4 + Math.sin(elapsed * 6) * 0.3
        : 1.0 + proximity * 0.7 + Math.sin(elapsed * 2 + station.frequency) * 0.15;
      haloRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }

    // 3. Expanding broadcast radio wave rings
    waveRingRefs.forEach((ref, idx) => {
      if (ref.current) {
        const speed = isCurrentStationLocked ? 1.5 : 0.6 + proximity * 0.9;
        const phase = (elapsed * speed + idx * 0.33) % 1.0;
        const currentRadius = 0.8 + phase * 6.0;
        ref.current.scale.set(currentRadius, currentRadius, currentRadius);

        const mat = ref.current.material as THREE.MeshBasicMaterial;
        const baseOpacity = isCurrentStationLocked ? 0.75 : proximity > 0.05 ? 0.35 + proximity * 0.35 : 0.15;
        mat.opacity = (1.0 - phase) * baseOpacity;
      }
    });
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    jumpToStation(station.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  // Adjust base position so tower stands firmly on ground
  const adjustedPos: [number, number, number] = [
    station.position3D[0],
    Math.max(-0.5, station.position3D[1] * 0.5),
    station.position3D[2]
  ];

  return (
    <group
      ref={groupRef}
      position={adjustedPos}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Heavy concrete footing */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.0, 2.5, 0.6, 8]} />
        <meshStandardMaterial color="#3a3028" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 4 Main Corner Legs */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const bx = Math.cos(angle) * 1.4;
        const bz = Math.sin(angle) * 1.4;
        const tx = Math.cos(angle) * 0.3;
        const tz = Math.sin(angle) * 0.3;

        return (
          <group key={`leg-${i}`}>
            <mesh position={[(bx + tx) / 2, towerHeight / 2 + 0.6, (bz + tz) / 2]}>
              <cylinderGeometry args={[0.09, 0.16, towerHeight, 6]} />
              <meshStandardMaterial
                color={hovered || isCurrentStationLocked ? '#ffba44' : '#8a7258'}
                metalness={0.8}
                roughness={0.3}
                emissive={hovered || isCurrentStationLocked ? station.accentColor : '#000000'}
                emissiveIntensity={hovered || isCurrentStationLocked ? 0.5 : 0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Cross Lattice Bracing at 4 tiers */}
      {[1.8, 3.6, 5.4, 7.0].map((h, tierIdx) => {
        const t = h / towerHeight;
        const span = (1 - t) * 2.6 + t * 0.6;

        return (
          <group key={`tier-${tierIdx}`} position={[0, h + 0.6, 0]}>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
              <ringGeometry args={[span * 0.46, span * 0.54, 4]} />
              <meshStandardMaterial
                color="#9a8568"
                metalness={0.7}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Aviation hazard indicator lights */}
            {(tierIdx === 1 || tierIdx === 2) && (
              <mesh position={[0, 0, span * 0.55]}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshBasicMaterial color="#ff3300" toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Summit Service Platform */}
      <mesh position={[0, towerHeight + 0.6, 0]}>
        <cylinderGeometry args={[0.65, 0.45, 0.15, 8]} />
        <meshStandardMaterial color="#4a3e30" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* High-gain Spire Mast */}
      <mesh position={[0, towerHeight + 1.6, 0]}>
        <cylinderGeometry args={[0.04, 0.1, 2.0, 8]} />
        <meshStandardMaterial
          color="#d4b880"
          metalness={0.9}
          roughness={0.2}
          emissive={station.accentColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cross dipole antennas */}
      {[-0.4, 0, 0.4].map((offset, i) => (
        <mesh key={`dipole-${i}`} position={[0, towerHeight + 1.8 + offset * 0.4, 0]} rotation={[0, (i * Math.PI) / 3, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.0, 6]} />
          <meshStandardMaterial color="#d4af60" metalness={0.8} />
        </mesh>
      ))}

      {/* =================================================== */}
      {/* SUMMIT BEACON ORB (Bright Radiant Ruby / Gold)     */}
      {/* =================================================== */}
      <mesh ref={beaconMeshRef} position={[0, spireTip, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial
          color={isCurrentStationLocked || hovered ? station.accentColor : '#ff3b1e'}
          toneMapped={false}
          transparent
          opacity={1.0}
        />
      </mesh>

      {/* Summit Beacon Halo Flare Disc (Billboard Glow) */}
      <mesh ref={haloRef} position={[0, spireTip, 0]}>
        <ringGeometry args={[0.42, 1.8, 32]} />
        <meshBasicMaterial
          color={isCurrentStationLocked || hovered ? station.accentColor : '#ff5522'}
          toneMapped={false}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wide Radiant Ambient Glow Disc */}
      <mesh position={[0, spireTip, 0]}>
        <ringGeometry args={[1.6, 3.4, 32]} />
        <meshBasicMaterial
          color={station.accentColor}
          toneMapped={false}
          transparent
          opacity={isCurrentStationLocked ? 0.4 : hovered ? 0.3 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* =================================================== */}
      {/* 3 EXPANDING BROADCAST RADIO WAVE RINGS              */}
      {/* =================================================== */}
      {waveRingRefs.map((ref, idx) => (
        <mesh
          key={`wave-${idx}`}
          ref={ref}
          position={[0, spireTip, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.9, 1.08, 36]} />
          <meshBasicMaterial
            color={station.accentColor}
            toneMapped={false}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* =================================================== */}
      {/* VERTICAL IONOSPHERIC SIGNAL BEAM (when locked)     */}
      {/* =================================================== */}
      {isCurrentStationLocked && (
        <group position={[0, spireTip, 0]}>
          <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[0.2, 0.8, 20, 16, 1, true]} />
            <meshBasicMaterial
              color={station.accentColor}
              toneMapped={false}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 12, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 24, 8, 1, true]} />
            <meshBasicMaterial
              color="#ffffff"
              toneMapped={false}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Floating Callsign / Frequency Badge */}
      <group position={[0, spireTip + 1.2, 0]}>
        <mesh>
          <planeGeometry args={[2.4, 0.65]} />
          <meshBasicMaterial color="#1a1410" transparent opacity={0.88} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.95, 1.0, 4]} />
          <meshBasicMaterial
            color={isCurrentStationLocked || hovered ? station.accentColor : '#8a7860'}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[-0.7, 0, 0.02]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={station.accentColor} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
