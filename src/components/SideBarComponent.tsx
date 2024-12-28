import { Fragment, useState } from "react";
import "../App.css";
import { FaShareAlt } from "react-icons/fa";
import mastodonLogo from "../assets/mastodon-logo-purple.svg";
import blueskyLogo from "../assets/bluesky-logo.svg";
import { AboutDialog } from "./AboutDialog";
import { Header } from "./sidebar/Header";
import { Location } from "./sidebar/Location";
import { DrawingTools } from "./sidebar/DrawingTools";
import { FeatureList } from "./sidebar/FeatureList";

export const SideBarComponent: React.FC = () => {
  const [aboutOpen, setAboutOpen] = useState(false);

  const onAboutClose = () => {
    setAboutOpen(false);
  };

  return (
    <Fragment>
      <div className="box-30">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "100%",
              gap: "12px",
              height: "85vh",
              overflow: "scroll",
            }}
          >
            <Header />
            <Location />
            <DrawingTools />
            <FeatureList />
          </div>
        </div>
        <div
          style={{
            padding: "16px",
          }}
        >
          <div>
            <hr />
          </div>

          <div>
            <a onClick={() => setAboutOpen(true)} style={{ cursor: "pointer" }}>
              About{" "}
            </a>
            | Created by{" "}
            <a
              href="https://www.harrywinser.com"
              color="inherit"
              target="_blank"
              rel="noreferrer"
            >
              Harry Winser
            </a>
            <a
              href="https://mstdn.social/@hazz223"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={mastodonLogo}
                alt="Mastodon Logo"
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "16px",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              />
            </a>
            <a
              href="https://bsky.app/profile/harrywinser.com"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={blueskyLogo}
                alt="Bluesky Logo"
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "16px",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              />
            </a>
            <a
              href="https://shareopenly.org/share/?url=geo.harrywinser.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaShareAlt
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "16px",
                  alignItems: "center",
                  justifyContent: "end",
                  color: "#fbfbfe",
                }}
              />
            </a>
          </div>
        </div>
      </div>

      <AboutDialog open={aboutOpen} onClose={onAboutClose} />
    </Fragment>
  );
};
