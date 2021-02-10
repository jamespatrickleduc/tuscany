import React, { useLayoutEffect, useState } from "react";
//import PropTypes from "prop-types";
import "./board.css";

import Tile from "./components/tile";
import Region from "./components/region";
import Hand from "./components/hand";
import Bank from "./components/bank";
import Inventory from "./components/inventory";
import Prompt from "./components/prompt";
import Log from "./components/log";
import EnemyBoard from "./components/enemyBoard";

import useWindowSize from "./hooks/windowSize";
import Bonuses from "./components/bonuses";
import Badge from "react-bootstrap/Badge";

import Icon from "@mdi/react";
import {
  mdiNumeric1BoxOutline,
  mdiHumanHandsup,
  mdiGiftOutline,
  mdiDiamondOutline,
  mdiPlusOne,
} from "@mdi/js";

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
  const iconSize = height / 750;

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
    enemies.push(
      <EnemyBoard key={id} G={G} ctx={ctx} id={id} matchData={matchData} />,
    );
  });

  const settingUp = Object.values(ctx.activePlayers).reduce((acc, cur) => {
    if (cur === "setup") return true;
  }, false);

  const { greenPoints, redPoints } = G.players[playerID];
  const { upgrades } = G;

  return (
    <div
      className="tuscanyBoard"
      style={{ height, width, position: "relative" }}
    >
      <div style={{ display: "flex" }}>
        <Region G={G} playerID={playerID} ctx={ctx} moves={moves} />
        <Log G={G} playerID={playerID} ctx={ctx} matchData={matchData} />
      </div>
      {!settingUp && (
        <>
          <Bonuses G={G} height={height * 0.07} />
          <Hand G={G} playerID={playerID} ctx={ctx} moves={moves} />
          <Bank G={G} playerID={playerID} ctx={ctx} moves={moves} />
        </>
      )}
      <div style={{ position: "absolute", right: "54%", top: "55%" }}>
        My Points
        <Badge style={{ fontSize: 20, margin: 4 }} variant="success">
          {greenPoints}
        </Badge>
        <Badge style={{ fontSize: 20 }} variant="danger">
          {redPoints}
        </Badge>
      </div>
      <div style={{ position: "absolute", left: width / 100, top: "57%" }}>
        <Inventory
          G={G}
          playerID={playerID}
          ctx={ctx}
          moves={moves}
          height={height * 0.4}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: width / 100,
          bottom: "1%",
          width: "35%",
          display: "flex",
        }}
      >
        <div>Remaining: </div>
        <div style={{ width: "25%" }}>
          <Icon path={mdiNumeric1BoxOutline} size={iconSize} /> {upgrades.draw}
        </div>
        <div style={{ display: "flex", width: "25%" }}>
          <div style={{ width: height / 40, marginLeft: "25%" }}>
            <Tile
              type="socket"
              y={height / 55}
              size={height / 60}
              icon
              disabled
            />
          </div>
          <div>{upgrades.storage}</div>
        </div>
        <div style={{ width: "25%" }}>
          <Icon path={mdiDiamondOutline} size={iconSize} /> {upgrades.marble}
        </div>
        <div style={{ width: "25%" }}>
          <Icon path={mdiHumanHandsup} size={iconSize} /> {upgrades.workers}
        </div>
        <div style={{ width: "25%" }}>
          <Icon path={mdiGiftOutline} size={iconSize} /> {upgrades.yield}
        </div>
      </div>
      <div style={{ position: "absolute", right: 0, bottom: 0 }}>{enemies}</div>
      <Prompt G={G} playerID={playerID} ctx={ctx} moves={moves} />
    </div>
  );
}

export default Board;
