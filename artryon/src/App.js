import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OutfitTryOnPage from "./pages/OutfitTryOn";
import AIStylistPage from "./pages/AIStylistPage";
import OutfitRecommendation from "./pages/OutfitRecommendation";
import OutfitSelection from "./components/OutfitSelection";
import ARTryOn from "./components/ARTryOn";

const App = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <Router>
      <Navbar />  {/* Navbar appears on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/outfit-tryon" element={
          <OutfitTryOnPage>
            <OutfitSelection onSelect={setSelectedModel} />
            <ARTryOn selectedModel={selectedModel} />
          </OutfitTryOnPage>
        } />
        <Route path="/ai-stylist" element={<AIStylistPage />} />
        <Route path="/outfit-recommend" element={<OutfitRecommendation />} /> 
      </Routes>
    </Router>
  );
};

export default App;
