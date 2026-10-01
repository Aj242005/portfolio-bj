import { Component, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { STATIONS } from '../../data/stations';
import { useSignalStore } from '../../store/useSignalStore';
import { MobileFallback } from '../2d/MobileFallback';
import { PostProcessing } from './PostProcessing';

const MINT = '#a7edd1';
const COPPER = '#eaa57c';
const NODE_POSITIONS: [number, number, number][] = STATIONS.map((_, index) => {
  const angle = index / STATIONS.length * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(angle) * 3.35, 0.25 + Math.sin(index * 1.8) * 0.48, Math.sin(angle) * 2.8];
});
const glowVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const glowFragment = `varying vec2 vUv; uniform vec3 color; uniform float strength; void main(){float d=length(vUv-.5)*2.; float a=pow(max(0.,1.-d),3.)*strength; gl_FragColor=vec4(color,a);}`;

function Glow({ position, color = MINT, size = 1.4, strength = 0.28 }: { position: [number, number, number]; color?: string; size?: number; strength?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ color: { value: new THREE.Color(color) }, strength: { value: strength } }), [color, strength]);
  useFrame(({ camera }) => { ref.current?.quaternion.copy(camera.quaternion); });
  return <mesh ref={ref} position={position} renderOrder={2} raycast={() => null}><planeGeometry args={[size, size]} /><shaderMaterial vertexShader={glowVertex} fragmentShader={glowFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>;
}

function Connection({ position, active }: { position: [number, number, number]; active: boolean }) {
  const curve = useMemo(() => {
    const midpoint = new THREE.Vector3(position[0] * 0.45, 0.4 + position[1] * 0.5, position[2] * 0.45);
    return new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 1.5, 0), midpoint, new THREE.Vector3(...position));
  }, [position]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 28, active ? 0.011 : 0.004, 5, false), [curve, active]);
  const packet = useRef<THREE.Mesh>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    const state = useSignalStore.getState();
    if (packet.current && active && !state.reducedMotion && !state.motionPaused) {
      phase.current = (phase.current + Math.min(delta, 0.04) * 0.3) % 1;
      curve.getPoint(phase.current, packet.current.position);
    }
  });
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group><mesh geometry={geometry} raycast={() => null}><meshBasicMaterial color={active ? COPPER : '#3e7766'} transparent opacity={active ? 0.7 : 0.28} /></mesh>{active && <mesh ref={packet} position={[0, 1.5, 0]} raycast={() => null}><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color="#ffdbb8" /></mesh>}</group>;
}

