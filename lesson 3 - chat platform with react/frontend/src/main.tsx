// main.tsx: Entry point for the React application, responsible for rendering the root component.

// Import createRoot from react-dom/client to create a root for rendering the React application.
import { createRoot } from "react-dom/client";

// Import StrictMode from react to enable additional checks and warnings for potential issues in development.
import { StrictMode } from "react";

// Import the main App component, which serves as the root component of the application.
import App from "./App.tsx";

// Import the global CSS file to apply styles across the application.
import "./index.css";

// Create a root instance by targeting the HTML element with the ID "root".
// The non-null assertion operator (!) is used because we assume the element exists in the DOM.
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render the application within StrictMode to catch potential issues during development.
// The App component is the top-level component that encapsulates the entire application.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */