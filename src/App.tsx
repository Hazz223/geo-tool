import "./App.css";
import { MapComponent } from "./components/MapComponent";
import { SideBarComponent } from "./components/sidebar/SideBarComponent";
import { MapContextProvider } from "./context/MapContext";

function App() {
  return (
    <div className="container">
      <MapContextProvider>
        <SideBarComponent />
        <MapComponent />
      </MapContextProvider>
    </div>
  );
}

export default App;
