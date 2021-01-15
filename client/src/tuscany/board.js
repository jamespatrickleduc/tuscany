import React, { useLayoutEffect, useState } from "react";
//import PropTypes from "prop-types";
import "./board.css";

import Region from "./components/region";
import Hand from "./components/hand";
import Bank from "./components/bank";
import Inventory from "./components/inventory";
import Prompt from "./components/prompt";
import Log from "./components/log";
import EnemyBoard from "./components/enemyBoard";

import useWindowSize from "./hooks/windowSize";
import Bonuses from "./components/bonuses";

function Board({
  G,
  ctx,
  moves,
  playerID,
  isActive,
  isMultiplayer,
  isConnected,
  isPreview,
  matchData,
}) {
  // static propTypes = {
  //   G: PropTypes.any.isRequired,
  //   ctx: PropTypes.any.isRequired,
  //   moves: PropTypes.any.isRequired,
  //   playerID: PropTypes.string,
  //   isActive: PropTypes.bool,
  //   isMultiplayer: PropTypes.bool,
  //   isConnected: PropTypes.bool,
  //   isPreview: PropTypes.bool,
  // };

  const [width, height] = useWindowSize();

  const beforeMe = Object.keys(ctx.playOrder).slice(
    0,
    ctx.playOrder.indexOf(playerID),
  );
  const enemyIDs = [
    ...Object.keys(ctx.playOrder).slice(
      ctx.playOrder.indexOf(playerID) + 1,
      ctx.playOrder.length,
    ),
    ...beforeMe,
  ];

  let enemies = [];
  enemyIDs.forEach((id) => {
    enemies.push(<EnemyBoard key={id} G={G} ctx={ctx} id={id} />);
  });

  const settingUp = Object.values(ctx.activePlayers).reduce((acc, cur) => {
    if (cur === "setup") return true;
  }, false);

  return (
    <div
      className="tuscanyBoard"
      style={{ height, width, position: "relative" }}
    >
      <div style={{ display: "flex" }}>
        <Region G={G} playerID={playerID} ctx={ctx} moves={moves} />
        <Log G={G} playerID={playerID} ctx={ctx} matchData={matchData} />
      </div>
      {
        /*!settingUp &&*/ <>
          <Bonuses G={G} height={height * 0.07} />
          <Hand G={G} playerID={playerID} ctx={ctx} moves={moves} />
          <Bank G={G} playerID={playerID} ctx={ctx} moves={moves} />
        </>
      }
      <Inventory
        G={G}
        playerID={playerID}
        ctx={ctx}
        moves={moves}
        height={height * 0.4}
      />
      <div style={{ position: "absolute", right: 0, bottom: 0 }}>{enemies}</div>
      <Prompt G={G} playerID={playerID} ctx={ctx} moves={moves} />
    </div>
  );
}

export default Board;
