"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/model/statue_of_edward_snowden.glb");
  return <primitive object={scene} scale={0.8} />;
}

useGLTF.preload("/model/statue_of_edward_snowden.glb");

export default function Statue() {
  return (
    <div className="relative h-screen bg-white">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Model */}
        <Model />

        {/* Controls = drag to rotate */}
        <OrbitControls enablePan={false} enableZoom={true} autoRotate={true} />
      </Canvas>

      <span className="absolute top-[60px] left-[10px] bg-amber-200 text-amber-800 p-5 rounded-2xl text-2xl">
        Statue of Edward Snowden
      </span>
    </div>
  );
}
