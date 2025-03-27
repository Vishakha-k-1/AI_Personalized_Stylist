import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import { Pose } from "@mediapipe/pose";

// Component to display the 3D model
const ModelViewer = ({ modelUrl, position, scale }) => {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} position={position} scale={scale} />;
};

// Main ARTryOn component
const ARTryOn = ({ selectedModel }) => {
  const webcamRef = useRef(null); // Declare webcamRef here
  const [poseData, setPoseData] = useState({ x: 0, y: 0, z: -2.5, scale: 1 });

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* Webcam Feed */}
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
        mirrored
      />

      {/* 3D Model and Scene */}
      <Canvas style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }} camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <OrbitControls enableZoom={false} />
        <ModelScene selectedModel={selectedModel} poseData={poseData} setPoseData={setPoseData} webcamRef={webcamRef} />
      </Canvas>
    </div>
  );
};

// Component for pose detection and syncing the model position
const ModelScene = ({ selectedModel, poseData, setPoseData, webcamRef }) => {
  const { camera } = useThree(); // Access the camera from useThree()

  useEffect(() => {
    const loadPoseDetection = async () => {
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.8,
      });

      pose.onResults((results) => {
        if (results.poseLandmarks) {
          const leftShoulder = results.poseLandmarks[11]; // Left Shoulder
          const rightShoulder = results.poseLandmarks[12]; // Right Shoulder
          const leftHip = results.poseLandmarks[23]; // Left Hip
          const rightHip = results.poseLandmarks[24]; // Right Hip

          if (leftShoulder && rightShoulder && leftHip && rightHip) {
            // Calculate the center of the body and the scale
            const x = (leftShoulder.x + rightShoulder.x) / 2;
            const y = (leftShoulder.y + rightShoulder.y) / 2;
            const z = -2.5; // Depth (how far from the camera the model should be)

            // Calculate the width of the shoulders and hips for dynamic scaling
            const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
            const hipWidth = Math.abs(rightHip.x - leftHip.x);
            const avgWidth = (shoulderWidth + hipWidth) / 2;
            const scale = Math.max(1.5, avgWidth * 12);

            // Set the pose data
            setPoseData((prev) => ({
              x: prev.x * 0.8 + (x - 0.5) * 3 * 0.2,  // Smoothed X position
              y: prev.y * 0.8 + (0.5 - y) * 2.5 * 0.2,  // Smoothed Y position (to adjust for model height)
              z, // Set z depth based on pose data
              scale,
            }));
          }
        }
      });

      const processFrame = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          await pose.send({ image: webcamRef.current.video });
        }
        requestAnimationFrame(processFrame);
      };

      await pose.initialize();
      processFrame();
    };

    loadPoseDetection();
  }, [camera, webcamRef, setPoseData]); // Add setPoseData to dependencies

  return (
    <>
      {/* Render 3D model based on pose data */}
      {selectedModel && (
        <ModelViewer
          modelUrl={selectedModel}
          position={[poseData.x * 5, -poseData.y * 5 + 1, poseData.z]} // Adjust Y position to avoid floating
          scale={[poseData.scale, poseData.scale, poseData.scale]}
        />
      )}
    </>
  );
};

export default ARTryOn;
