import { useContext } from "react";
import "../App.css";
import { MapContext } from "../context/MapContext";

export const SideBarComponent: React.FC = () => {
  const { enableDraw, disableDraw, features, removeFeature, getFeatureWkt } =
    useContext(MapContext);

  const handleSelect = (value: string) => {
    enableDraw(value);
  };

  const handleDrawDisable = () => {
    disableDraw();
  };

  const printWkt = (id: string | number | undefined) => {
    const wkt = getFeatureWkt(id);
    alert(wkt);
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
      {features.map((feature, index) => {
        return (
          <div key={feature.getId()}>
            <div>Feature: {index}</div>
            <button onClick={() => removeFeature(feature.getId())}>
              Delete
            </button>
            <button onClick={() => printWkt(feature.getId())}>WKT</button>
          </div>
        );
      })}
    </div>
  );
};
