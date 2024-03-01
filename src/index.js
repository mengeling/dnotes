import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { Web5Provider } from "./context/Web5Context";
import { store } from "./redux/store";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Web5Provider>
        <App />
      </Web5Provider>
    </Provider>
  </React.StrictMode>
);
