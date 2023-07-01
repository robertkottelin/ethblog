import React from "react";
import ReactDOM from "react-dom/client";
import { Blog } from "./components/Blog";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Blog />
  </React.StrictMode>
);