function SignalNode({ index }: { index: number }) {
  const station = STATIONS[index];
  const active = useSignalStore((state) => state.lockedStation?.id === station.id);
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const position = NODE_POSITIONS[index];
  const color = active ? COPPER : MINT;
  const label = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.font = '19px monospace';
      context.textAlign = 'center';
      context.fillStyle = active ? COPPER : '#adc8b8';
      context.fillText(station.frequency.toFixed(1) + ' / ' + station.callsign, 128, 37);
    }
    return new THREE.CanvasTexture(canvas);
  }, [station, active]);
  useEffect(() => () => label.dispose(), [label]);
  useFrame((_, delta) => {
    if (group.current) {
      const motion = useSignalStore.getState();
      group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, active ? 1.2 : hovered ? 1.12 : 1, motion.reducedMotion ? 100 : 8, delta));
    }
  });
  return <group position={position}>
    <group ref={group} onClick={(event) => { event.stopPropagation(); useSignalStore.getState().jumpToStation(station.id); }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}>
      <mesh><octahedronGeometry args={[0.16, 0]} /><meshStandardMaterial color={active || hovered ? color : '#72a895'} emissive={color} emissiveIntensity={active ? 2 : hovered ? 1 : 0.18} metalness={0.65} roughness={0.22} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.28, 0.008, 5, 40]} /><meshBasicMaterial color={color} transparent opacity={active || hovered ? 0.9 : 0.38} /></mesh>
      <mesh><sphereGeometry args={[0.34, 12, 8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    </group>
    <Glow position={[0, 0, 0]} size={active ? 1.6 : 0.8} color={color} strength={active ? 0.5 : 0.2} />
    <sprite position={[0, -0.26, 0]} scale={[1.18, 0.295, 1]} raycast={() => null}><spriteMaterial map={label} transparent opacity={active || hovered ? 1 : 0.6} depthWrite={false} /></sprite>
    <mesh position={[0, -0.42, 0]}><cylinderGeometry args={[0.006, 0.006, 0.6, 5]} /><meshBasicMaterial color={color} transparent opacity={0.35} /></mesh>
  </group>;
}

function OrbitalRing({ radius, tilt, index }: { radius: number; tilt: [number, number, number]; index: number }) {
  const ring = useRef<THREE.Group>(null);
  const reduced = useSignalStore((state) => state.reducedMotion || state.motionPaused);
  const reference = useRef(0);
  useFrame((_, delta) => {
    if (!ring.current) return;
    const state = useSignalStore.getState();
    const target = (state.frequency - 88) / 20 * Math.PI * 0.75;
    reference.current = reduced ? target : THREE.MathUtils.damp(reference.current, target, 3.4, delta);
    ring.current.rotation.set(tilt[0] + reference.current * (index === 1 ? 0.35 : -0.2), tilt[1], tilt[2] + reference.current * (index === 0 ? 0.3 : -0.25));
  });
  return <group ref={ring} rotation={tilt}>
    <mesh><torusGeometry args={[radius, 0.042, 8, 144]} /><meshStandardMaterial color="#769b8e" metalness={0.88} roughness={0.28} /></mesh>
    <mesh><torusGeometry args={[radius - 0.058, 0.006, 5, 144]} /><meshBasicMaterial color={index === 1 ? COPPER : MINT} transparent opacity={0.85} /></mesh>
    {Array.from({ length: 48 }, (_, tick) => {
      const angle = tick / 48 * Math.PI * 2;
      return <mesh key={tick} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]}><boxGeometry args={[tick % 4 === 0 ? 0.09 : 0.045, 0.015, 0.055]} /><meshStandardMaterial color={tick % 4 === 0 ? '#bdd5c8' : '#527467'} metalness={0.7} roughness={0.35} /></mesh>;
    })}
    {[0, Math.PI].map((angle) => <group key={angle} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]}><mesh><boxGeometry args={[0.15, 0.24, 0.16]} /><meshStandardMaterial color="#263e34" metalness={0.8} roughness={0.3} /></mesh><mesh position={[0.082, 0, 0]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.06, 0.06, 0.032, 16]} /><meshStandardMaterial color={COPPER} metalness={0.78} roughness={0.25} /></mesh></group>)}
  </group>;
}

