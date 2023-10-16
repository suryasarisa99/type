import { useState, useEffect, useRef, useReducer } from "react";
import Settings from "./pages/Settings";
import TextBox from './pages/TextBox';
import Themes from "./pages/Themes";
import { AnimatePresence } from "framer-motion";
export default function App() {

  const [showSettings, setShowSettings] = useState(false);

  const goSettings = () => setShowSettings(true)
  return (
    <div className="nav">
      {!showSettings && < TextBox goSettings={goSettings} />}
      {showSettings &&
        < Settings back={() => setShowSettings(false)} />
      }
    </div>
  );
}