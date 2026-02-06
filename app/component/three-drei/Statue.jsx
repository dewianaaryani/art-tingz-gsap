"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Bounds,
  useGLTF,
  Environment,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/model/statue_of_edward_snowden.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: "#9b968e",
        roughness: 0.9,
        metalness: 0,
      });
    }
  });

  return <primitive object={scene} />;
}

export default function Statue() {
  return (
    <div className="statue-image">
      <Canvas
        className="w-full h-full touch-none"
        camera={{ position: [0, 1, 8], fov: 75 }}
      >
        <Center>
          <Model />
        </Center>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 2.2}
        />

        <Environment preset="city" />

        {/* Key Light (main) */}
        <directionalLight position={[4, 6, 3]} intensity={3} castShadow />

        {/* Fill Light (soft) */}
        <directionalLight position={[-3, 2, 2]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} />

        {/* Rim Light (back highlight) */}
        <spotLight
          position={[0, 5, -5]}
          intensity={2}
          angle={0.35}
          penumbra={1}
          color="#ffffff"
        />

        {/* Very low ambient */}
        <ambientLight intensity={0.2} />
      </Canvas>
    </div>
  );
}
