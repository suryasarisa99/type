import { useState, useEffect, useRef, useReducer } from "react";
import Settings from "./pages/Settings";
import TextBox from './pages/TextBox';
export default function App() {



  const [showSettings, setShowSettings] = useState(false);
  return (

    <div className="nav">

      {!showSettings && < TextBox goSettings={() => setShowSettings(true)} />}

      {showSettings &&
        < Settings back={() => setShowSettings(false)} />
      }
    </div>
  );
}