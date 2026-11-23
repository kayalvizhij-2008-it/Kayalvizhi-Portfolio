import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotionPref } from '../hooks/useMedia';

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(max-width: 768px)');
    setM(q.matches);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    q.addEventListener('change', h);
    return () => q.removeEventListener('change', h);
  }, []);
  return m;
}

function FallingParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 12 - 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);
  const speeds = useMemo(() => Array.from({ length: count }, () => 0.002 + Math.random() * 0.006), [count]);
  const drifts = useMemo(() => Array.from({ length: count }, () => Math.random() * Math.PI * 2), [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i);
      y -= speeds[i];
      if (y < -6) y = 6;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + drifts[i]) * 0.0015);
    }
    pos.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#C9A96E"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.05;
    group.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });
  return (
    <group ref={group}>
      <mesh position={[3, 1, -4]}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.15} />
      </mesh>
      <mesh position={[-4, -1, -3]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color="#806B4C" transparent opacity={0.12} wireframe />
      </mesh>
      <mesh position={[0, 2, -6]}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.08} wireframe />
      </mesh>
    </group>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.4 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ count }: { count: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#C9A96E" />
      <FallingParticles count={count} />
      <FloatingShapes />
      <MouseParallax />
    </>
  );
}

export default function ParticleBackground() {
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (reduced) {
    return <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.08),transparent_60%)]" aria-hidden />;
  }

  const count = mobile ? 45 : 130;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
      {visible && (
        <Canvas
          dpr={[1, mobile ? 1.2 : 1.6]}
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        >
          <Scene count={count} />
        </Canvas>
      )}
    </div>
  );
}
