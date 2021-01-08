import React from "react";
import Tile from "./tile";
import "./inventory.css";
import Icon from "@mdi/react";
import {
  mdiRomanNumeral1,
  mdiRomanNumeral2,
  mdiRomanNumeral3,
  mdiNumeric2BoxMultipleOutline,
  mdiNumeric1BoxOutline,
  mdiHumanHandsup,
  mdiGiftOutline,
  mdiDiamondOutline,
  mdiPlusOne,
} from "@mdi/js";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

class Inventory extends React.Component {
  render() {
    const { G, playerID, moves, ctx } = this.props;
    const {
      hexTiles,
      upgrades,
      storage,
      marble,
      workers,
      greenPoints,
      redPoints,
    } = G.players[playerID];

    const stackC = hexTiles.slice(0, 7).length;
    const stackB = hexTiles.slice(7, 14).length;
    const stackA = hexTiles.slice(14, 21).length;

    const storageHighlight = G.players[playerID].storageTileSelected;

    const DrawStack = ({ height }) => {
      return <span>{height}</span>;
    };

    const upgradeAvailable =
      ctx.activePlayers?.[playerID] === "choose_upgrade" ||
      G.players[playerID].settingUp === "upgrade";

    const UpgradeButton = ({ children, move }) => {
      return (
        <div style={{ display: "inline-block", width: "70px" }}>
          <div style={{ textAlign: "center", marginTop: "4px" }}>
            {children}
          </div>
          <Button
            size="sm"
            style={{
              display: upgradeAvailable ? "inline-block" : "none",
              marginLeft: "14px",
            }}
            onClick={() => {
              if (upgradeAvailable) move(playerID);
            }}
          >
            <Icon path={mdiPlusOne} size={1} />
          </Button>
        </div>
      );
    };

    return (
      <div className="inventory">
        <div className="gamePhase">Phase Progress:</div>
        <div className="gamePhase">
          <Icon path={mdiRomanNumeral1} size={1} />
          <DrawStack height={stackA} />
        </div>
        <div className="gamePhase">
          <Icon path={mdiRomanNumeral2} size={1} />
          <DrawStack height={stackB} />
        </div>
        <div className="gamePhase">
          <Icon path={mdiRomanNumeral3} size={1} />
          <DrawStack height={stackC} />
        </div>
        <div>
          <UpgradeButton move={moves.upgrade_draw}>Cards</UpgradeButton>
          <InvDraw draw={upgrades.draw} />
        </div>
        <div>
          <UpgradeButton move={moves.upgrade_storage}>Storage</UpgradeButton>
          <InvStorage
            level={upgrades.storage}
            stored={storage}
            moves={moves}
            highlight={storageHighlight}
            ctx={ctx}
            playerID={playerID}
            G={G}
          />
          <CancelReplaceStorage ctx={ctx} playerID={playerID} moves={moves} />
        </div>
        <div>
          <UpgradeButton move={moves.upgrade_marble}>Marble</UpgradeButton>
          <InvMarble marble={upgrades.marble} />
        </div>
        <div>
          <UpgradeButton move={moves.upgrade_workers}>Workers</UpgradeButton>
          <InvWorkers workers={upgrades.workers} />
        </div>
        <div>
          <UpgradeButton move={moves.upgrade_yield}>Yield</UpgradeButton>
          <InvYield wagon={upgrades.yield} />
        </div>
        <Points G={G} playerID={playerID} />
      </div>
    );
  }
}
export default Inventory;

const InvDraw = ({ draw }) => {
  let boxes = [];
  for (let b = 0; b <= draw; b++) {
    if (b === 0)
      boxes.push(
        <div key={b} className="upgrade">
          <Icon path={mdiNumeric2BoxMultipleOutline} size={1.3} />
        </div>
      );
    else
      boxes.push(
        <div key={b} className="upgrade">
          <Icon path={mdiNumeric1BoxOutline} size={1.3} />
        </div>
      );
  }
  return boxes;
};

const InvStorage = ({ level, stored, moves, highlight, ctx, playerID, G }) => {
  let boxes = [];
  for (let b = 0; b <= level; b++) {
    const type = stored[b] || "socket";
    const highlighted = highlight === b;
    boxes.push(
      <div key={"box" + b} className="upgrade">
        <Tile
          key={b}
          size={25}
          x={29}
          y={33}
          type={type}
          icon={true}
          highlighted={highlighted}
          onClick={() => {
            console.log("storage " + stored[b]);
            if (type !== "socket") {
              if (ctx.activePlayers[playerID] === "replace_storage") {
                const { bankTileSelected } = G.players[playerID];
                moves.replace_storage(bankTileSelected, b);
              } else moves.select_storage_tile(b);
            }
          }}
        />
      </div>
    );
  }
  return boxes;
};

const InvMarble = ({ marble }) => {
  let boxes = [];
  for (let b = 0; b <= marble; b++) {
    boxes.push(
      <div key={b} className="upgrade">
        <Icon path={mdiDiamondOutline} size={1.3} />
      </div>
    );
  }
  return boxes;
};

const InvWorkers = ({ workers }) => {
  let boxes = [];
  for (let b = 0; b <= workers; b++) {
    boxes.push(
      <div key={b} className="upgrade">
        <Icon path={mdiHumanHandsup} size={1.3} />
      </div>
    );
  }
  return boxes;
};

const InvYield = ({ wagon }) => {
  let boxes = [];
  for (let b = 0; b <= wagon; b++) {
    boxes.push(
      <div key={b} className="upgrade">
        <Icon path={mdiGiftOutline} size={1.3} />
      </div>
    );
  }
  return boxes;
};

const CancelReplaceStorage = ({ ctx, playerID, moves }) => {
  if (ctx.activePlayers[playerID] === "replace_storage") {
    return (
      <>
        Choose tile to replace.
        <Button
          onClick={() => {
            moves.cancel_move();
          }}
        >
          Cancel
        </Button>
      </>
    );
  }
  return <></>;
};

const Points = ({ G, playerID }) => {
  const { greenPoints, redPoints } = G.players[playerID];
  return (
    <div className={"ml-2"}>
      <div className="d-inline-block">
        Points
        <h3 className="d-inline-block ml-2">
          <Badge variant="success">{greenPoints}</Badge>
        </h3>
      </div>
      <div className="d-inline-block ml-2">
        <h3>
          <Badge variant="danger">{redPoints}</Badge>
        </h3>
      </div>
    </div>
  );
};
