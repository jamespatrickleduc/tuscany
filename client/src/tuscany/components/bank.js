import React from "react";
import Tile from "./tile";
import "./bank.css";
import useWindowSize from "../hooks/windowSize";

function Bank({ G, playerID, moves, ctx, highlighted }) {
  let [width, height] = useWindowSize();

  const tileSize = height / 35;

  let tiles = [];
  G.tileBank.forEach((tile, t) => {
    const highlighted = G.players[playerID].bankTileSelected === t;
    tiles.push(
      <div
        key={t}
        style={{
          position: "relative",
          height: tileSize * 2,
          width: tileSize * 2.5,
          display: "inline-block",
        }}
      >
        <Tile
          size={tileSize}
          x={tileSize}
          y={tileSize}
          type={tile}
          icon={true}
          highlighted={highlighted}
          onClick={() => {
            console.log("fart " + tile);
            if (ctx.activePlayers[playerID] === "choose_free_tile") {
              moves.choose_freebie(t);
            } else moves.select_bank_tile(t);
          }}
        />
      </div>,
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        right: "52%",
        bottom: "2%",
        width: tileSize * 5,
      }}
    >
      <div className="h5 text-center mb-3">Tile Bank</div>
      {tiles}
    </div>
  );
}

export default Bank;
