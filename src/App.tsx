import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import routes from './router';
// import {createRoute} from './assets/common/Route';

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
            {routes.map((route,index)=>{
                // createRoute(route,index)
                return <Route key={index} path={route.path} component={route.component} />
            })}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
