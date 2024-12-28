import { MapContext } from "context/MapContext";
import { Feature } from "ol";
import { useContext, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Projections } from "types";
import { FaCopy } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedFeature: Feature;
}

export const FeatureDialog: React.FC<Props> = ({
  open,
  onClose,
  selectedFeature,
}) => {
  const { getFeatureWkt, getFeatureGeoJson } = useContext(MapContext);
  const [projection, setProjection] = useState<Projections>("EPSG:3857");
  const [copiedWkt, setCopiedWkt] = useState(false);
  const [copiedGeoJson, setCopiedGeoJson] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
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
      {selectedFeature && (
        <Fragment>
          <h3>
            Feature {selectedFeature.getGeometry()?.getType()} ({projection})
          </h3>
          Projection:{" "}
          <select
            value={projection}
            onChange={(e) => {
              setProjection(e.target.value as Projections);
            }}
          >
            <option value="EPSG:3857">EPSG:3857</option>d
            <option value="EPSG:4326">EPSG:4326</option>
            <option value="EPSG:27700">EPSG:27700</option>
          </select>
          <div>
            <h5 style={{ marginBottom: "8px" }}>WKT</h5>
            {selectedFeature.getGeometry()?.getType() !== "Circle" ? (
              <Fragment>
                <div style={{ overflow: "scroll", marginBottom: "16px" }}>
                  <pre>
                    <code>
                      {getFeatureWkt(selectedFeature.getId(), projection)}
                    </code>
                  </pre>
                  <FaCopy
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      copyText(
                        getFeatureWkt(selectedFeature.getId(), projection) ||
                          "",
                      );
                      setCopiedWkt(true);
                    }}
                  />{" "}
                  {copiedWkt && "Copied to clipboard"}
                </div>
                <div>
                  <h5 style={{ marginBottom: "8px" }}>GeoJSON</h5>
                  <div style={{ overflow: "scroll", marginBottom: "16px" }}>
                    <pre>
                      <code>
                        {getFeatureGeoJson(selectedFeature.getId(), projection)}
                      </code>
                    </pre>
                  </div>
                  <FaCopy
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      copyText(
                        getFeatureGeoJson(
                          selectedFeature.getId(),
                          projection,
                        ) || "",
                      );
                      setCopiedGeoJson(true);
                    }}
                  />{" "}
                  {copiedGeoJson && "Copied to clipboard"}
                </div>
              </Fragment>
            ) : (
              <div style={{ marginBottom: "16px" }}>Cannot display WKT </div>
            )}
          </div>
          <form method="dialog" style={{ marginTop: "16px" }}>
            <button>Close</button>
          </form>
        </Fragment>
      )}
    </dialog>
  );
};
