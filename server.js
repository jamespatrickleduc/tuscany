/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { Server } from "boardgame.io/server";
//import { Server } from "boardgame";
import Tuscany from "./src/tuscany/game";

const PORT = process.env.PORT || 8000;
const server = Server({ games: [Tuscany] });
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
