import { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import "../styles/empty.scss";
import { defaultSettingsValues } from "../constants";
export default function Empty({ goSettings, reset, len }) {
  const { dSett } = useContext(DataContext);
  const [showRefresh, setShowR] = useState(false);

  function handleReset() {
    console.log("reset settings");
    localStorage.setItem("options", JSON.stringify(defaultSettingsValues));
    dSett({
      type: "",
      payload: defaultSettingsValues,
    });
    reset({ len: len });
  }
  return (
    <div className="on-empty">
      <h1>Empty</h1>
      <h4>As Per Settings 0 Words Found</h4>
      <div className="row">
        <button onClick={goSettings}>Change Settings</button>
        <p className="or">Or</p>
        {!showRefresh ? (
          <button onClick={handleReset}>Double Click to Reset Settings</button>
        ) : (
          <p className="refresh">Refresh Now</p>
        )}
      </div>
    </div>
  );
}
