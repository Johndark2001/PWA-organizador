// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ Tu Client ID de Google
const clientId =
  "949128173455-o0qkv8k1m5bc35udsslit1r1ljuaq3g8.apps.googleusercontent.com";

// ✅ Render principal con el nuevo layout base
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
