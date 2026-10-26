import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StoreProvider } from "./context/StoreContext";
import "./styles.css";

// StrictMode is intentionally left out: in development it runs effects twice,
// which would double every dataLayer push and confuse GTM Preview while learning.
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
);
