import { MapContext } from "context/MapContext";
import { useContext } from "react";
import { FaLocationArrow } from "react-icons/fa";

export const Location: React.FC = () => {
  const { zoomToLocation } = useContext(MapContext);

  const setViewToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      zoomToLocation(position.coords.latitude, position.coords.longitude);
    });
  };

  return (
    <div>
      <button onClick={setViewToCurrentLocation} style={{ width: "100%" }}>
        <span style={{ marginRight: "20px" }}>Jump to your location</span>
        <FaLocationArrow />
      </button>
    </div>
  );
};
