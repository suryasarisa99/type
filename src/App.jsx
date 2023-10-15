import { useState, useEffect, useRef, useReducer } from "react";
import Settings from "./pages/Settings";
import TextBox from './pages/TextBox';
import Themes from "./pages/Themes";
export default function App() {



  const [showSettings, setShowSettings] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  const goSettings = () => setShowSettings(true)
  const goThemes = () => setShowThemes(true);
  return (

    <div className="nav">

      {!showSettings && !showThemes && < TextBox goSettings={goSettings} goThemes={goThemes} />}

      {showSettings &&
        < Settings back={() => setShowSettings(false)} />
      }
      {showThemes && <Themes back={() => setShowThemes(false)} />}
    </div>
  );
}