import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const ReturnToFrontControls = () => {
  const controlsRef = useRef();
  const { camera, invalidate } = useThree();
  const animating = useRef(false);
  const interacting = useRef(false);
  const home = useRef(new THREE.Vector3(0, 0, 5));

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.saveState();
  }, []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || interacting.current || !animating.current) return;

    const distance = camera.position.distanceTo(home.current);
    if (distance > 0.001) {
      camera.position.lerp(home.current, Math.min(1, delta * 3));
      controls.update();
      invalidate();
    } else {
      camera.position.copy(home.current);
      controls.update();
      controls.saveState();
      animating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enableDamping={false}
      onStart={() => {
        interacting.current = true;
        animating.current = false;
      }}
      onEnd={() => {
        interacting.current = false;
        animating.current = true;
        invalidate();
      }}
    />
  );
};

const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{ position: [0, 0, 5] }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ReturnToFrontControls />
        <Ball imgUrl={icon} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
