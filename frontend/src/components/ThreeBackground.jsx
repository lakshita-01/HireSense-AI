import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function StarField(props) {
  const ref = useRef();
  const [sphere] = React.useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 30;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingOrb({ position = [0, 0, 0], speed = 2 }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.003;
      ref.current.position.x += Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.003;
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#5b21b6"
          emissiveIntensity={0.3}
          wireframe={false}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh scale={1.3}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#a78bfa"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 1.5] }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <StarField />
        <FloatingOrb position={[-0.3, 0.2, -0.5]} speed={1.5} />
        <FloatingOrb position={[0.4, -0.1, -0.3]} speed={1.8} />
        <FloatingOrb position={[0, 0.4, -0.8]} speed={1.2} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
