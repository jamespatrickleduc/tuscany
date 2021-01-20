import { Lobby } from "boardgame.io/react";
import Tuscany from "./game";
import Board from "./board";
import React from "react";
console.log(process.env);

const TuscanyLobby = () => {
  const style = {};
  return (
    <div style={style}>
      <Lobby
        gameServer="http://127.0.0.1:8000"
        lobbyServer="http://127.0.0.1:8000"
        gameComponents={[{ game: Tuscany, board: Board }]}
        debug={true}
      />
    </div>
  );
};

export default TuscanyLobby;
