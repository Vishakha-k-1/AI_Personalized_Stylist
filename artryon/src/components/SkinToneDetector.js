import React, { useState, useRef } from "react";

const SkinToneDetector = ({ onDetect }) => {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to detect skin tone
  const detectSkinTone = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw the uploaded image on canvas
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      // Get pixel data from center of image
      const pixelData = ctx.getImageData(50, 50, 1, 1).data;
      const r = pixelData[0];
      const g = pixelData[1];
      const b = pixelData[2];

      // Determine skin tone range
      let tone = "Neutral";
      if (r > g && r > b) tone = "Warm";
      else if (b > r && b > g) tone = "Cool";

      onDetect(tone);
    };
  };

  return (
    <div style={styles.container}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" style={styles.preview} />}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <button onClick={detectSkinTone} style={styles.button}>Detect Skin Tone</button>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", margin: "20px" },
  preview: { width: "150px", height: "150px", marginTop: "10px", borderRadius: "10px" },
  button: { marginTop: "10px", padding: "8px 15px", background: "#3498db", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default SkinToneDetector;
