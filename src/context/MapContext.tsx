import { Feature, Map, View } from "ol";
import Geometry, { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";

import { OSM, Vector } from "ol/source";
import VectorSource from "ol/source/Vector";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";

interface MapContextInterface {
  map?: Map;
  enableDraw: (type: string) => void;
  disableDraw: () => void;
  removeFeature: (id: string | number | undefined) => void;
  features: Feature<Geometry>[];
}

const defaultValues = {
  map: undefined,
  enableDraw: () => null,
  disableDraw: () => null,
  removeFeature: () => null,
  features: [],
};

interface State {
  features: Feature<Geometry>[];
}

const initialState: State = { features: [] };

type ACTION =
  | { type: "ADD_FEATURE"; payload: Feature<Geometry> }
  | { type: "REMOVE_FEATURE"; payload: string };

const mapReducer = (state: State, action: ACTION) => {
  switch (action.type) {
    case "ADD_FEATURE": {
      return { ...state, features: [...state.features, action.payload] };
    }
    case "REMOVE_FEATURE": {
      const filtered = state.features.filter(
        (feature) => feature.getId() !== action.payload,
      );
      return { ...state, features: filtered };
    }
    default:
      throw new Error("Unknown action type");
  }
};

export const MapContext = createContext<MapContextInterface>(defaultValues);

export const MapContextProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | undefined>(undefined);
  const [state, dispatch] = useReducer(mapReducer, initialState);

  useEffect(() => {
    if (!mapRef.current) {
      const tileLayer = new TileLayer({
        source: new OSM(),
      });
      tileLayer.set("id", "tileLayer");

      const source = new Vector({});
      source.on("addfeature", (event) => {
        const feature = event.feature;
        if (feature) {
          feature.setId(crypto.randomUUID());
          feature && dispatch({ type: "ADD_FEATURE", payload: feature });
        }
      });
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

  const removeFeature = (id: string | number | undefined) => {
    if (typeof id === "string") {
      if (mapRef.current) {
        const layer = mapRef.current
          .getLayers()
          .getArray()
          .find((layer) => {
            return layer.get("harrysLayer") === "vectorLayer";
          });
        if (layer) {
          const vectorLayer = layer as VectorLayer;
          const foundFeature = vectorLayer.getSource()?.getFeatureById(id);
          vectorLayer.getSource()?.removeFeature(foundFeature);
          dispatch({ type: "REMOVE_FEATURE", payload: id });
        }
      }
    }
  };

  const enableDraw = useCallback(
    (type: String) => {
      if (mapRef.current) {
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
    <MapContext.Provider
      value={{ ...state, enableDraw, disableDraw, removeFeature }}
    >
      {children}
    </MapContext.Provider>
  );
};
