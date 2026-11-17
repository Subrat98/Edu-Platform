import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import { initStoredTheme } from "@/theme/themePersistence";
import { App } from "@/app/App";

// Apply persisted theme immediately before initial render
initStoredTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
