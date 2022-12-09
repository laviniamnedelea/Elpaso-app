import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // global config css
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  // rendering the react component to the root element in index.html
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") //position = element with the id of root
);
