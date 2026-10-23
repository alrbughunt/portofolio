import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, Lightformer, PerformanceMonitor, useProgress } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { achievements, certifications, sceneVisual, skills } from '../../constants';
import { useCanvasCapability } from '../../utils/useCanvasCapability';
import SceneBoundary from './SceneBoundary';

type GlobalSceneProps = {
  activeSection: string;
  selectedSkill: string | null;
  hoveredSkill: string | null;
  onSkillSelect: (id: string) => void;
  onSkillHover: (id: string | null) => void;
  hoveredExperience: number | null;
  hoveredAchievement: number | null;
  hoveredCertification: number | null;
  globeHovered: boolean;
};

type Anchor = { id: string; worldY: number; scrollY: number };

const SECTION_ANCHORS: Array<{ id: string; worldY: number }> = [
  { id: 'home', worldY: 0 },
  { id: 'about', worldY: -3.1 },
  { id: 'skills', worldY: -7.8 },
  { id: 'projects', worldY: -14.1 },
  { id: 'experience', worldY: -20.2 },
  { id: 'achievement', worldY: -26.2 },
  { id: 'certification', worldY: -30.7 },
  { id: 'contact', worldY: -36.1 },
];

const SKILL_FOCUS: Record<string, [number, number]> = {
  networking: [-1.35, 0.8],
  linux: [-0.45, 1.35],
  infrastructure: [0.75, 1.15],
  'cyber-security': [1.4, 0.1],
  monitoring: [0.95, -1.05],
  virtualization: [-0.1, -1.4],
  'fiber-optic': [-1.2, -0.9],
  'web-cms': [-1.45, -0.05],
};

const fogPalette = ['#07111f', '#08202a', '#091c2b', '#0b1728', '#0a2025', '#091623'].map((value) => new THREE.Color(value));
const cyan = new THREE.Color('#5de6d0');
const dimCyan = new THREE.Color('#174c50');
const amber = new THREE.Color('#e5b86b');
const dummy = new THREE.Object3D();
const tempColor = new THREE.Color();

function seeded(index: number, offset = 0) {
  const value = Math.sin((index + 1) * 127.1 + offset * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function interpolateAnchors(scrollY: number, anchors: Anchor[]) {
  if (!anchors.length) return 0;
  if (scrollY <= anchors[0].scrollY) return anchors[0].worldY;
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const start = anchors[index];
    const end = anchors[index + 1];
    if (scrollY <= end.scrollY) {
      const distance = Math.max(1, end.scrollY - start.scrollY);
      const amount = THREE.MathUtils.clamp((scrollY - start.scrollY) / distance, 0, 1);
      return THREE.MathUtils.lerp(start.worldY, end.worldY, amount);
    }
  }
  return anchors[anchors.length - 1].worldY;
}

function CameraRig({ selectedSkill }: { selectedSkill: string | null }) {
  const { camera, scene } = useThree();
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const anchorsRef = useRef<Anchor[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const introStartRef = useRef<number | null>(null);
  const fogTargetRef = useRef(new THREE.Color('#07111f'));

  useEffect(() => {
    const measure = () => {
      const viewportOffset = window.innerHeight * 0.42;
      anchorsRef.current = SECTION_ANCHORS.map((anchor) => {
        const element = document.getElementById(anchor.id);
        const top = element ? element.getBoundingClientRect().top + window.scrollY : 0;
        return { ...anchor, scrollY: Math.max(0, top - viewportOffset) };
      });
      updateScroll();
    };
    const updateScroll = () => {
      scrollYRef.current = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgressRef.current = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    };
    const updatePointer = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      pointerRef.current.y = (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    };
    measure();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (resizeObserver) resizeObserver.observe(document.body);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', updatePointer);
      resizeObserver?.disconnect();
    };
  }, []);

  useFrame((state, delta) => {
    if (introStartRef.current === null) introStartRef.current = state.clock.elapsedTime;
    const baseY = interpolateAnchors(scrollYRef.current, anchorsRef.current);
    const focus = selectedSkill ? SKILL_FOCUS[selectedSkill] : undefined;
    const targetX = pointerRef.current.x * 0.28 + (focus?.[0] ?? 0) * 0.42;
    const targetY = baseY - pointerRef.current.y * 0.12 + (focus?.[1] ?? 0) * 0.34;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.2, delta);
    const introProgress = THREE.MathUtils.clamp((state.clock.elapsedTime - introStartRef.current) / 1.75, 0, 1);
    const introEase = 1 - Math.pow(1 - introProgress, 3);
    camera.position.z = 14 - 5.5 * introEase + scrollProgressRef.current * 1.1;
    camera.lookAt(targetX * 0.18, targetY, 0);

    if (scene.fog instanceof THREE.Fog) {
      const colorPosition = scrollProgressRef.current * (fogPalette.length - 1);
      const colorIndex = Math.min(fogPalette.length - 2, Math.floor(colorPosition));
      const blend = colorPosition - colorIndex;
      fogTargetRef.current.copy(fogPalette[colorIndex]).lerp(fogPalette[colorIndex + 1], blend);
      scene.fog.color.lerp(fogTargetRef.current, 1 - Math.exp(-delta * 1.1));
    }
  });
  return null;
}


function SceneBand({ center, range = 5.5, children }: { center: number; range?: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (ref.current) ref.current.visible = Math.abs(camera.position.y - center) < range;
  });
  return <group ref={ref}>{children}</group>;
}

