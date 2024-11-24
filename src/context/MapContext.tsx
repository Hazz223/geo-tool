import { Feature, Map, View } from "ol";
import Geometry, { Type } from "ol/geom/Geometry";
import Draw from "ol/interaction/Draw";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM, Source, Vector } from "ol/source";
import WKT from "ol/format/WKT.js";
import { register } from "ol/proj/proj4";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { useGeographic } from "ol/proj";
import proj4 from "proj4";
import { Projections } from "types";

interface MapContextInterface {
  map?: Map;
  enableDraw: (type: string) => void;
  disableDraw: () => void;
  removeFeature: (id: string | number | undefined) => void;
  features: Feature<Geometry>[];
  getFeatureWkt: (
    id: string | number | undefined,
    projection: Projections,
  ) => string | undefined;
  zoomToLocation: (lat: number, long: number) => void;
}

const defaultValues = {
  map: undefined,
  enableDraw: () => null,
  disableDraw: () => null,
  removeFeature: () => null,
  features: [],
  getFeatureWkt: () => undefined,
  zoomToLocation: () => undefined,
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
        controls: [],
      });

      map.setTarget("map");
      useGeographic();
      proj4.defs(
        "EPSG:27700",
        "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs",
      );
      register(proj4);
      mapRef.current = map;
    }
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

  const findFeatureById = (id: string): Feature<Geometry> | undefined => {
    if (mapRef.current) {
      const layer = mapRef.current
        .getLayers()
        .getArray()
        .find((layer) => {
          return layer.get("harrysLayer") === "vectorLayer";
        });
      if (layer) {
        const vectorLayer = layer as VectorLayer;
        return vectorLayer.getSource()?.getFeatureById(id);
      }
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

  const getFeatureWkt = (
    id: string | number | undefined,
    projection: string,
  ): string | undefined => {
    if (mapRef.current) {
      const format = new WKT();

      if (typeof id === "string") {
        const feature = findFeatureById(id);
        if (feature) {
          const sourceProj = mapRef.current.getView().getProjection();
          const transformedGeometry = feature
            .getGeometry()
            ?.clone()
            .transform(sourceProj, projection);
          if (transformedGeometry) {
            return format.writeGeometry(transformedGeometry);
          }
          return "unknown";
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

  const zoomToLocation = (lat: number, long: number) => {
    if (mapRef.current) {
      const view = new View({
        center: [long, lat],
        zoom: 15,
      });

      mapRef.current.setView(view);
    }
  };

  return (
    <MapContext.Provider
      value={{
        ...state,
        enableDraw,
        disableDraw,
        removeFeature,
        getFeatureWkt,
        zoomToLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
