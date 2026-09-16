import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render( //render container for the app
    <HashRouter>
        <App />
    </HashRouter>
);