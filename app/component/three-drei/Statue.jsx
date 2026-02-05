"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/model/statue_of_edward_snowden.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: "#f5f5f5",
        roughness: 0.4,
        metalness: 0,
      });
    }
  });

  return <primitive object={scene} />;
}

export default function Statue() {
  return (
    <div className="statue-image">
      <Canvas className="w-full h-full touch-none" camera={{ fov: 75 }}>
        <Bounds fit margin={1.3}>
          <Model />
        </Bounds>

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.6}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
        />

        <Environment preset="city" />

        {/* Key Light (main) */}
        <directionalLight position={[4, 6, 3]} intensity={3} castShadow />

        {/* Fill Light (soft) */}
        <directionalLight position={[-3, 2, 2]} intensity={0.8} />

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
