/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Multiplayer from "./tuscany/multiplayer";
import "bootstrap/dist/css/bootstrap.min.css";
import TuscanyLobby from "./tuscany/tuscanyLobby";
import "./app.css";

//export const App = () => <Multiplayer></Multiplayer>;
export const App = () => (
  <Router>
    <Switch>
      <Route path="/debug">
        <Multiplayer></Multiplayer>
      </Route>
      <Route path="/">
        <TuscanyLobby></TuscanyLobby>
      </Route>
    </Switch>
  </Router>
);
