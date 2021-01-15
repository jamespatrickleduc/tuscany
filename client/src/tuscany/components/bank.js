import React from "react";
import Tile from "./tile";
import "./bank.css";

class Bank extends React.Component {
  render() {
    const { G, playerID, moves, ctx, highlighted } = this.props;

    let tiles = [];
    G.tileBank.forEach((tile, t) => {
      const highlighted = G.players[playerID].bankTileSelected === t;
      tiles.push(
        <div key={t} className="tileHolder">
          <Tile
            size={28}
            x={30}
            y={30}
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
        </div>
      );
    });

    return (
      <div className="bank">
        <div className="bankTitle h5 text-center mb-3">Tile Bank</div>
        {tiles}
      </div>
    );
  }
}

export default Bank;
