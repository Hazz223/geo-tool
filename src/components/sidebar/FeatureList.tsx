import { FeatureDialog } from "components/FeatureDialog";
import { MapContext } from "context/MapContext";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { Fragment, useContext, useState } from "react";
import { FaInfoCircle, FaTrashAlt } from "react-icons/fa";

export const FeatureList: React.FC = () => {
  const { features, removeFeature } = useContext(MapContext);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry>>();

  const selectFeature = (feature: Feature<Geometry>) => {
    setDialogOpen(true);
    setSelectedFeature(feature);
  };

  const handleRemoveFeature = (feature: Feature<Geometry>) => {
    removeFeature(feature.getId());
    setDialogOpen(false);
    setSelectedFeature(undefined);
  };

  const onDialogClose = () => {
    setDialogOpen(false);
    setSelectedFeature(undefined);
  };

  return (
    <Fragment>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "16px" }}>
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
