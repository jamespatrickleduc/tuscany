import React from "react";
import { defineGrid, extendHex } from "honeycomb-grid";
import Tile from "./tile";
import "./sharedRegion.css";

class RegionPlay extends React.Component {
  render() {
    const { G, ctx, moves, playerID } = this.props;

    const {
      board,
      worthOfResources,
      storageTileSelected,
      bankTileSelected,
      storage,
      settingUp,
      declaredWild,
    } = G.players[playerID];

    const Hex = extendHex({ size: 33, orientation: "flat" });
    const Grid = defineGrid(Hex);
    const tiles = [];
    const grid = Grid(board);

    const canAffordTile =
      ctx.activePlayers?.[playerID] === "pay_for_tile" &&
      worthOfResources === 2;

    grid.forEach((hex, h) => {
      const { x, y } = hex.toPoint();

      const isPickingFreebie =
        ctx.activePlayers?.[playerID] === "choose_free_tile" &&
        bankTileSelected !== null &&
        G.tileBank[bankTileSelected].split("/")?.[0] === board[h].value;
      let buying =
        canAffordTile &&
        (storage[storageTileSelected].split("/")[0] === board[h].value ||
          (storage[storageTileSelected] === "wild" &&
            declaredWild === board[h].value));

      let start_castle = settingUp === "castle" && board[h].value === "castle";
      let elligible =
        grid
          .neighborsOf(hex)
          .map((element) => element?.inhabited)
          .includes(true) && !board[h].inhabited;

      tiles.push(
        <Tile
          key={h}
          size={28}
          x={x + 30}
          y={y}
          type={board[h].value}
          icon={board[h].inhabited}
          wild={board[h].wild}
          highlighted={
            (elligible && buying) ||
            (elligible && isPickingFreebie) ||
            start_castle
          }
          onClick={() => {
            console.log({ elligible, buying, start_castle, isPickingFreebie });
            //console.log({ buying, start_castle, isPickingFreebie });
            if (elligible && buying) moves.pay_for_tile(h);
            else if (start_castle) moves.place_starting_castle(h, playerID);
            else if (elligible && isPickingFreebie) moves.place_tile(h);
          }}
        />
      );
    });

    return (
      <div className="outer" style={{ height: "280px", width: "500px" }}>
        <div className="tileArea">{tiles}</div>
      </div>
    );
  }
}

export default RegionPlay;
