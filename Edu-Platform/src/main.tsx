import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import { initStoredTheme } from "@/theme/themePersistence";
import { initTextZoom } from "@/lib/accessibility";
import { App } from "@/app/App";

// Apply persisted theme and accessibility text zoom immediately before initial render
initStoredTheme();
initTextZoom();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
