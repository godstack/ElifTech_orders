import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Upload from "../src/components/Upload";
import Orders from "../src/components/Orders";

export const useRoutes = () => {
  return (
    <Switch>
      <Route path="/upload" exact>
        <Upload />
      </Route>
      <Route path="/" exact>
        <Orders />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
