import React, { useState } from "react";
import SkinToneDetector from "../components/SkinToneDetector";

const OutfitRecommendation = () => {
  const [skinTone, setSkinTone] = useState(null);
  const [outfit, setOutfit] = useState(null);

  // Outfit recommendations based on skin tone
  const outfitSuggestions = {
    Warm: ["Earthy Tones", "Beige", "Orange", "Brown", "Gold"],
    Cool: ["Blue", "Purple", "Silver", "Emerald", "Lavender"],
    Neutral: ["Black", "White", "Gray", "Pastels", "Denim"],
  };

  const handleSkinToneDetected = (tone) => {
    setSkinTone(tone);
    setOutfit(outfitSuggestions[tone]);
  };

  return (
    <div style={styles.container}>
      <h1>Find Outfit by Skin Tone</h1>
      <SkinToneDetector onDetect={handleSkinToneDetected} />
      {skinTone && (
        <div style={styles.result}>
          <h2>Your Skin Tone: {skinTone}</h2>
          <p>Recommended Outfit Colors:</p>
          <ul>
            {outfit.map((color, index) => (
              <li key={index}>{color}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  result: { marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "8px" },
};

export default OutfitRecommendation;
