import { Feature } from "ol";
import { GeoJSON } from "ol/format";
import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  features: Feature[];
}

export const ViewFeatureCollectionDialog: React.FC<Props> = ({
  open,
  onClose,
  features,
}) => {
  const [copied, setCopied] = useState(false);
  const geojsonFormat = new GeoJSON();
  const featureCollection: GeoJSONFeatureCollection =
    geojsonFormat.writeFeaturesObject(features, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
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
      onClose={onClose}
    >
      <h3 style={{}}>Feature Collection (EPSG:4326)</h3>
      <div style={{ overflow: "scroll", marginBottom: "16px" }}>
        <pre>
          <code>{JSON.stringify(featureCollection)}</code>
        </pre>
      </div>
      <FaCopy
        style={{ cursor: "pointer" }}
        onClick={() => {
          copy(JSON.stringify(featureCollection));
          setCopied(true);
        }}
      />{" "}
      <div>{copied && "Copied to clipboard"}</div>
      <span style={{ fontSize: "12px" }}>
        (Circles won't be included as they're not in the specification)
      </span>
      <form method="dialog" style={{ marginTop: "16px" }}>
        <button>Close</button>
      </form>
    </dialog>
  );
};
