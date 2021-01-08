import React from "react";
import PropTypes from "prop-types";
import "./board.css";

import Region from "./components/region";
import Hand from "./components/hand";
import Bank from "./components/bank";
import Inventory from "./components/inventory";
import Prompt from "./components/prompt";
import Log from "./components/log";

class Board extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
    isConnected: PropTypes.bool,
    isPreview: PropTypes.bool,
  };

  render() {
    console.log(this.props);
    const { G, playerID, moves, ctx, matchData } = this.props;

    return (
      <div
        className="tuscanyBoard"
        style={{
          height: window.innerHeight,
          width: window.innerHeight * (4 / 3),
        }}
      >
        <div style={{ display: "flex" }}>
          <Region G={G} playerID={playerID} ctx={ctx} moves={moves} />
          <Log G={G} playerID={playerID} ctx={ctx} matchData={matchData} />
        </div>
        <Hand G={G} playerID={playerID} ctx={ctx} moves={moves} />
        <Inventory G={G} playerID={playerID} ctx={ctx} moves={moves} />
        <Bank G={G} playerID={playerID} ctx={ctx} moves={moves} />
        <Prompt G={G} playerID={playerID} ctx={ctx} moves={moves} />
      </div>
    );
  }
}

export default Board;
