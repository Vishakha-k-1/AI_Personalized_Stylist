import React, { useRef, useState, useEffect } from "react";

const BACKEND_URL = "https://stunning-garbanzo-q7q496x6j945c4vx7-5000.app.github.dev";

const ImageUpload = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [skinTone, setSkinTone] = useState(null);

    // Start camera when the component mounts
    useEffect(() => {
        startCamera();
        return () => stopCamera(); // Cleanup function to stop the camera when unmounted
    }, []);

    // Turn on the webcam
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
            }
        } catch (error) {
            console.error("Error accessing webcam:", error);
            alert("Webcam access denied or unavailable.");
        }
    };

    // Stop the camera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    // Capture image from webcam
    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image data
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        sendToBackend(imageData);
    };

    // Send image to backend for processing
    const sendToBackend = async (imageData) => {
        try {
            const response = await fetch(`${BACKEND_URL}/detect_skin_tone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageData }),
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                setSkinTone(data.skin_tone);
            }
        } catch (error) {
            console.error("Error sending image to backend:", error);
        }
    };

    return (
        <div className="image-upload">
            <h2>Capture Face for Skin Tone Detection</h2>
            <video ref={videoRef} autoPlay playsInline width="320" height="240" style={{ border: "2px solid black" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button onClick={captureImage}>Capture Image</button>

            {capturedImage && (
                <div>
                    <h3>Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" style={{ width: "320px", borderRadius: "8px" }} />
                </div>
            )}

            {skinTone && (
                <h3>Detected Skin Tone: <span style={{ color: "blue" }}>{skinTone}</span></h3>
            )}
        </div>
    );
};

export default ImageUpload;
