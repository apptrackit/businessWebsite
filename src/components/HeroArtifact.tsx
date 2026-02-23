import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending } from 'three';
import type { Group, Mesh } from 'three';

interface HeroArtifactProps {
  accentColor: string;
  intensity: number;
}

function OrbitingRings({ accentColor }: { accentColor: string }) {
  const ringsRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!ringsRef.current) return;
    const t = state.clock.elapsedTime;
    ringsRef.current.rotation.y += delta * 0.28;
    ringsRef.current.rotation.z = Math.sin(t * 0.35) * 0.35;
  });

  return (
    <group ref={ringsRef}>
      <mesh rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.45, 0.018, 16, 180]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.9}
          transparent
          opacity={0.46}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.9, Math.PI / 3.5, 0]}>
        <torusGeometry args={[1.72, 0.015, 16, 160]} />
        <meshStandardMaterial
          color="#7d8cff"
          emissive="#7d8cff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function ArtifactMesh({ accentColor, intensity }: HeroArtifactProps) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const shellRef = useRef<Mesh>(null);
  const materialRef = useRef<any>(null);
  const shellMaterialRef = useRef<any>(null);
  const animationState = useRef({ distort: 0.25, shellDistort: 0.1, scale: 1 });

  const pointer = useMemo(() => ({ x: 0, y: 0 }), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onRipple = () => {
      if (!coreRef.current || !shellRef.current) return;

      gsap.fromTo(
        animationState.current,
        { scale: animationState.current.scale },
        {
          scale: 1.12,
          duration: 0.16,
          repeat: 1,
          yoyo: true,
          ease: 'power2.out'
        }
      );

      gsap.fromTo(
        materialRef.current,
        { distort: animationState.current.distort },
        {
          distort: 1,
          duration: 0.2,
          repeat: 1,
          yoyo: true,
          ease: 'power2.out'
        }
      );
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('hero-artifact:ripple', onRipple as EventListener);

    const scrollTween = gsap.to(animationState.current, {
      distort: 0.9,
      shellDistort: 0.5,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '+=900',
        scrub: true
      }
    });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('hero-artifact:ripple', onRipple as EventListener);
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, [pointer]);

  useFrame((state, delta) => {
    if (!groupRef.current || !coreRef.current || !shellRef.current) return;

    const t = state.clock.elapsedTime;
    const floatOffset = Math.sin(t * 0.9) * 0.08;
    const wobble = Math.sin(t * 1.2) * 0.05;

    groupRef.current.rotation.y += delta * 0.55;
    groupRef.current.rotation.x = gsap.utils.interpolate(groupRef.current.rotation.x, pointer.y * 0.2 + wobble, 0.05);
    groupRef.current.position.x = gsap.utils.interpolate(groupRef.current.position.x, pointer.x * 0.24, 0.06);
    groupRef.current.position.y = gsap.utils.interpolate(groupRef.current.position.y, pointer.y * 0.04 + floatOffset, 0.06);

    const scale = animationState.current.scale;
    coreRef.current.scale.setScalar(scale);
    shellRef.current.scale.setScalar(1.15 + Math.sin(t * 1.1) * 0.02);

    shellRef.current.rotation.x += delta * 0.35;
    shellRef.current.rotation.y -= delta * 0.46;

    if (materialRef.current) materialRef.current.distort = animationState.current.distort;
    if (shellMaterialRef.current) shellMaterialRef.current.distort = animationState.current.shellDistort;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <MeshDistortMaterial
          ref={materialRef}
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.4 + intensity}
          metalness={0.25}
          roughness={0.08}
          transparent
          opacity={0.62}
          transmission={0.9}
          thickness={1.3}
          distort={animationState.current.distort}
          speed={1.4}
        />
      </mesh>

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <MeshDistortMaterial
          ref={shellMaterialRef}
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.2 + intensity * 0.6}
          wireframe
          transparent
          opacity={0.2}
          metalness={0.1}
          roughness={0.35}
          distort={animationState.current.shellDistort}
          speed={2.2}
        />
      </mesh>
    </group>
  );
}

export default function HeroArtifact({ accentColor, intensity }: HeroArtifactProps) {
  return (
    <div className="artifact-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 48 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 3, 3]} intensity={1.35} color={accentColor} />
        <pointLight position={[-3, -2, 2]} intensity={0.55} />
        <pointLight position={[0, -3, 3]} intensity={0.45} color="#8093ff" />
        <pointLight position={[0, 0, -4]} intensity={0.3} color="#5b66ff" />

        <Float speed={1.15} rotationIntensity={0.28} floatIntensity={0.55} floatingRange={[-0.2, 0.2]}>
          <OrbitingRings accentColor={accentColor} />
          <ArtifactMesh accentColor={accentColor} intensity={intensity} />
        </Float>

        <Sparkles count={70} scale={[6, 4, 4]} size={1.7} speed={0.3} color={accentColor} opacity={0.55} />
      </Canvas>
    </div>
  );
}
