import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./assests/css/common.css";
import "./assests/css/header.css";
import "./assests/css/climate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import configureStore from "./store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GoogleTranslate from "./components/Common/translation";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configureStore}>
    <BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        limit={1}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <App />
      <GoogleTranslate />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
