import { createContext, useState, useEffect, useReducer } from "react";
import { defaultSettingsValues } from "../constants";

const DataContext = createContext();
export default function DataProvider({ children }) {
  const [limit, setLimit] = useState(
    JSON.parse(localStorage.getItem("limit")) || 30
  );
  const [allTypos, setAllTypos] = useState(
    JSON.parse(localStorage.getItem("typos")) || []
  );
  const [mistakes, setMistakes] = useState(
    JSON.parse(localStorage.getItem("mistakes")) || {}
  );

  function reducer(state, action) {
    if (action.type == "") return action.payload;
    else return { ...state, [action.type]: action.payload };
  }

  const [settState, dSett] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("options")) || defaultSettingsValues
  );

  useEffect(() => {
    document.documentElement.classList.add(localStorage.getItem("theme"));
  }, []);

  return (
    <DataContext.Provider
      value={{
        limit,
        setLimit,
        allTypos,
        setAllTypos,
        settState,
        dSett,
        mistakes,
        setMistakes,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
