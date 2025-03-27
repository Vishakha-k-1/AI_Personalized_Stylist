import React, { useState } from "react";
import OutfitSelection from "./components/OutfitSelection";
import ARTryOn from "./components/ARTryOn";

const App = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <div>
      <OutfitSelection onSelect={setSelectedModel} />
      <ARTryOn selectedModel={selectedModel} />
    </div>
  );
};

export default App;