function Resonator() {
  const core = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Group>(null);
  const assembly = useRef<THREE.Group>(null);
  const activeId = useSignalStore((state) => state.lockedStation?.id);
  const drift = useRef(0);
  const tuned = useRef(useSignalStore.getState().frequency);
  useFrame(({ pointer }, delta) => {
    const state = useSignalStore.getState();
    const animated = !state.reducedMotion && !state.motionPaused;
    if (animated) drift.current += Math.min(delta, 0.04);
    tuned.current = animated ? THREE.MathUtils.damp(tuned.current, state.frequency, 4, delta) : state.frequency;
    if (core.current) {
      core.current.rotation.y = drift.current * 0.18 + (tuned.current - 88) * 0.12;
      core.current.position.y = animated ? Math.sin(drift.current * 1.1) * 0.045 : 0;
    }
    if (rotor.current) rotor.current.rotation.y = drift.current * -0.06;
    if (assembly.current) {
      assembly.current.rotation.z = THREE.MathUtils.damp(assembly.current.rotation.z, animated ? pointer.x * -0.035 : 0, 3, delta);
    }
  });
  return <group ref={assembly}>
    <group ref={rotor} position={[0, -0.68, 0]}>
      <mesh><cylinderGeometry args={[2.2, 2.32, 0.17, 96]} /><meshStandardMaterial color="#18352c" metalness={0.8} roughness={0.38} /></mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[2.18, 0.016, 6, 120]} /><meshBasicMaterial color="#76b79d" transparent opacity={0.6} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[1.58, 1.58, 0.065, 72]} /><meshStandardMaterial color="#0e241e" metalness={0.72} roughness={0.36} /></mesh>
      {Array.from({ length: 64 }, (_, index) => {
        const angle = index / 64 * Math.PI * 2;
        return <mesh key={index} position={[Math.cos(angle) * 1.98, 0.13, Math.sin(angle) * 1.98]} rotation={[0, -angle, 0]}><boxGeometry args={[0.1, 0.025, index % 8 === 0 ? 0.035 : 0.012]} /><meshBasicMaterial color={index % 8 === 0 ? COPPER : '#6d9986'} transparent opacity={0.65} /></mesh>;
      })}
    </group>
    <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.21, 0.43, 1.2, 32]} /><meshStandardMaterial color="#263f35" metalness={0.85} roughness={0.24} /></mesh>
    <mesh position={[0, 0.49, 0]}><cylinderGeometry args={[0.55, 0.3, 0.13, 48]} /><meshStandardMaterial color="#adc3b4" metalness={0.8} roughness={0.24} /></mesh>
    <mesh position={[0, 0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.45, 0.017, 6, 64]} /><meshBasicMaterial color={MINT} /></mesh>
    <group position={[0, 1.6, 0]}>
      <OrbitalRing radius={1.72} tilt={[0.4, 0.2, 0.3]} index={0} />
      <OrbitalRing radius={1.48} tilt={[1.15, -0.35, -0.55]} index={1} />
      <OrbitalRing radius={1.24} tilt={[-0.55, 0.8, 0.7]} index={2} />
      <group ref={core}>
        <mesh><icosahedronGeometry args={[0.68, 0]} /><meshPhysicalMaterial color="#6fc7a3" metalness={0.48} roughness={0.17} clearcoat={1} clearcoatRoughness={0.12} emissive="#4fa682" emissiveIntensity={0.48} flatShading /></mesh>
        <mesh scale={1.005}><icosahedronGeometry args={[0.68, 0]} /><meshBasicMaterial color="#c8ffe2" wireframe transparent opacity={0.58} /></mesh>
        <mesh rotation={[0.5, 0.4, 0.3]}><octahedronGeometry args={[0.9, 0]} /><meshBasicMaterial color={MINT} wireframe transparent opacity={0.12} /></mesh>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = index / 12 * Math.PI * 2;
          return <group key={index} position={[Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0]} rotation={[0, 0, angle]}><mesh><boxGeometry args={[0.07, 0.024, 0.14]} /><meshStandardMaterial color="#bdd5c8" metalness={0.75} roughness={0.3} /></mesh><mesh position={[0.04, 0, 0]}><sphereGeometry args={[0.017, 8, 6]} /><meshBasicMaterial color={MINT} /></mesh></group>;
        })}
      </group>
      <Glow position={[0, 0, 0]} size={3.5} strength={0.19} />
      <pointLight position={[0, 0.1, 0]} color={MINT} intensity={2.2} distance={4} />
    </group>
    {NODE_POSITIONS.map((position, index) => <Connection key={STATIONS[index].id} position={position} active={activeId === STATIONS[index].id} />)}
    {STATIONS.map((station, index) => <SignalNode key={station.id} index={index} />)}
    {[2.8, 3.65, 4.35].map((radius) => <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}><torusGeometry args={[radius, 0.006, 5, 120]} /><meshBasicMaterial color="#528d76" transparent opacity={radius === 2.8 ? 0.42 : 0.18} /></mesh>)}
  </group>;
}

