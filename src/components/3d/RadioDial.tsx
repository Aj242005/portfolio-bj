import React, { useRef, useEffect, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSignalStore } from '../../store/useSignalStore';
import { STATIONS, MIN_FREQUENCY, MAX_FREQUENCY } from '../../data/stations';
import { soundManager } from '../../audio/soundManager';

/**
 * Vintage 1940s Tabletop Radio Receiver — Perfectly Positioned & Fully Interactive
 * 
 * Sits in the lower-left-center of the screen:
 * - Cabinet width 3.4, height 1.9
 * - Positioned at [-0.6, -0.45, 1.6] so it NEVER collides with the right-hand station card!
 * - Illuminated amber dial face, sweeping red needle, glowing Magic Eye tube
 * - Big brass tuning knob (drag left/right or scroll wheel)
 * - Volume knob (click to toggle mute)
 * - 3 glowing vacuum tubes on top
 */
export const RadioDial: React.FC = () => {
  const knobRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Group>(null);
  const magicEyeRef = useRef<THREE.Mesh>(null);
  const dialLightRef = useRef<THREE.PointLight>(null);
  const tubeLightRef = useRef<THREE.PointLight>(null);

  const isDragging = useRef<boolean>(false);
  const lastPointerX = useRef<number>(0);
  const velocity = useRef<number>(0);
  const dwellTime = useRef<number>(0);
  const [knobHovered, setKnobHovered] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);

  const frequency = useSignalStore((s) => s.frequency);
  const targetFrequency = useSignalStore((s) => s.targetFrequency);
  const nearestStation = useSignalStore((s) => s.nearestStation);
  const proximity = useSignalStore((s) => s.proximity);
  const isLocked = useSignalStore((s) => s.isLocked);
  const isMuted = useSignalStore((s) => s.isMuted);

  const setFrequency = useSignalStore((s) => s.setFrequency);
  const setTargetFrequency = useSignalStore((s) => s.setTargetFrequency);
  const lockStation = useSignalStore((s) => s.lockStation);
  const toggleMute = useSignalStore((s) => s.toggleMute);
  const setInteracted = useSignalStore((s) => s.setInteracted);

  // Rotation mappings
  const TOTAL_ROTATION_RAD = Math.PI * 6;
  const freqToAngle = (freq: number) => {
    const norm = (freq - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY);
    return norm * TOTAL_ROTATION_RAD;
  };

  const angleToFreq = (angle: number) => {
    const norm = Math.max(0, Math.min(1, angle / TOTAL_ROTATION_RAD));
    return MIN_FREQUENCY + norm * (MAX_FREQUENCY - MIN_FREQUENCY);
  };

  // Dial needle travel limits (inside dial frame)
  const DIAL_MIN_X = -0.58;
  const DIAL_MAX_X = 0.58;
  const freqToNeedleX = (freq: number) => {
    const norm = (freq - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY);
    return DIAL_MIN_X + norm * (DIAL_MAX_X - DIAL_MIN_X);
  };

  const currentAngle = useRef<number>(freqToAngle(frequency));

  // Pointer drag on knob
  const handleKnobPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    lastPointerX.current = e.clientX;
    velocity.current = 0;
    setTargetFrequency(null);
    setInteracted();
    document.body.style.cursor = 'grabbing';
  };

  // Wheel scroll to tune
  const handleWheel = (e: ThreeEvent<WheelEvent>) => {
    e.stopPropagation();
    setInteracted();
    const deltaFreq = e.deltaY > 0 ? -0.2 : 0.2;
    const newFreq = Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, frequency + deltaFreq));
    currentAngle.current = freqToAngle(newFreq);
    setFrequency(newFreq);
  };

  // Click dial to jump frequency
  const handleDialClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setInteracted();
    if (e.intersections && e.intersections.length > 0) {
      const uv = e.intersections[0].uv;
      if (uv) {
        const targetFreq = MIN_FREQUENCY + uv.x * (MAX_FREQUENCY - MIN_FREQUENCY);
        const nearest = STATIONS.find((s) => Math.abs(s.frequency - targetFreq) < 0.8);
        if (nearest) {
          setTargetFrequency(nearest.frequency);
        } else {
          setTargetFrequency(targetFreq);
        }
      }
    }
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;

      const angularDelta = deltaX * 0.016;
      currentAngle.current = Math.max(
        0,
        Math.min(TOTAL_ROTATION_RAD, currentAngle.current + angularDelta)
      );

      velocity.current = angularDelta;
      const newFreq = angleToFreq(currentAngle.current);
      setFrequency(newFreq);
    };

    const handleGlobalPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'auto';
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Target frequency transition
    if (targetFrequency !== null) {
      const targetAngle = freqToAngle(targetFrequency);
      currentAngle.current = THREE.MathUtils.damp(
        currentAngle.current,
        targetAngle,
        9,
        delta
      );
      const newFreq = angleToFreq(currentAngle.current);
      setFrequency(newFreq);

      if (Math.abs(currentAngle.current - targetAngle) < 0.006) {
        currentAngle.current = targetAngle;
        setFrequency(targetFrequency);
        setTargetFrequency(null);
        const station = STATIONS.find((s) => Math.abs(s.frequency - targetFrequency) < 0.02);
        if (station) {
          lockStation(station);
        }
      }
    } else if (!isDragging.current) {
      // 2. Inertial damping
      if (Math.abs(velocity.current) > 0.0001) {
        currentAngle.current = Math.max(
          0,
          Math.min(TOTAL_ROTATION_RAD, currentAngle.current + velocity.current)
        );
        velocity.current *= 0.88;
        const newFreq = angleToFreq(currentAngle.current);
        setFrequency(newFreq);
      } else {
        velocity.current = 0;

        // 3. Magnetic lock pull
        if (nearestStation && proximity > 0.94) {
          const snapAngle = freqToAngle(nearestStation.frequency);
          currentAngle.current = THREE.MathUtils.damp(
            currentAngle.current,
            snapAngle,
            12,
            delta
          );
          setFrequency(angleToFreq(currentAngle.current));
        }
      }
    }

    // 4. Rotate knob
    if (knobRef.current) {
      knobRef.current.rotation.z = -currentAngle.current;
    }

    // 5. Sweeping needle
    if (needleRef.current) {
      const targetNeedleX = freqToNeedleX(frequency);
      needleRef.current.position.x = THREE.MathUtils.damp(
        needleRef.current.position.x,
        targetNeedleX,
        14,
        delta
      );
    }

    // 6. Magic Eye phosphor glow
    if (magicEyeRef.current) {
      const mat = magicEyeRef.current.material as THREE.MeshBasicMaterial;
      const eyeIntensity = isLocked ? 1.0 : 0.35 + proximity * 0.55;
      mat.opacity = eyeIntensity;
    }

    // 7. Dial backlight
    if (dialLightRef.current) {
      const flicker = Math.sin(elapsed * 12) * 0.02;
      dialLightRef.current.intensity = isLocked
        ? 1.4 + flicker
        : 0.9 + proximity * 0.6 + flicker;
    }

    // 8. Vacuum tube filament throbbing
    if (tubeLightRef.current) {
      tubeLightRef.current.intensity = 1.0 + Math.sin(elapsed * 3) * 0.2;
    }

    // 9. Continuous Web Audio synthesis
    soundManager.updateTuningTone(proximity, frequency);

    // 10. Lock dwell detection
    if (nearestStation && proximity > 0.88 && Math.abs(velocity.current) < 0.005 && !isDragging.current) {
      dwellTime.current += delta;
      if (dwellTime.current >= 0.45 && !isLocked) {
        lockStation(nearestStation);
      }
    } else if (isDragging.current || Math.abs(velocity.current) > 0.01) {
      dwellTime.current = 0;
    }
  });

  // Colors
  const woodWalnut = '#483322';
  const woodDark = '#2c1e14';
  const woodHighlight = '#62442c';
  const polishedBrass = '#d8af5c';
  const darkBrass = '#8a6e38';
  const clothColor = '#241b12';

  return (
    <group
      position={[-0.45, 0.28, 1.8]}
      scale={[0.85, 0.85, 0.85]}
      rotation={[-0.08, 0.05, 0]}
      onWheel={handleWheel}
    >
      {/* =================================================== */}
      {/* 1. TABLETOP WORKBENCH SURFACE                       */}
      {/* =================================================== */}
      <mesh position={[0, -1.05, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#1a130c" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* =================================================== */}
      {/* 2. ART DECO WOODEN CABINET BODY                     */}
      {/* =================================================== */}
      {/* Main cabinet body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 1.9, 1.3]} />
        <meshStandardMaterial color={woodWalnut} roughness={0.55} metalness={0.15} />
      </mesh>

      {/* Waterfall rounded top cap */}
      <mesh position={[0, 0.96, 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 3.42, 16]} />
        <meshStandardMaterial color={woodHighlight} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Front inset faceplate */}
      <mesh position={[0, 0, 0.66]}>
        <boxGeometry args={[3.24, 1.74, 0.06]} />
        <meshStandardMaterial color={woodDark} roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Polished brass perimeter trim */}
      <mesh position={[0, 0, 0.7]}>
        <boxGeometry args={[3.28, 1.78, 0.02]} />
        <meshStandardMaterial color={polishedBrass} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* =================================================== */}
      {/* 3. SPEAKER GRILLE (Left Half: x = -0.8)             */}
      {/* =================================================== */}
      <group position={[-0.8, 0.06, 0.71]}>
        {/* Acoustic woven cloth backing */}
        <mesh>
          <planeGeometry args={[1.3, 1.38]} />
          <meshStandardMaterial color={clothColor} roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Vertical brass grille louvers */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={`slat-${i}`} position={[-0.5 + i * 0.165, 0, 0.02]}>
            <boxGeometry args={[0.035, 1.32, 0.02]} />
            <meshStandardMaterial color={polishedBrass} metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Decorative Art Deco chevron badge */}
        <mesh position={[0, 0, 0.035]}>
          <ringGeometry args={[0.16, 0.22, 24]} />
          <meshStandardMaterial color={polishedBrass} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Vertical center divider bar (brass) */}
      <mesh position={[-0.05, 0.03, 0.72]}>
        <boxGeometry args={[0.04, 1.62, 0.03]} />
        <meshStandardMaterial color={polishedBrass} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* =================================================== */}
      {/* 4. ILLUMINATED FREQUENCY DIAL WINDOW (Right Half)  */}
      {/* =================================================== */}
      <group position={[0.75, 0.25, 0.71]}>
        {/* Dial box recess */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.4, 0.75]} />
          <meshStandardMaterial color="#140d07" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Dial glass faceplate (Clickable!) */}
        <mesh
          position={[0, 0, 0.03]}
          onClick={handleDialClick}
          onPointerOver={() => {
            document.body.style.cursor = 'crosshair';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <planeGeometry args={[1.36, 0.71]} />
          <meshStandardMaterial
            color="#2a1e10"
            transparent
            opacity={0.5}
            roughness={0.15}
            metalness={0.3}
          />
        </mesh>

        {/* Brass dial bezel frame */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.42, 0.77, 0.02]} />
          <meshStandardMaterial color={polishedBrass} metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Frequency station tick marks (88.0 - 108.0 MHz) */}
        {STATIONS.map((st) => {
          const norm = (st.frequency - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY);
          const tickX = DIAL_MIN_X + norm * (DIAL_MAX_X - DIAL_MIN_X);
          const isCurrentTuned = Math.abs(st.frequency - frequency) < 0.4;

          return (
            <group key={st.id} position={[tickX, 0, 0.04]}>
              <mesh position={[0, 0.16, 0]}>
                <boxGeometry args={[0.02, 0.24, 0.01]} />
                <meshBasicMaterial
                  color={isCurrentTuned ? st.accentColor : '#b89050'}
                  toneMapped={false}
                />
              </mesh>
              <mesh position={[0, -0.18, 0]}>
                <circleGeometry args={[0.025, 10]} />
                <meshBasicMaterial
                  color={isCurrentTuned ? st.accentColor : '#d4af60'}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        {/* Sweeping Red Indicator Needle */}
        <group ref={needleRef} position={[freqToNeedleX(frequency), 0, 0.05]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.025, 0.66, 0.01]} />
            <meshBasicMaterial color="#ff2a00" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>

        {/* Warm dial incandescent backlighting */}
        <pointLight
          ref={dialLightRef}
          position={[0, 0, 0.15]}
          intensity={2.4}
          color="#f4a840"
          distance={3}
        />
      </group>

      {/* =================================================== */}
      {/* 5. MAGIC EYE 6E5 CATHODE RAY TUBE (Above Dial)      */}
      {/* =================================================== */}
      <group position={[0.75, 0.72, 0.72]}>
        {/* Brass bezel ring */}
        <mesh>
          <ringGeometry args={[0.09, 0.14, 20]} />
          <meshStandardMaterial color={polishedBrass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Phosphor green eye */}
        <mesh ref={magicEyeRef} position={[0, 0, -0.005]}>
          <circleGeometry args={[0.09, 20]} />
          <meshBasicMaterial color="#33ff66" toneMapped={false} transparent opacity={0.8} />
        </mesh>
        {/* Center shadow cap */}
        <mesh position={[0, 0, 0.005]}>
          <circleGeometry args={[0.028, 12]} />
          <meshBasicMaterial color="#1a1410" />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* 6. BIG TACTILE BRASS TUNING KNOB (Below Dial)      */}
      {/* =================================================== */}
      <group
        position={[0.75, -0.42, 0.77]}
        onPointerDown={handleKnobPointerDown}
        onPointerOver={() => {
          setKnobHovered(true);
          if (!isDragging.current) document.body.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          setKnobHovered(false);
          if (!isDragging.current) document.body.style.cursor = 'auto';
        }}
      >
        {/* Brass bezel ring */}
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.36, 0.44, 32]} />
          <meshStandardMaterial
            color={knobHovered ? '#ffc860' : polishedBrass}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Rotating Knob Group */}
        <group ref={knobRef}>
          {/* Main heavy brass knob cylinder */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.35, 0.24, 28]} />
            <meshStandardMaterial
              color={knobHovered ? '#f0be60' : polishedBrass}
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>

          {/* Knurled grip flutes */}
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            return (
              <mesh
                key={`grip-${i}`}
                position={[Math.cos(a) * 0.33, Math.sin(a) * 0.33, 0.09]}
                rotation={[0, 0, a]}
              >
                <boxGeometry args={[0.025, 0.04, 0.22]} />
                <meshStandardMaterial color={darkBrass} metalness={0.8} roughness={0.4} />
              </mesh>
            );
          })}

          {/* Dark face disc */}
          <mesh position={[0, 0, 0.13]}>
            <circleGeometry args={[0.26, 24]} />
            <meshStandardMaterial color="#221810" roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Luminous indicator pointer notch */}
          <mesh position={[0, 0.17, 0.14]}>
            <boxGeometry args={[0.03, 0.16, 0.02]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* Brass Tuning Instruction Placard */}
      <group position={[0.75, -0.76, 0.72]}>
        <mesh>
          <planeGeometry args={[0.72, 0.16]} />
          <meshStandardMaterial color={polishedBrass} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[-0.26, 0, 0.01]}>
          <circleGeometry args={[0.02, 8]} />
          <meshBasicMaterial color="#1a1005" />
        </mesh>
        <mesh position={[0.26, 0, 0.01]}>
          <circleGeometry args={[0.02, 8]} />
          <meshBasicMaterial color="#1a1005" />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* 7. VOLUME / POWER KNOB (Left Side: Click to Mute)  */}
      {/* =================================================== */}
      <group
        position={[-0.8, -0.52, 0.77]}
        onClick={(e) => {
          e.stopPropagation();
          setInteracted();
          toggleMute();
        }}
        onPointerOver={() => {
          setVolumeHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setVolumeHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.27, 0.2, 20]} />
          <meshStandardMaterial
            color={volumeHovered ? '#ffc860' : polishedBrass}
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <circleGeometry args={[0.2, 20]} />
          <meshStandardMaterial color="#221810" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.12, 0.12]}>
          <circleGeometry args={[0.025, 10]} />
          <meshBasicMaterial color={isMuted ? '#888888' : '#33ff55'} toneMapped={false} />
        </mesh>
      </group>

      {/* Red Power Pilot Lamp */}
      <mesh position={[-1.25, -0.52, 0.72]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial color={isMuted ? '#662211' : '#ff3300'} toneMapped={false} />
      </mesh>

      {/* =================================================== */}
      {/* 8. GLOWING VACUUM TUBES (Mounted on top chassis)    */}
      {/* =================================================== */}
      <group position={[0, 1.05, -0.2]}>
        {[-0.55, 0.15, 0.75].map((xOffset, idx) => (
          <group key={`tube-${idx}`} position={[xOffset, 0, 0]}>
            {/* Bakelite socket */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.15, 0.1, 14]} />
              <meshStandardMaterial color="#1a1410" roughness={0.8} />
            </mesh>

            {/* Glass valve envelope */}
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.46, 14]} />
              <meshStandardMaterial
                color="#ffeecc"
                transparent
                opacity={0.35}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>
            {/* Dome cap */}
            <mesh position={[0, 0.51, 0]}>
              <sphereGeometry args={[0.12, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#ffeecc"
                transparent
                opacity={0.35}
                roughness={0.1}
              />
            </mesh>

            {/* Glowing Orange Filament */}
            <mesh position={[0, 0.26, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.28, 6]} />
              <meshBasicMaterial color="#ff7711" toneMapped={false} />
            </mesh>
          </group>
        ))}

        <pointLight
          ref={tubeLightRef}
          position={[0, 0.4, 0]}
          intensity={1.0}
          color="#ff7711"
          distance={3}
        />
      </group>

      {/* =================================================== */}
      {/* 9. FOUR TURNED BRASS BALL FEET                      */}
      {/* =================================================== */}
      {[
        [-1.4, -0.98, 0.45],
        [-1.4, -0.98, -0.45],
        [1.4, -0.98, 0.45],
        [1.4, -0.98, -0.45]
      ].map((pos, i) => (
        <mesh key={`foot-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={polishedBrass} metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
};
