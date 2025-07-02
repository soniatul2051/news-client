import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "./i18n/config.js";
import { HelmetProvider } from "react-helmet-async";
import { AdProvider } from "./Context/TopAdContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AdProvider>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </AdProvider>
);