function StarLayer({ count, depth, parallax, seedOffset }: { count: number; depth: number; parallax: number; seedOffset: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const positions = useMemo(() => Array.from({ length: count }, (_, index) => new THREE.Vector3(
    (seeded(index, seedOffset) - 0.5) * 19,
    (seeded(index, seedOffset + 1) - 0.5) * 14,
    0,
  )), [count, seedOffset]);
  const geometry = useMemo(() => new THREE.SphereGeometry(depth === -5 ? 0.018 : 0.012, 5, 5), [depth]);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: depth === -5 ? '#8df7e6' : '#3faaa5', transparent: true, opacity: depth === -5 ? 0.8 : 0.48, toneMapped: false }), [depth]);
  const networkGeometry = useMemo(() => {
    const vertices: THREE.Vector3[] = [];
    for (let index = 0; index < positions.length; index += 1) {
      for (let next = index + 1; next < positions.length; next += 1) {
        if (positions[index].distanceTo(positions[next]) < 1.65 && seeded(index + next, seedOffset + 9) > 0.58) {
          vertices.push(positions[index], positions[next]);
          if (vertices.length >= 44) break;
        }
      }
      if (vertices.length >= 44) break;
    }
    return new THREE.BufferGeometry().setFromPoints(vertices);
  }, [positions, seedOffset]);
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    positions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.scale.setScalar(0.6 + seeded(index, seedOffset + 3) * 1.1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return () => {
      geometry.dispose();
      material.dispose();
      networkGeometry.dispose();
    };
  }, [positions, geometry, material, networkGeometry, seedOffset]);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = camera.position.x * parallax;
      groupRef.current.position.y = camera.position.y * parallax;
    }
  });
  return (
    <group ref={groupRef} position={[0, 0, depth]}>
      <lineSegments geometry={networkGeometry}>
        <lineBasicMaterial color="#2a938f" transparent opacity={0.18} toneMapped={false} />
      </lineSegments>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
    </group>
  );
}

function StarField({ lowQuality }: { lowQuality: boolean }) {
  return (
    <>
      <StarLayer count={lowQuality ? 34 : 76} depth={-5} parallax={0.11} seedOffset={1} />
      <StarLayer count={lowQuality ? 46 : 108} depth={-9} parallax={0.07} seedOffset={11} />
      <StarLayer count={lowQuality ? 62 : 146} depth={-14} parallax={0.035} seedOffset={27} />
    </>
  );
}

