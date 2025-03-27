import React, { useState } from "react";
import shirtImg from "../assets/shirt.jpg";
import hoodieImg from "../assets/hoodie.jpg";
import hneckImg from "../assets/highnecktshirt.png";
import "./App.css"; // Import the CSS for styling

const outfits = [
  { id: 1, name: "Shirt", image: shirtImg, model: "/models/shirt.glb" },
  { id: 2, name: "Hoodie", image: hoodieImg, model: "/models/hoodie.glb" },
  { id: 3, name: "High Neck Tshirt", image: hneckImg, model: "/models/highnecktshirt.glb" }
];

const OutfitSelection = ({ onSelect }) => {
  return (
    <div className="outfit-selection-container">
      <h2>Select an Outfit</h2>
      <div className="outfit-cards">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="outfit-card" onClick={() => onSelect(outfit.model)}>
            <img src={outfit.image} alt={outfit.name} className="outfit-image" />
            <p>{outfit.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitSelection;
