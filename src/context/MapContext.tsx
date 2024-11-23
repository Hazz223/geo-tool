import { Map, View } from "ol";
import { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";

import { OSM, Vector } from "ol/source";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface MapContextInterface {
  map?: Map;
  enableDraw: (type: string) => void;
  disableDraw: () => void;
}

const defaultValues = {
  map: undefined,
  enableDraw: () => null,
  disableDraw: () => null,
};

export const MapContext = createContext<MapContextInterface>(defaultValues);

export const MapContextProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | undefined>(undefined);

  useEffect(() => {
    if (!mapRef.current) {
      console.log("creating map");
      const tileLayer = new TileLayer({
        source: new OSM(),
      });
      tileLayer.set("id", "tileLayer");

      const source = new Vector({});
      const vectorLayer = new VectorLayer({
        source: source,
      });

      vectorLayer.set("harrysLayer", "vectorLayer");

      const map = new Map({
        layers: [tileLayer, vectorLayer],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget("map");
      }
    };
  }, [mapRef]);

  const disableDraw = () => {
    if (mapRef.current) {
      const found = mapRef.current
        .getInteractions()
        .getArray()
        .find((interaction) => interaction.get("custom"));
      found && mapRef.current.removeInteraction(found);
    }
  };

  const enableDraw = useCallback(
    (type: String) => {
      if (mapRef.current) {
        console.log("Enabling draw");
        const layer = mapRef.current
          .getLayers()
          .getArray()
          .find((layer) => {
            return layer.get("harrysLayer") === "vectorLayer";
          });

        if (layer) {
          const vectorLayer = layer as VectorLayer;
          const source = vectorLayer.getSource();

          if (source) {
            disableDraw();

            const draw = new Draw({
              source: source,
              type: type as Type,
            });
            draw.set("custom", "set");
            mapRef.current.addInteraction(draw);
          }
        }
      }
    },
    [mapRef],
  );

  return (
    <MapContext.Provider value={{ enableDraw, disableDraw }}>
      {children}
    </MapContext.Provider>
  );
};
