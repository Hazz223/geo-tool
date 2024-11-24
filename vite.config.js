import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default ({ mode }) => {
  // todo: migrate this to using loadLocal stuff, which I need to dig out
  const prefix = "VITE_";
  const filteredVars = Object.keys(process.env)
    .filter((key) => key.startsWith(prefix))
    .reduce((obj, key) => {
      obj[key] = process.env[key];
      return obj;
    }, {});

  return defineConfig({
    define: {
      "process.env": filteredVars,
    },
    publicDir: "public",
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 5000,
      open: true,
    },
    build: {
      assetsInlineLimit: 0,
      outDir: "build",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("react-router-dom") ||
              id === "react" ||
              id === "react-dom"
            ) {
              return "react";
            }
            if (id.includes("axios")) {
              return "axios";
            }
            if (id.includes("polished") || id.includes("styled-components")) {
              return "style";
            }
          },
        },
      },
    },
    plugins: [react(), viteTsconfigPaths()],
  });
};
