import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          border: "1px solid #374151",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#f3f4f6",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#f3f4f6",
          },
        },
      }}
    />
  </StrictMode>
);
