import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

// IMPORTANT - DO NOT ADD STRICT MODE IT CREATES A BUG WITH THE CHAT FUNCTION

createRoot(document.getElementById("root")).render(

    <App />

);
