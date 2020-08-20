import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter, Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import NewFileUpload from "./Components/NewFileUpload";
import FileDescriptionEdit from "./Components/FileDescriptionEdit";
import * as serviceWorker from "./serviceWorker";
import history from "./history";

const LandingPage = () => {
  return (
    <BrowserRouter>
      <Router history={history}>
        <div className="bg-success">
          <Route exact path={"/"} component={App} />
          <Route path={"/api/document/upload"} component={NewFileUpload} />
          <Route
            path={"/api/document/edit/:id"}
            component={FileDescriptionEdit}
          />
        </div>
      </Router>
    </BrowserRouter>
  );
};

ReactDOM.render(<LandingPage />, document.getElementById("root"));
// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
