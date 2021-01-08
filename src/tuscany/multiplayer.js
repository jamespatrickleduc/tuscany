/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import Tuscany from "./game";
import Board from "./board";

const App = Client({
  game: Tuscany,
  board: Board,
  debug: true,
  multiplayer: SocketIO({ server: "http://73.152.48.200:8000" }),
});

const [nothing, matchID, playerID] = window.location.pathname.split("/");
console.log({ matchID, playerID });

const Multiplayer = () => (
  <div>
    <App matchID={matchID} playerID={playerID} />
  </div>
);

export default Multiplayer;