function StarField() {
  const positions = useMemo(() => {
    const data = new Float32Array(180 * 3);
    for (let index = 0; index < 180; index++) {
      const random = (seed: number) => { const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
      data[index * 3] = (random(index + 1) - 0.5) * 40;
      data[index * 3 + 1] = random(index + 201) * 18 - 2;
      data[index * 3 + 2] = -6 - random(index + 401) * 22;
    }
    return data;
  }, []);
  return <points raycast={() => null}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.018} color="#aad4bf" transparent opacity={0.45} sizeAttenuation /></points>;
}

function CameraRig({ active }: { active: boolean }) {
  const { camera, gl, invalidate } = useThree();
  const reduced = useSignalStore((state) => state.reducedMotion || state.motionPaused);
  const drag = useRef(false);
  const previous = useRef(0);
  const orbit = useRef(0);
  const target = useRef(0);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0.95, 0), []);
  useEffect(() => {
    const element = gl.domElement;
    const down = (event: PointerEvent) => { drag.current = true; previous.current = event.clientX; };
    const move = (event: PointerEvent) => {
      if (!drag.current || reduced) return;
      target.current += (event.clientX - previous.current) * 0.005;
      previous.current = event.clientX;
      invalidate();
    };
    const up = () => { drag.current = false; };
    element.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    return () => {
      element.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
      document.body.style.cursor = '';
    };
  }, [gl, invalidate, reduced]);
  useEffect(() => {
    invalidate();
    return useSignalStore.subscribe(() => invalidate());
  }, [invalidate, active]);
  useFrame(({ pointer }, delta) => {
    orbit.current = reduced ? 0 : THREE.MathUtils.damp(orbit.current, target.current, 5, delta);
    const angle = 0.35 + orbit.current + (reduced ? 0 : pointer.x * 0.035);
    const distance = 10.5;
    camera.position.set(Math.sin(angle) * distance, 5.3 + (reduced ? 0 : pointer.y * 0.14), Math.cos(angle) * distance);
    camera.lookAt(lookAt);
  });
  return null;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { useSignalStore.getState().setViewMode('2d'); }
  render() { return this.state.failed ? <MobileFallback /> : this.props.children; }
}

export default function Scene() {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!document.hidden);
  const reduced = useSignalStore((state) => state.reducedMotion || state.motionPaused);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const visibility = () => setActive(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (container.current) observer.observe(container.current);
    return () => { document.removeEventListener('visibilitychange', visibility); observer.disconnect(); };
  }, []);
  return <div className="canvas-container" ref={container}><SceneBoundary><Canvas
    camera={{ position: [3.6, 5.3, 9.8], fov: 43, near: 0.1, far: 100 }}
    dpr={[1, 1.5]} frameloop={active && inView && !reduced ? 'always' : 'demand'}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
    fallback={<MobileFallback />}
    onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); useSignalStore.getState().setViewMode('2d'); }, { once: true }); }}>
      <fog attach="fog" args={['#081810', 10, 24]} />
      <ambientLight intensity={0.7} color="#b0d7c2" />
      <directionalLight position={[4, 7, 6]} intensity={3.1} color="#c4ffe1" />
      <directionalLight position={[-6, 3, -2]} intensity={2.5} color="#d89870" />
      <spotLight position={[0, 8, 3]} intensity={30} angle={0.5} penumbra={1} color="#9bd7bd" />
      <CameraRig active={active && inView} />
      <Suspense fallback={null}>
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={3} position={[0, 5, -5]} scale={[8, 4, 1]} color="#d3ffe3" />
          <Lightformer intensity={2} position={[5, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 7, 1]} color="#c7e7d6" />
          <Lightformer intensity={1.8} position={[-5, 0, -1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 6, 1]} color="#ba8e73" />
        </Environment>
        <Resonator />
        <StarField />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#020a06" metalness={0.08} roughness={0.95} /></mesh>
        <PostProcessing />
      </Suspense>
    </Canvas></SceneBoundary><span className="sr-only">Interconnected project nodes surround an orbiting proof core. Use the signal index or frequency tuner for keyboard navigation.</span></div>;
}
