import { Fragment, useContext, useState } from "react";
import "../App.css";
import { MapContext } from "../context/MapContext";
import { FaLocationArrow } from "react-icons/fa";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

type DrawingType = "None" | "Point" | "LineString" | "Polygon" | "Circle";

export const SideBarComponent: React.FC = () => {
  const {
    enableDraw,
    disableDraw,
    features,
    removeFeature,
    getFeatureWkt,
    zoomToLocation,
  } = useContext(MapContext);
  const [drawType, setDrawType] = useState<DrawingType>("None");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry>>();

  const handleSelect = (value: DrawingType) => {
    setDrawType(value);
    if (value === "None") {
      handleDrawDisable();
    } else {
      enableDraw(value);
    }
  };

  const handleDrawDisable = () => {
    disableDraw();
    setDrawType("None");
  };

  const selectFeature = (feature: Feature<Geometry>) => {
    // const wkt = getFeatureWkt(feature.getId());

    setDialogOpen(true);
    setSelectedFeature(feature);
  };

  const setViewToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      zoomToLocation(position.coords.latitude, position.coords.longitude);
    });
  };

  return (
    <div className="box-30">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <button onClick={setViewToCurrentLocation} style={{ width: "100%" }}>
            <span style={{ marginRight: "20px" }}>Jump to your location</span>
            <FaLocationArrow />
          </button>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h2>Drawing tools</h2>
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
        <div hidden={drawType === "None"}>
          <button style={{ width: "100%" }} onClick={handleDrawDisable}>
            Stop drawing
          </button>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ width: "100%" }}>
            <h2 hidden={features.length === 0}>Features</h2>
          </div>

          <div>
            {features.map((feature, index) => {
              return (
                <div key={feature.getId()}>
                  <div>
                    Feature ({index}) {feature.getGeometry()?.getType()}
                  </div>
                  <button onClick={() => selectFeature(feature)}>
                    Information
                  </button>
                  <button onClick={() => removeFeature(feature.getId())}>
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <dialog
        open={dialogOpen}
        style={{ zIndex: "100", minWidth: "400px", maxWidth: "600px" }}
        onClose={() => setDialogOpen(false)}
      >
        {selectedFeature && (
          <Fragment>
            <h3>Feature {selectedFeature.getGeometry()?.getType()}</h3>
            <div style={{ wordWrap: "break-word" }}>
              <h5>WKT </h5>
              <div style={{ overflow: "scroll" }}>
                <pre>
                  <code style={{ wordWrap: "break-word" }}>
                    {getFeatureWkt(selectedFeature.getId())}{" "}
                  </code>
                </pre>
              </div>
            </div>

            <form method="dialog">
              <button>OK</button>
            </form>
          </Fragment>
        )}
      </dialog>
    </div>
  );
};
