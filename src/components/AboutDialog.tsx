interface Props {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<Props> = ({ open, onClose }) => {
  return (
    <dialog
      open={open}
      onClose={onClose}
      style={{ zIndex: "100", width: "400px", margin: "20vh auto" }}
    >
      <h3>About</h3>
      <p>
        A simple geospatial tool to view, create, and edit geospatial shapes
      </p>
      <h4>Libraries</h4>
      <ul>
        <li>
          <a href="https://openlayers.org/" target="_blank" rel="noreferrer">
            OpenLayers
          </a>
        </li>
        <li>
          <a
            href="https://react-icons.github.io/react-icons/"
            target="_blank"
            rel="noreferrer"
          >
            React Icons
          </a>
        </li>
      </ul>
      <p>
        You can find more about this app on{" "}
        <a href="https://harrywinser.com" target="_blank" rel="noreferrer">
          my blog
        </a>
        .
      </p>
      <p>Created by Harry Winser</p>
      <form method="dialog" style={{ marginTop: "16px" }}>
        <button>Close</button>
      </form>
    </dialog>
  );
};
