import { MapContext } from "context/MapContext";
import { useContext, useState } from "react";
import { Fragment } from "react/jsx-runtime";

type DrawingType = "None" | "Point" | "LineString" | "Polygon" | "Circle";

export const DrawingTools = () => {
  const [drawType, setDrawType] = useState<DrawingType>("None");
  const { enableDraw, disableDraw } = useContext(MapContext);

  const handleDrawDisable = () => {
    disableDraw();
    setDrawType("None");
  };

  const handleSelect = (value: DrawingType) => {
    setDrawType(value);
    if (value === "None") {
      handleDrawDisable();
    } else {
      enableDraw(value);
    }
  };

  return (
    <Fragment>
      <div>
        <div>
          <h2>Drawing</h2>
          <select
            className="form-select"
            id="type"
            value={drawType}
            onChange={(e) => handleSelect(e.target.value as DrawingType)}
          >
            <option value="None">None</option>
            <option value="Point">Point</option>
            <option value="LineString">LineString</option>
            <option value="Polygon">Polygon</option>
            <option value="Circle">Circle</option>
          </select>
        </div>
      </div>
      <div hidden={drawType === "None"} style={{ marginTop: "16px" }}>
        <button style={{ width: "100%" }} onClick={handleDrawDisable}>
          Stop drawing
        </button>
      </div>
    </Fragment>
  );
};
