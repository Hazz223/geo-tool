import { useMap } from "context/MapContext";
import { GeoJSON } from "ol/format";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddFeatureCollectionDialog: React.FC<Props> = ({
  open,
  onClose,
}) => {
  const { addFeatureCollection, map } = useMap();
  const [givenGeoJson, setGivenGeoJson] = useState("");

  const onSave = () => {
    if (map?.current) {
      try {
        const geoJson = new GeoJSON().readFeatures(givenGeoJson, {
          featureProjection: map.current.getView().getProjection(),
        });
        addFeatureCollection(geoJson);
      } catch (err) {
        alert("Invalid GeoJSON");
      }
    }
  };

  const closed = () => {
    setGivenGeoJson("");
    onClose();
  };

  return (
    <dialog
      open={open}
      style={{
        zIndex: "1000",
        width: "400px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: 0,
        position: "fixed",
      }}
      onClose={closed}
    >
      <h3>Add Feature Collection (EPSG:4326)</h3>
      <div style={{ marginBottom: "16px", padding: "8px" }}>
        <textarea
          style={{ width: "100%", height: "100px" }}
          onChange={(e) => setGivenGeoJson(e.target.value)}
          value={givenGeoJson}
        ></textarea>
      </div>

      <form method="dialog" style={{ marginTop: "16px" }}>
        <button>Close</button>
        <button onClick={onSave}>Save</button>
      </form>
    </dialog>
  );
};
