import { Fragment, useContext, useState } from "react";
import "../App.css";
import { MapContext } from "../context/MapContext";
import { FaInfoCircle, FaTrashAlt, FaLocationArrow } from "react-icons/fa";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import mastodonLogo from "../assets/mastodon-logo-purple.svg";
import blueskyLogo from "../assets/bluesky-logo.svg";
import { FeatureDialog } from "./FeatureDialog";

type DrawingType = "None" | "Point" | "LineString" | "Polygon" | "Circle";

export const SideBarComponent: React.FC = () => {
  const { enableDraw, disableDraw, features, removeFeature, zoomToLocation } =
    useContext(MapContext);
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

  const onDialogClose = () => {
    setDialogOpen(false);

    setSelectedFeature(undefined);
  };

  const handleRemoveFeature = (feature: Feature<Geometry>) => {
    removeFeature(feature.getId());
    setDialogOpen(false);
    setSelectedFeature(undefined);
  };

  return (
    <Fragment>
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
              width: "100%",
              gap: "12px",
              height: "85vh",
              overflow: "scroll",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <h1>GeoTools</h1>
              <hr />
            </div>
            <div>
              <button
                onClick={setViewToCurrentLocation}
                style={{ width: "100%" }}
              >
                <span style={{ marginRight: "20px" }}>
                  Jump to your location
                </span>
                <FaLocationArrow />
              </button>
            </div>
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
            <div
              style={{ display: "flex", flexWrap: "wrap", marginTop: "16px" }}
            >
              <div style={{ width: "100%" }}>
                <hr hidden={features.length === 0} />
                <h2 hidden={features.length === 0}>Features</h2>
              </div>
              <div>
                {features.map((feature, index) => {
                  return (
                    <div key={feature.getId()} style={{ margin: "16px" }}>
                      <div>
                        Feature ({index}) {feature.getGeometry()?.getType()}
                      </div>
                      <div style={{ marginTop: "16px" }}>
                        <button
                          style={{ marginRight: "16px" }}
                          onClick={() => selectFeature(feature)}
                        >
                          <FaInfoCircle />
                        </button>
                        <button onClick={() => handleRemoveFeature(feature)}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* {features.length > 0 && (
                <div style={{ width: "100%" }}> */}
              {/* <hr /> */}
              {/* <h2>Tools</h2>
                  <div>
                    <h3>
                      <FaCopy /> Copy as Feature Collection
                    </h3>
                  </div>
                </div> */}
              {/* )} */}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "16px",
          }}
        >
          <div>
            <hr />
          </div>
          <div>
            Created by{" "}
            <a
              href="https://www.harrywinser.com"
              color="inherit"
              target="_blank"
              rel="noreferrer"
            >
              Harry Winser
            </a>
            <a
              href="https://mstdn.social/@hazz223"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={mastodonLogo}
                alt="Mastodon Logo"
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "16px",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              />
            </a>
            <a
              href="https://bsky.app/profile/harrywinser.com"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={blueskyLogo}
                alt="Bluesky Logo"
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "16px",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              />
            </a>
          </div>
        </div>
      </div>
      {selectedFeature && (
        <FeatureDialog
          open={dialogOpen}
          onClose={onDialogClose}
          selectedFeature={selectedFeature}
        />
      )}
    </Fragment>
  );
};
