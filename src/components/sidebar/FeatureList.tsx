import { ViewFeatureCollectionDialog } from "components/dialogs/ViewFeatureCollectionDialog";
import { FeatureDialog } from "components/FeatureDialog";
import { MapContext } from "context/MapContext";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { Fragment, useContext, useState } from "react";
import { FaCopy, FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { AddFeatureCollection } from "./AddFeatureCollection";
import { AddFeatureCollectionDialog } from "components/dialogs/AddFeatureCollectionDialog";

export const FeatureList: React.FC = () => {
  const { features, removeFeature, zoomToFeature } = useContext(MapContext);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry>>();
  const [viewFeatureCollectionDialog, setViewFeatureCollectionDialog] =
    useState<boolean>(false);

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

  const onFeatureZoom = (feature: Feature<Geometry>) => {
    zoomToFeature(feature.getId());
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
                    onClick={() => onFeatureZoom(feature)}
                  >
                    <FaLocationCrosshairs />
                  </button>
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
          {features.length > 0 && (
            <button
              style={{ width: "100%", marginTop: "8px" }}
              onClick={() => setViewFeatureCollectionDialog(true)}
            >
              View as feature collection
            </button>
          )}
        </div>
      </div>
      {selectedFeature && (
        <FeatureDialog
          open={dialogOpen}
          onClose={onDialogClose}
          selectedFeature={selectedFeature}
        />
      )}

      <ViewFeatureCollectionDialog
        open={viewFeatureCollectionDialog}
        onClose={() => setViewFeatureCollectionDialog(false)}
        features={features}
      />
    </Fragment>
  );
};
