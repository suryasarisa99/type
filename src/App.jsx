import { useState, useEffect, useRef, useReducer } from "react";
import Settings from "./pages/Settings";
import TextBox from './pages/TextBox';
export default function App() {
  function reducer(state, action) {
    if (action.type == "all") return action.payload;
    else
      return { ...state, [action.type]: action.payload }
  }
  const [settState, dSett] = useReducer(reducer,
    JSON.parse(
      localStorage.getItem('options')
    ) ||

    {
      min: 3,
      max: 5,
      all: [],
      any: [],
      none: [],
      random: false,
      type: 'char',
      data: "200"
    })

  const [showSettings, setShowSettings] = useState(false);
  return (

    <div>

      {!showSettings && < TextBox settState={settState} goSettings={() => setShowSettings(true)} />}

      {showSettings &&
        < Settings settState={settState} dSett={dSett} back={() => setShowSettings(false)} />
      }
    </div>
  );
}