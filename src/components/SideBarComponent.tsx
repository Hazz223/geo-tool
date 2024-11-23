import { useContext } from "react";
import "../App.css";
import { MapContext } from "../context/MapContext";

export const SideBarComponent: React.FC = () => {
  const { enableDraw, disableDraw } = useContext(MapContext);

  const handleSelect = (value: string) => {
    enableDraw(value);
  };

  const handleDrawDisable = () => {
    disableDraw();
  };

  return (
    <div className="box-30">
      <select
        className="form-select"
        id="type"
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
      </select>
      <button onClick={handleDrawDisable}>Stop drawing</button>
    </div>
  );
};
