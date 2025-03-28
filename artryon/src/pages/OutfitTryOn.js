// pages/OutfitTryOnPage.js
import React from "react";
import OutfitSelection from "../components/OutfitSelection";
import ARTryOn from "../components/ARTryOn";

const OutfitTryOnPage = ({ children }) => {
  return (
    <div style={styles.container}>
      <h1>Outfit Try-On</h1>
      <p>Try on clothes virtually using augmented reality.</p>
      {children}
    </div>
  );
};
const styles = {
    container: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "150vh",
    },
  };
export default OutfitTryOnPage;
