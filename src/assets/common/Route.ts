import React, { ReactElement } from "react";
import { Route } from "react-router-dom";

interface routeInterface {
  path: string;
  component: any;
  children?: Array<any>;
}

const createRoute = (route: routeInterface, index: number) => {
  // return <Route key={index} path={route.path} component={route.component} />;
};

export { createRoute };
