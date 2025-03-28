import React, { useState } from "react";

import ImageUpload from "../components/ImageUpload";

function App() {
  const [skinTone, setSkinTone] = useState("");
  const [capturedImage, setCapturedImage] = useState("");

  const recommendDress = (skinTone) => {
    if (skinTone === "Fair") {
      return "Light color dresses like pastels, soft shades, or white.";
    } else if (skinTone === "Warm") {
      return "Earthy tones, warm shades like oranges, browns, and gold.";
    } else if (skinTone === "Dark") {
      return "Bold colors like red, navy, or jewel tones.";
    } else {
      return "No dress recommendation available.";
    }
  };

  return (
    <div className="app">
      <h1>Skin Tone Detection and Dress Recommendation</h1>
      <ImageUpload setSkinTone={setSkinTone} setCapturedImage={setCapturedImage} />

      {capturedImage && (
        <div className="result">
          <h3>Detected Skin Tone: {skinTone}</h3>
          <img src={capturedImage} alt="Captured Face" className="captured-image" />
        </div>
      )}

      {skinTone && (
        <div className="recommendation">
          <h3>Recommended Dress:</h3>
          <p>{recommendDress(skinTone)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