function HoloGrid() {
  const gridRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 transformed = position;
        transformed.z += sin(position.x * 1.8 + uTime * 0.65) * 0.018;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 gridUv = vUv * vec2(34.0, 24.0);
        vec2 lineDist = min(fract(gridUv), 1.0 - fract(gridUv));
        float grid = 1.0 - smoothstep(0.018, 0.055, min(lineDist.x, lineDist.y));
        float wave = 0.5 + 0.5 * sin(vUv.x * 20.0 - uTime * 0.8 + sin(vUv.y * 8.0) * 0.7);
        float edgeFade = smoothstep(0.0, 0.18, vUv.y) * (1.0 - smoothstep(0.68, 1.0, vUv.y));
        float alpha = (grid * 0.19 + wave * 0.035) * edgeFade;
        gl_FragColor = vec4(0.16, 0.88, 0.78, alpha);
      }
    `,
  }), []);
  const { camera } = useThree();
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (gridRef.current) {
      gridRef.current.position.x = camera.position.x * 0.3;
      gridRef.current.position.y = camera.position.y * 0.22;
    }
  });
  return (
    <mesh ref={gridRef} position={[0, 0, -3.8]}>
      <planeGeometry args={[22, 16, 36, 24]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function TerminalTextureMaterial() {
  const lastDraw = useRef(0);
  const { camera } = useThree();
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, texture };
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((state) => {
    if (Math.abs(camera.position.y) > 6 || state.clock.elapsedTime - lastDraw.current < 0.075) return;
    lastDraw.current = state.clock.elapsedTime;
    const context = canvas.getContext('2d');
    if (!context) return;
    const commands = sceneVisual.terminalCommands;
    const cycle = 4.2;
    const commandIndex = Math.floor(state.clock.elapsedTime / cycle) % commands.length;
    const cycleTime = state.clock.elapsedTime % cycle;
    const typedCount = Math.max(0, Math.floor((cycleTime - 0.45) * 25));
    const command = commands[commandIndex].slice(0, typedCount);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#06131b';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#112b36';
    context.fillRect(0, 0, canvas.width, 42);
    ['#f0bf6b', '#5de6d0', '#64899a'].forEach((color, index) => {
      context.beginPath();
      context.fillStyle = color;
      context.arc(22 + index * 21, 21, 5, 0, Math.PI * 2);
      context.fill();
    });
    context.fillStyle = '#9bb5c1';
    context.font = '600 15px monospace';
    context.fillText(sceneVisual.terminalTitle, 292, 26);
    context.fillStyle = '#5de6d0';
    context.font = '19px monospace';
    context.fillText('root@noc:~$', 20, 92);
    context.fillStyle = '#e5f5f4';
    context.fillText(command, 154, 92);
    if (cycleTime % 1 < 0.5) {
      context.fillStyle = '#a7fff1';
      context.fillRect(Math.min(492, 160 + command.length * 11), 74, 3, 23);
    }
    context.fillStyle = '#6f909f';
    context.font = '14px monospace';
    context.fillText('INTERFACE   STATUS', 20, 147);
    context.fillStyle = '#2b555d';
    context.fillRect(20, 162, 470, 2);
    context.fillStyle = '#a0f5df';
    context.fillText('eth0         UP', 20, 194);
    context.fillStyle = '#e5bd76';
    context.fillText('wazuh-agent  ACTIVE', 20, 226);
    context.fillStyle = '#6f909f';
    context.fillText('PACKET FLOW', 20, 272);
    for (let index = 0; index < 14; index += 1) {
      const barHeight = 7 + ((index * 13 + Math.floor(state.clock.elapsedTime * 5)) % 19);
      context.fillStyle = index % 5 === 0 ? '#d9b36e' : '#4cbaaa';
      context.fillRect(145 + index * 24, 285 - barHeight, 12, barHeight);
    }
    texture.needsUpdate = true;
  });
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}

function LedBank() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const positions = useMemo(() => {
    const result: THREE.Vector3[] = [];
    const levels = [-1.55, -0.93, -0.31, 0.31, 0.93, 1.55];
    levels.forEach((y) => {
      result.push(new THREE.Vector3(2.16, y - 0.08, 0.53));
      result.push(new THREE.Vector3(2.03, y - 0.08, 0.53));
      result.push(new THREE.Vector3(1.9, y - 0.08, 0.53));
    });
    return result;
  }, []);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.028, 8, 8), []);
  const material = useMemo(() => {
    const ledMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.8, toneMapped: false });
    ledMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= vColor;');
    };
    ledMaterial.customProgramCacheKey = () => 'instanced-led-emissive-color-v1';
    return ledMaterial;
  }, []);
  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.scale.setScalar(index % 3 === 0 ? 1.15 : 0.85);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
      meshRef.current?.setColorAt(index, index % 7 === 0 ? amber : cyan);
    });
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [positions]);
  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || Math.abs(camera.position.y) > 6) return;
    positions.forEach((position, index) => {
      const signal = Math.sin(state.clock.elapsedTime * (1.15 + (index % 5) * 0.31) + index * 1.73);
      const booting = state.clock.elapsedTime < 1.7;
      const startupLit = index < (state.clock.elapsedTime / 1.7) * positions.length;
      const lit = booting ? startupLit : signal > (index % 4 === 0 ? -0.08 : 0.3);
      const warning = index % 7 === 0 && Math.sin(state.clock.elapsedTime * 0.7 + index) > 0.25;
      dummy.position.copy(position);
      dummy.scale.setScalar(lit ? (index % 3 === 0 ? 1.15 : 0.85) : 0.12);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      tempColor.copy(warning ? amber : lit ? cyan : dimCyan);
      mesh.setColorAt(index, tempColor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });
  return <instancedMesh ref={meshRef} args={[geometry, material, positions.length]} frustumCulled={false} />;
}

function DataPackets({ lowQuality }: { lowQuality: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const curves = useMemo(() => [
    new THREE.CatmullRomCurve3([new THREE.Vector3(-1.65, 0.55, 0.05), new THREE.Vector3(-0.75, 1.12, 0.22), new THREE.Vector3(0.12, 1.45, 0.12), new THREE.Vector3(0.62, 1.18, 0.15)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(-1.55, -0.15, 0.02), new THREE.Vector3(-0.7, -0.75, 0.25), new THREE.Vector3(0.25, -0.9, 0.16), new THREE.Vector3(0.7, -0.6, 0.14)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(-1.45, 0.05, 0.12), new THREE.Vector3(-0.65, 0.3, 0.3), new THREE.Vector3(0.05, 0.08, 0.28), new THREE.Vector3(0.75, 0.32, 0.2)]),
  ], []);
  const tubes = useMemo(() => curves.map((curve) => new THREE.TubeGeometry(curve, 36, 0.012, 5, false)), [curves]);
  const packets = useMemo(() => Array.from({ length: lowQuality ? 9 : 18 }, (_, index) => ({ curve: index % curves.length, offset: seeded(index, 55), speed: 0.08 + seeded(index, 72) * 0.18 })), [curves.length, lowQuality]);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.045, 7, 7), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#a5fff2', toneMapped: false }), []);
  useEffect(() => () => tubes.forEach((tube) => tube.dispose()), [tubes]);
  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || Math.abs(camera.position.y) > 6) return;
    packets.forEach((packet, index) => {
      const t = (state.clock.elapsedTime * packet.speed + packet.offset) % 1;
      const point = curves[packet.curve].getPointAt(t);
      dummy.position.copy(point);
      dummy.scale.setScalar(0.6 + 0.4 * Math.sin(t * Math.PI));
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[0.9, 0, 0]}>
      {tubes.map((tube, index) => <mesh key={index} geometry={tube}><meshStandardMaterial color="#226d70" emissive="#36d9c4" emissiveIntensity={0.65} roughness={0.34} metalness={0.45} toneMapped={false} /></mesh>)}
      <instancedMesh ref={meshRef} args={[geometry, material, packets.length]} frustumCulled={false} />
    </group>
  );
}

function VentBank() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const result: THREE.Vector3[] = [];
    [-1.55, -0.93, -0.31, 0.31, 0.93, 1.55].forEach((y) => {
      for (let index = 0; index < 6; index += 1) {
        result.push(new THREE.Vector3(1.45 - 0.73 + index * 0.14, y + 0.015, 0.35));
      }
    });
    return result;
  }, []);
  const geometry = useMemo(() => new THREE.BoxGeometry(0.045, 0.16, 0.008), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#355365', metalness: 0.45, roughness: 0.35 }), []);
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    positions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return () => { geometry.dispose(); material.dispose(); };
  }, [positions, geometry, material]);
  return <instancedMesh ref={meshRef} args={[geometry, material, positions.length]} frustumCulled={false} />;
}

function ServerRackScene({ lowQuality }: { lowQuality: boolean }) {
  const rackRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame((state, delta) => {
    if (Math.abs(camera.position.y) > 6) return;
    if (rackRef.current) {
      rackRef.current.rotation.y = THREE.MathUtils.damp(rackRef.current.rotation.y, -0.1 + Math.sin(state.clock.elapsedTime * 0.18) * 0.035, 1.5, delta);
      rackRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.48) * 0.025;
    }
  });
  const levels = [-1.55, -0.93, -0.31, 0.31, 0.93, 1.55];
  return (
    <SceneBand center={0} range={5.8}>
    <group>
      <group ref={rackRef} position={[0.9, 0, 0]}>

        <mesh position={[1.45, 0, -0.2]} castShadow={!lowQuality}>
          <boxGeometry args={[2.58, 4.22, 0.82]} />
          <meshPhysicalMaterial color="#0a1725" metalness={0.76} roughness={0.31} clearcoat={0.5} clearcoatRoughness={0.32} />
        </mesh>
        {[0.16, 2.74].map((x) => <mesh key={x} position={[x, 0, 0.28]}><boxGeometry args={[0.08, 4.35, 0.1]} /><meshStandardMaterial color="#344d60" metalness={0.82} roughness={0.24} /></mesh>)}
        {levels.map((y, index) => (
          <group key={y} position={[1.45, y, 0.1]}>
            <mesh castShadow={!lowQuality}>
              <boxGeometry args={[2.12, 0.5, 0.64]} />
              <meshStandardMaterial color={index % 2 ? '#172a3a' : '#1b3042'} metalness={0.66} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0, 0.331]}>
              <boxGeometry args={[1.98, 0.39, 0.025]} />
              <meshStandardMaterial color="#08131e" metalness={0.36} roughness={0.47} />
            </mesh>
            <mesh position={[-0.25, -0.13, 0.35]}>
              <boxGeometry args={[0.48, 0.025, 0.012]} />
              <meshBasicMaterial color="#345565" />
            </mesh>
          </group>
        ))}
        <mesh position={[1.45, -2.2, -0.15]}><boxGeometry args={[2.85, 0.1, 1.02]} /><meshStandardMaterial color="#172a3a" metalness={0.8} roughness={0.26} /></mesh>
        <mesh position={[1.45, 2.2, -0.15]}><boxGeometry args={[2.85, 0.1, 1.02]} /><meshStandardMaterial color="#172a3a" metalness={0.8} roughness={0.26} /></mesh>
        <LedBank />
        <VentBank />
      </group>
      <group position={[0.1, 0.5, 0.06]} rotation={[0, 0.055, 0]}>
        <mesh castShadow={!lowQuality}>
          <boxGeometry args={[2.18, 1.54, 0.14]} />
          <meshPhysicalMaterial color="#132638" metalness={0.72} roughness={0.3} clearcoat={0.65} />
        </mesh>
        <mesh position={[0, 0, 0.078]}>
          <planeGeometry args={[2.02, 1.38]} />
          <TerminalTextureMaterial />
        </mesh>
        <mesh position={[0, -0.91, -0.05]}><boxGeometry args={[0.38, 0.27, 0.14]} /><meshStandardMaterial color="#213b4e" metalness={0.7} roughness={0.32} /></mesh>
        <mesh position={[0, -1.08, -0.02]}><boxGeometry args={[1.2, 0.07, 0.32]} /><meshStandardMaterial color="#2b465a" metalness={0.75} roughness={0.28} /></mesh>
      </group>
      <DataPackets lowQuality={lowQuality} />
      {!lowQuality ? <ContactShadows position={[2, -2.3, -0.4]} opacity={0.38} scale={6.5} blur={2.8} far={3.5} resolution={128} frames={1} color="#06111b" /> : null}
    </group>
    </SceneBand>
  );
}

function CategoryNode({ position, label, id, selected, hovered, onHover, onSelect }: {
  position: [number, number, number]; label: string; id: string; selected: boolean; hovered: boolean;
  onHover: (id: string | null) => void; onSelect: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { camera } = useThree();
  useFrame((state, delta) => {
    if (Math.abs(camera.position.y + 7.8) > 6 || !ref.current || !materialRef.current) return;
    const active = selected || hovered;
    const targetScale = active ? 1.2 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, targetScale + Math.sin(state.clock.elapsedTime * 1.8 + position[0]) * 0.025, 5, delta));
    materialRef.current.emissiveIntensity = THREE.MathUtils.damp(materialRef.current.emissiveIntensity, active ? 2.5 : 0.72, 5, delta);
  });
  return (
    <group position={position}>
      <mesh ref={ref} onPointerOver={(event) => { event.stopPropagation(); onHover(id); }} onPointerOut={() => onHover(null)} onClick={(event) => { event.stopPropagation(); onSelect(id); }}>
        <icosahedronGeometry args={[0.23, 2]} />
        <meshStandardMaterial ref={materialRef} color={selected ? '#b0fff3' : '#1a5860'} emissive="#4ee7d1" emissiveIntensity={0.72} metalness={0.55} roughness={0.22} toneMapped={false} />
      </mesh>
      <Html position={[0, 0.34, 0]} center distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <span className={`scene-skill-label${selected || hovered ? ' is-active' : ''}`}>{label}</span>
      </Html>
    </group>
  );
}

function SkillsGraph({ lowQuality, selectedSkill, hoveredSkill, onHover, onSelect }: {
  lowQuality: boolean; selectedSkill: string | null; hoveredSkill: string | null;
  onHover: (id: string | null) => void; onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const categories = useMemo(() => skills.map((skill, index) => {
    const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2;
    return { ...skill, position: [Math.cos(angle) * 1.32, Math.sin(angle) * 1.32, 0.05] as [number, number, number] };
  }), []);
  const skillPositions = useMemo(() => {
    const points: THREE.Vector3[] = [];
    categories.forEach((category, categoryIndex) => {
      category.items.forEach((_, itemIndex) => {
        const angle = (itemIndex / Math.max(1, category.items.length)) * Math.PI * 2 + categoryIndex * 0.42;
        const radius = 0.38 + (itemIndex % 3) * 0.09;
        points.push(new THREE.Vector3(category.position[0] + Math.cos(angle) * radius, category.position[1] + Math.sin(angle) * radius, -0.06 + (itemIndex % 2) * 0.04));
      });
    });
    return points;
  }, [categories]);
  const connectionGroups = useMemo(() => {
    let cursor = 0;
    return categories.map((category) => {
      const vertices: THREE.Vector3[] = [];
      const center = new THREE.Vector3(...category.position);
      category.items.forEach(() => {
        vertices.push(center, skillPositions[cursor]);
        cursor += 1;
      });
      return { id: category.id, geometry: new THREE.BufferGeometry().setFromPoints(vertices) };
    });
  }, [categories, skillPositions]);
  const pulsePaths = useMemo(() => {
    let cursor = 0;
    return categories.flatMap((category) => {
      const start = new THREE.Vector3(...category.position);
      return category.items.map(() => ({ start, end: skillPositions[cursor++], owner: category.id }));
    });
  }, [categories, skillPositions]);
  const pulses = useMemo(() => Array.from({ length: lowQuality ? 18 : 36 }, (_, index) => ({
    pathIndex: index % pulsePaths.length,
    offset: seeded(index, 115),
    speed: 0.18 + seeded(index, 116) * 0.32,
  })), [lowQuality, pulsePaths.length]);
  const pulseGeometry = useMemo(() => new THREE.SphereGeometry(0.047, 7, 7), []);
  const pulseMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), []);
  const pulseRef = useRef<THREE.InstancedMesh>(null);
  const smallGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 6, 6), []);
  const smallMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), []);
  const smallNodesRef = useRef<THREE.InstancedMesh>(null);
  const lineMaterialRefs = useRef<Record<string, THREE.LineBasicMaterial | null>>({});
  const skillNodeOwners = useMemo(() => categories.flatMap((category) => category.items.map(() => category.id)), [categories]);
  useEffect(() => {
    if (!smallNodesRef.current) return;
    skillPositions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.scale.setScalar(lowQuality ? 0.75 : 1);
      dummy.updateMatrix();
      smallNodesRef.current?.setMatrixAt(index, dummy.matrix);
      const active = skillNodeOwners[index] === selectedSkill || skillNodeOwners[index] === hoveredSkill;
      smallNodesRef.current?.setColorAt(index, active ? cyan : dimCyan);
    });
    if (smallNodesRef.current) {
      smallNodesRef.current.instanceMatrix.needsUpdate = true;
      if (smallNodesRef.current.instanceColor) smallNodesRef.current.instanceColor.needsUpdate = true;
    }
  }, [skillPositions, lowQuality, skillNodeOwners, selectedSkill, hoveredSkill]);
  useEffect(() => () => connectionGroups.forEach((connection) => connection.geometry.dispose()), [connectionGroups]);
  useFrame((state) => {
    if (Math.abs(camera.position.y + 7.8) > 6) return;
    if (groupRef.current) {
      const idle = selectedSkill ? 0.018 : 0.055;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.18) * idle;
      groupRef.current.position.x = 1.35 + Math.sin(state.clock.elapsedTime * 0.32) * 0.045;
    }
    const pulseMesh = pulseRef.current;
    if (pulseMesh) {
      pulses.forEach((pulse, index) => {
        const path = pulsePaths[pulse.pathIndex];
        const t = (state.clock.elapsedTime * pulse.speed + pulse.offset) % 1;
        dummy.position.copy(path.start).lerp(path.end, t);
        dummy.scale.setScalar(0.68 + Math.sin(t * Math.PI) * 0.5);
        dummy.updateMatrix();
        pulseMesh.setMatrixAt(index, dummy.matrix);
        tempColor.copy(path.owner === selectedSkill || path.owner === hoveredSkill ? cyan : dimCyan);
        pulseMesh.setColorAt(index, tempColor);
      });
      pulseMesh.instanceMatrix.needsUpdate = true;
      if (pulseMesh.instanceColor) pulseMesh.instanceColor.needsUpdate = true;
    }
    connectionGroups.forEach((connection) => {
      const material = lineMaterialRefs.current[connection.id];
      if (!material) return;
      const active = connection.id === selectedSkill || connection.id === hoveredSkill;
      material.color.copy(active ? cyan : dimCyan);
      material.opacity = active ? 0.68 + (Math.sin(state.clock.elapsedTime * 2.6) + 1) * 0.12 : 0.13 + (Math.sin(state.clock.elapsedTime * 2.1) + 1) * 0.045;
    });
  });
  return (
    <SceneBand center={-7.8} range={5.6}>
    <group ref={groupRef} position={[1.35, -7.8, 0]}>
      <mesh position={[0, 0, -0.18]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color="#102f3d" emissive="#4ee7d1" emissiveIntensity={1.4} metalness={0.68} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.14]}>
        <torusGeometry args={[0.39, 0.008, 5, 64]} />
        <meshBasicMaterial color="#56e9d2" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      {connectionGroups.map((connection) => (
        <lineSegments key={connection.id} geometry={connection.geometry}>
          <lineBasicMaterial ref={(material) => { lineMaterialRefs.current[connection.id] = material; }} color="#174c50" transparent opacity={0.18} toneMapped={false} />
        </lineSegments>
      ))}
      <instancedMesh ref={smallNodesRef} args={[smallGeometry, smallMaterial, skillPositions.length]} frustumCulled={false} />
      <instancedMesh ref={pulseRef} args={[pulseGeometry, pulseMaterial, pulses.length]} frustumCulled={false} />
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          position={category.position}
          id={category.id}
          label={category.title}
          selected={selectedSkill === category.id}
          hovered={hoveredSkill === category.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
    </SceneBand>
  );
}

function ProjectScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame((state, delta) => {
    if (Math.abs(camera.position.y + 14.1) > 6 || !groupRef.current) return;
    groupRef.current.position.y = -14.1 + Math.sin(state.clock.elapsedTime * 0.52) * 0.045;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, Math.sin(state.clock.elapsedTime * 0.16) * 0.045, 1.8, delta);
  });
  return (
    <SceneBand center={-14.1} range={5.6}>
    <group ref={groupRef} position={[1.7, -14.1, 0]}>
      {[-1, 0, 1].map((index) => (
        <group key={index} position={[index * 0.62, index === 0 ? 0.08 : index * 0.18, index === 0 ? 0.18 : -0.18]} rotation={[0.03, index * -0.14, index * -0.04]}>
          <mesh>
            <boxGeometry args={[1.05, 1.34, 0.06]} />
            <meshPhysicalMaterial color="#0e2434" metalness={0.64} roughness={0.3} clearcoat={0.6} />
          </mesh>
          <mesh position={[0, 0.37, 0.04]}>
            <boxGeometry args={[0.72, 0.035, 0.01]} />
            <meshBasicMaterial color="#5de6d0" toneMapped={false} />
          </mesh>
          {[-0.1, -0.22, -0.34, -0.46].map((y, row) => (
            <mesh key={row} position={[-0.08, y, 0.04]}>
              <boxGeometry args={[0.62 - (row % 2) * 0.15, 0.018, 0.01]} />
              <meshBasicMaterial color={row === 1 ? '#d8ad66' : '#2d6874'} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, -0.94, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.012, 5, 80]} />
        <meshBasicMaterial color="#37bdb1" transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
    </SceneBand>
  );
}

function TimelineScene({ hoveredExperience }: { hoveredExperience: number | null }) {
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const nodeMaterialRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const { camera } = useThree();
  const nodeOffsets = [2.05, 1.35, 0.65, -0.05, -0.75, -1.45, -2.15];
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.42, 2.35, -0.1), new THREE.Vector3(1.92, 1.55, 0.12), new THREE.Vector3(1.42, 0.72, 0.18),
    new THREE.Vector3(1.86, -0.06, 0.1), new THREE.Vector3(1.38, -0.84, 0.12), new THREE.Vector3(1.82, -1.65, 0.05), new THREE.Vector3(1.46, -2.42, -0.08),
  ]), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 96, 0.018, 6, false), [curve]);
  useEffect(() => () => tube.dispose(), [tube]);
  useFrame((state) => {
    if (Math.abs(camera.position.y + 20.2) > 6) return;
    nodeOffsets.forEach((offset, index) => {
      const node = nodeRefs.current[index];
      const material = nodeMaterialRefs.current[index];
      if (!node || !material) return;
      const closeToCamera = Math.abs(camera.position.y - (-20.2 + offset)) < 1.15;
      const active = hoveredExperience === index || closeToCamera;
      const pulse = Math.sin(state.clock.elapsedTime * 2.1 + index) * 0.04;
      node.scale.setScalar((active ? 1.28 : 0.94) + pulse);
      material.emissiveIntensity = active ? 2.3 : 0.55;
      material.color.copy(active ? cyan : dimCyan);
    });
  });
  return (
    <SceneBand center={-20.2} range={5.7}>
    <group position={[0, -20.2, 0]}>
      <mesh geometry={tube}><meshStandardMaterial color="#226d70" emissive="#42e2cc" emissiveIntensity={1.05} metalness={0.5} roughness={0.3} toneMapped={false} /></mesh>
      {nodeOffsets.map((offset, index) => (
        <group key={index} position={[index % 2 === 0 ? 1.42 : 1.86, offset, 0.16]}>
          <mesh ref={(element) => { nodeRefs.current[index] = element; }}>
            <icosahedronGeometry args={[0.105, 1]} />
            <meshStandardMaterial ref={(element) => { nodeMaterialRefs.current[index] = element; }} color="#174c50" emissive="#42e2cc" emissiveIntensity={0.55} metalness={0.45} roughness={0.28} toneMapped={false} />
          </mesh>
          {index === 2 ? <FiberOpticMark /> : null}
        </group>
      ))}
      <LksBurst />
    </group>
    </SceneBand>
  );
}

function FiberOpticMark() {
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  useFrame((state) => {
    if (Math.abs(camera.position.y + 20.2) > 6 || !ringRef.current) return;
    const pulse = 1 + (Math.sin(state.clock.elapsedTime * 3.1) + 1) * 0.1;
    ringRef.current.scale.setScalar(pulse);
  });
  return (
    <group position={[0.2, 0.04, 0.08]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.14, 0.014, 6, 28]} />
        <meshBasicMaterial color="#9efff1" toneMapped={false} />
      </mesh>
      <mesh position={[-0.1, 0.09, 0]}><sphereGeometry args={[0.025, 6, 6]} /><meshBasicMaterial color="#9efff1" toneMapped={false} /></mesh>
      <mesh position={[0.1, -0.09, 0]}><sphereGeometry args={[0.025, 6, 6]} /><meshBasicMaterial color="#9efff1" toneMapped={false} /></mesh>
    </group>
  );
}

function LksBurst() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const startedAt = useRef<number | null>(null);
  const hasStarted = useRef(false);
  const { camera } = useThree();
  const directions = useMemo(() => Array.from({ length: 16 }, (_, index) => new THREE.Vector3(
    Math.cos((index / 16) * Math.PI * 2) * (0.2 + seeded(index, 1) * 0.42),
    Math.sin((index / 16) * Math.PI * 2) * (0.2 + seeded(index, 2) * 0.42),
    (seeded(index, 3) - 0.5) * 0.45,
  )), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.018, 5, 5), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f1c879', toneMapped: false }), []);
  useFrame((state) => {
    const distance = Math.abs(camera.position.y - -20.25);
    if (distance < 0.8 && !hasStarted.current) {
      startedAt.current = state.clock.elapsedTime;
      hasStarted.current = true;
    }
    if (!meshRef.current || startedAt.current === null) return;
    const age = state.clock.elapsedTime - startedAt.current;
    directions.forEach((direction, index) => {
      const amount = Math.min(age / 1.25, 1);
      dummy.position.set(1.65 + direction.x * amount * 1.9, -0.05 + direction.y * amount * 1.9, 0.16 + direction.z * amount * 1.9);
      dummy.scale.setScalar(age < 1.25 ? (1 - amount) * (0.65 + seeded(index, 7) * 0.7) : 0);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={meshRef} args={[geometry, material, directions.length]} frustumCulled={false} />;
}

function Medal({ position, label, index, active, sceneY }: { position: [number, number, number]; label: string; index: number; active: boolean; sceneY: number }) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame((state, delta) => {
    if (Math.abs(camera.position.y - sceneY) > 6 || !ref.current) return;
    const target = active ? 0.28 : Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.04;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, target, active ? 5 : 1.8, delta);
    ref.current.scale.setScalar(1 + (active ? 0.08 : Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.015));
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.105, 8, 1]} />
        <meshPhysicalMaterial color={index === 0 ? '#8d7950' : '#1d5154'} metalness={0.86} roughness={0.23} clearcoat={0.75} emissive={active ? '#36d8c3' : '#123a3b'} emissiveIntensity={active ? 1.5 : 0.4} />
      </mesh>
      <mesh position={[0, 0, 0.061]}>
        <torusGeometry args={[0.27, 0.018, 6, 28]} />
        <meshStandardMaterial color={index === 0 ? '#e6c77e' : '#63dcca'} metalness={0.9} roughness={0.2} emissive="#2f9d91" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <Html position={[0, 0, 0.07]} center transform distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <span className="scene-medal-label" aria-hidden="true">{label}</span>
      </Html>
    </group>
  );
}

function AchievementScene({ hoveredAchievement, hoveredCertification }: { hoveredAchievement: number | null; hoveredCertification: number | null }) {
  return (
    <>
      <SceneBand center={-26.2} range={5.2}>
      <group position={[0, -26.2, 0]}>
        {achievements.map((item, index) => (
          <Medal key={item.title} index={index} label={`0${index + 1}`} active={hoveredAchievement === index} sceneY={-26.2} position={[0.75 + (index % 3) * 0.76, 0.8 - Math.floor(index / 3) * 1.15, 0.12]} />
        ))}
        <mesh position={[1.5, -0.18, -0.3]}>
          <torusGeometry args={[2.0, 0.009, 4, 96]} />
          <meshBasicMaterial color="#328f89" transparent opacity={0.32} toneMapped={false} />
        </mesh>
      </group>
      </SceneBand>
      <SceneBand center={-30.7} range={5.2}>
      <group position={[0, -30.7, 0]}>
        {certifications.map((item, index) => (
          <Medal key={item.title} index={index + 7} label={`C${index + 1}`} active={hoveredCertification === index} sceneY={-30.7} position={[0.9 + index * 0.74, Math.sin(index * 1.4) * 0.38, 0.12]} />
        ))}
      </group>
      </SceneBand>
    </>
  );
}

function fibonacciPoints(count: number, radius: number) {
  const result: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * index;
    result.push(new THREE.Vector3(Math.cos(theta) * radiusAtY * radius, y * radius, Math.sin(theta) * radiusAtY * radius));
  }
  return result;
}

function GlobeScene({ lowQuality, hovered }: { lowQuality: boolean; hovered: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const ringsRef = useRef<THREE.Group>(null);
  const count = lowQuality ? 170 : 360;
  const points = useMemo(() => fibonacciPoints(count, 1.18), [count]);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.021, 5, 5), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#6df5df', emissive: '#39e1c9', emissiveIntensity: 1.1, roughness: 0.32, metalness: 0.24, toneMapped: false }), []);
  const source = useMemo(() => new THREE.Vector3(0.12, -0.1, 1.18), []);
  const targets = useMemo(() => [
    new THREE.Vector3(0.78, 0.43, 0.72).normalize().multiplyScalar(1.18),
    new THREE.Vector3(-0.82, 0.3, 0.62).normalize().multiplyScalar(1.18),
    new THREE.Vector3(0.42, -0.83, 0.62).normalize().multiplyScalar(1.18),
    new THREE.Vector3(-0.62, -0.64, 0.72).normalize().multiplyScalar(1.18),
    new THREE.Vector3(0.05, 0.92, 0.74).normalize().multiplyScalar(1.18),
  ], []);
  const arcCurves = useMemo(() => targets.map((target, index) => {
    const middle = source.clone().lerp(target, 0.5);
    middle.z += 0.5 + index % 2 * 0.13;
    return new THREE.CatmullRomCurve3([source, middle, target]);
  }), [source, targets]);
  const arcs = useMemo(() => arcCurves.map((curve) => new THREE.TubeGeometry(curve, 32, 0.009, 5, false)), [arcCurves]);
  const globePulses = useMemo(() => Array.from({ length: lowQuality ? 7 : 14 }, (_, index) => ({
    curveIndex: index % arcCurves.length,
    offset: seeded(index, 191),
    speed: 0.12 + seeded(index, 192) * 0.22,
  })), [arcCurves.length, lowQuality]);
  const globePulseRef = useRef<THREE.InstancedMesh>(null);
  const globePulseGeometry = useMemo(() => new THREE.SphereGeometry(0.028, 6, 6), []);
  const globePulseMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#b8fff5', toneMapped: false }), []);
  useEffect(() => {
    if (!pointsRef.current) return;
    points.forEach((point, index) => {
      dummy.position.copy(point);
      dummy.scale.setScalar(index % 7 === 0 ? 1.4 : 1);
      dummy.updateMatrix();
      pointsRef.current?.setMatrixAt(index, dummy.matrix);
    });
    if (pointsRef.current) pointsRef.current.instanceMatrix.needsUpdate = true;
  }, [points]);
  useEffect(() => () => arcs.forEach((arc) => arc.dispose()), [arcs]);
  useFrame((state, delta) => {
    if (Math.abs(camera.position.y + 36.1) > 6) return;
    if (globeRef.current) globeRef.current.rotation.y += delta * (hovered ? 0.008 : 0.045);
    if (globePulseRef.current) {
      const pulseMesh = globePulseRef.current;
      globePulses.forEach((pulse, index) => {
        const t = (state.clock.elapsedTime * pulse.speed + pulse.offset) % 1;
        arcCurves[pulse.curveIndex].getPointAt(t, dummy.position);
        dummy.scale.setScalar(0.75 + Math.sin(t * Math.PI) * 0.5);
        dummy.updateMatrix();
        pulseMesh.setMatrixAt(index, dummy.matrix);
      });
      pulseMesh.instanceMatrix.needsUpdate = true;
    }
    if (ringsRef.current) {
      const pulse = 1 + (Math.sin(state.clock.elapsedTime * 2.6) + 1) * 0.1;
      ringsRef.current.scale.setScalar(pulse);
    }
  });
  return (
    <SceneBand center={-36.1} range={6.0}>
    <group position={[1.6, -36.1, 0]}>
      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[1.17, 24, 20]} />
          <meshPhysicalMaterial color="#0b2637" metalness={0.42} roughness={0.52} transparent opacity={0.22} clearcoat={0.6} />
        </mesh>
        <instancedMesh ref={pointsRef} args={[geometry, material, count]} frustumCulled={false} />
        {arcs.map((arc, index) => <mesh key={index} geometry={arc}><meshBasicMaterial color={index === 0 ? '#9dfff2' : '#43cdbd'} transparent opacity={0.82} toneMapped={false} /></mesh>)}
        <instancedMesh ref={globePulseRef} args={[globePulseGeometry, globePulseMaterial, globePulses.length]} frustumCulled={false} />
        {targets.map((target, index) => <mesh key={index} position={[target.x, target.y, target.z]}><sphereGeometry args={[0.035, 7, 7]} /><meshBasicMaterial color="#a4fff3" toneMapped={false} /></mesh>)}
        <group position={[source.x, source.y, source.z]}>
          <mesh><sphereGeometry args={[0.075, 10, 10]} /><meshBasicMaterial color="#f0c16c" toneMapped={false} /></mesh>
          <group ref={ringsRef}>
            <mesh><torusGeometry args={[0.13, 0.009, 5, 32]} /><meshBasicMaterial color="#f0c16c" toneMapped={false} /></mesh>
            <mesh rotation={[0.35, 0.2, 0]}><torusGeometry args={[0.2, 0.006, 5, 32]} /><meshBasicMaterial color="#5de6d0" transparent opacity={0.8} toneMapped={false} /></mesh>
          </group>
        </group>
      </group>
      <Html position={[0.08, -0.02, 1.35]} center distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <span className="scene-globe-label">Tasikmalaya</span>
      </Html>
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.009, 5, 96]} />
        <meshBasicMaterial color="#2f928c" transparent opacity={0.42} toneMapped={false} />
      </mesh>
    </group>
    </SceneBand>
  );
}

function PerformanceSampler({ hudRef }: { hudRef: MutableRefObject<HTMLDivElement | null> }) {
  const { gl } = useThree();
  const frameCount = useRef(0);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (!import.meta.env.DEV || !hudRef.current) return;
    frameCount.current += 1;
    elapsed.current += delta;
    if (elapsed.current >= 0.5) {
      const fps = Math.round(frameCount.current / elapsed.current);
      hudRef.current.textContent = `${fps} FPS · ${gl.info.render.calls} draw calls`;
      frameCount.current = 0;
      elapsed.current = 0;
    }
  });
  return null;
}

function SceneContent({ lowQuality, onQualityDrop, props, hudRef }: { lowQuality: boolean; onQualityDrop: () => void; props: GlobalSceneProps; hudRef: MutableRefObject<HTMLDivElement | null> }) {
  return (
    <>
      <fog attach="fog" args={['#07111f', 12, 48]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[-4, 7, 7]} intensity={2.2} color="#b6fff5" />
      <pointLight position={[5, 3, 4]} intensity={18} color="#35d9c7" distance={22} decay={2} />
      <pointLight position={[-5, 1, 2]} intensity={11} color="#3675ad" distance={18} decay={2} />
      <pointLight position={[1, -18, 4]} intensity={7} color="#47c9ba" distance={16} decay={2} />
      <Environment resolution={32}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, 4]} scale={[9, 3, 1]} color="#73f5df" />
        <Lightformer form="rect" intensity={1.7} position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]} scale={[5, 5, 1]} color="#3c7fbb" />
        <Lightformer form="rect" intensity={1.8} position={[5, 2, -3]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 5, 1]} color="#b5fff5" />
      </Environment>
      <CameraRig selectedSkill={props.selectedSkill} />
      <StarField lowQuality={lowQuality} />
      <HoloGrid />
      <ServerRackScene lowQuality={lowQuality} />
      <SkillsGraph
        lowQuality={lowQuality}
        selectedSkill={props.selectedSkill}
        hoveredSkill={props.hoveredSkill}
        onHover={props.onSkillHover}
        onSelect={props.onSkillSelect}
      />
      <ProjectScene />
      <TimelineScene hoveredExperience={props.hoveredExperience} />
      <AchievementScene hoveredAchievement={props.hoveredAchievement} hoveredCertification={props.hoveredCertification} />
      <GlobeScene lowQuality={lowQuality} hovered={props.globeHovered} />
      <PerformanceMonitor onDecline={onQualityDrop} flipflops={3} />
      {!lowQuality ? <EffectComposer multisampling={2}><Bloom intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.18} mipmapBlur /><Vignette eskil={false} offset={0.18} darkness={0.55} /></EffectComposer> : null}
      <PerformanceSampler hudRef={hudRef} />
    </>
  );
}

function SceneBootLoader() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (active) {
      setVisible(true);
      return undefined;
    }
    const timeout = window.setTimeout(() => setVisible(false), 1050);
    return () => window.clearTimeout(timeout);
  }, [active]);
  if (!visible) return null;
  const value = active ? Math.round(progress) : 100;
  return (
    <div className="scene-boot-loader" role="status" aria-live="polite">
      <div className="scene-boot-card">
        <span className="scene-boot-mark">{sceneVisual.loaderMark}</span>
        <p>{sceneVisual.loaderTitle}</p>
        <div className="scene-boot-progress"><span style={{ width: `${value}%` }} /></div>
        <small>{value}% · {value >= 100 ? sceneVisual.loaderReady : sceneVisual.loaderLoading}</small>
      </div>
    </div>
  );
}

export default function GlobalSceneLayer(props: GlobalSceneProps) {
  const canUse3D = useCanvasCapability();
  const hudRef = useRef<HTMLDivElement | null>(null);
  const [lowQuality, setLowQuality] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const updateQuality = () => setLowQuality((current) => current || media.matches);
    media.addEventListener('change', updateQuality);
    return () => media.removeEventListener('change', updateQuality);
  }, []);
  const fallback = <div className={`global-scene-fallback scene-fallback-${props.activeSection}`} aria-hidden="true" />;
  return (
    <>
      <div className={`global-scene-layer scene-section-${props.activeSection}`}>
        <div className="global-scene-canvas" aria-hidden="true">
          {canUse3D ? (
            <SceneBoundary fallback={fallback}>
              <Suspense fallback={fallback}>
                <Canvas
                  camera={{ position: [0, 0, 14], fov: 42, near: 0.1, far: 80 }}
                  dpr={lowQuality ? 1 : [1, 1.35]}
                  frameloop="always"
                  shadows={!lowQuality}
                  gl={{ alpha: true, antialias: !lowQuality, powerPreference: 'high-performance', stencil: false, depth: true }}
                  onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                    gl.setClearColor('#07111f', 0);
                  }}
                >
                  <SceneContent lowQuality={lowQuality} onQualityDrop={() => setLowQuality(true)} props={props} hudRef={hudRef} />
                </Canvas>
              </Suspense>
            </SceneBoundary>
          ) : fallback}
        </div>
      </div>
      {canUse3D ? <SceneBootLoader /> : null}
      {canUse3D && import.meta.env.DEV ? <div className="scene-performance-hud" ref={hudRef} aria-hidden="true" /> : null}
    </>
  );
}
