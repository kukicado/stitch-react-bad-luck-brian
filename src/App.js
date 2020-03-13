import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import Home from "./Home";
import { useAuth0 } from "./react-auth0-spa";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
