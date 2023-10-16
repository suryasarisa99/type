import { useState, useEffect, useRef, useReducer } from "react";
import Settings from "./pages/Settings";
import TextBox from './pages/TextBox';
import Themes from "./pages/Themes";
import { AnimatePresence } from "framer-motion";
import KeyBoard from "./components/KeyBoard";
export default function App() {

  const [showSettings, setShowSettings] = useState(false);

  const goSettings = () => setShowSettings(true)
  // localStorage.clear();
  return (
    <div className="nav">
      {!showSettings &&
        < TextBox goSettings={goSettings} />
        // <KeyBoard />
      }
      {showSettings &&
        < Settings back={() => setShowSettings(false)} />
      }
    </div>
  );
}