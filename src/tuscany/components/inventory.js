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
  mdiSizeM,
} from "@mdi/js";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import useWindowSize from "../hooks/windowSize";

function Inventory({ G, playerID, moves, ctx, disabled, height }) {
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

  const UpgradeSize = height / 6;
  const IconSize = height / 200;

  const upgradeAvailable =
    ctx.activePlayers?.[playerID] === "choose_upgrade" ||
    G.players[playerID].settingUp === "upgrade";

  const UpgradeButton = ({ children, move }) => {
    return (
      <div style={{ display: "inline-block", width: "70px" }}>
        <div style={{ textAlign: "center", marginTop: "4px" }}>{children}</div>
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

  const InvDraw = () => {
    let boxes = [];
    for (let b = 0; b <= upgrades.draw; b++) {
      if (b === 0)
        boxes.push(
          <div
            key={b}
            className="upgrade"
            style={{ height: UpgradeSize, width: UpgradeSize }}
          >
            <Icon path={mdiNumeric2BoxMultipleOutline} size={IconSize} />
          </div>,
        );
      else
        boxes.push(
          <div
            key={b}
            className="upgrade"
            style={{ height: UpgradeSize, width: UpgradeSize }}
          >
            <Icon path={mdiNumeric1BoxOutline} size={IconSize} />
          </div>,
        );
    }
    return boxes;
  };

  const InvStorage = () => {
    let boxes = [];
    for (let b = 0; b <= upgrades.storage; b++) {
      const type = storage[b] || "socket";
      const highlighted = storageHighlight === b;
      boxes.push(
        <div
          key={"box" + b}
          className="upgrade"
          style={{ height: UpgradeSize, width: UpgradeSize }}
        >
          <Tile
            key={b}
            size={UpgradeSize * 0.35}
            x={UpgradeSize * 0.5}
            y={UpgradeSize * 0.5}
            type={type}
            icon={true}
            highlighted={highlighted}
            onClick={() => {
              console.log("storage " + storage[b]);
              if (type !== "socket") {
                if (ctx.activePlayers[playerID] === "replace_storage") {
                  const { bankTileSelected } = G.players[playerID];
                  moves.replace_storage(bankTileSelected, b);
                } else moves.select_storage_tile(b);
              }
            }}
          />
        </div>,
      );
    }
    return boxes;
  };

  const InvMarble = () => {
    let boxes = [];
    for (let b = 0; b <= upgrades.marble; b++) {
      boxes.push(
        <div
          key={b}
          className="upgrade"
          style={{ height: UpgradeSize, width: UpgradeSize }}
        >
          <Icon path={mdiDiamondOutline} size={IconSize} />
        </div>,
      );
    }
    return boxes;
  };

  const InvWorkers = () => {
    let boxes = [];
    for (let b = 0; b <= upgrades.workers; b++) {
      boxes.push(
        <div
          key={b}
          className="upgrade"
          style={{ height: UpgradeSize, width: UpgradeSize }}
        >
          <Icon path={mdiHumanHandsup} size={IconSize} />
        </div>,
      );
    }
    return boxes;
  };

  const InvYield = () => {
    let boxes = [];
    for (let b = 0; b <= upgrades.yield; b++) {
      boxes.push(
        <div
          key={b}
          className="upgrade"
          style={{ height: UpgradeSize, width: UpgradeSize }}
        >
          <Icon path={mdiGiftOutline} size={IconSize} />
        </div>,
      );
    }
    return boxes;
  };

  return (
    <div className="inventory" style={{ height, width: height }}>
      {/* 
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
      */}
      <div>
        {!disabled && (
          <UpgradeButton move={moves.upgrade_draw}>Cards</UpgradeButton>
        )}
        <InvDraw />
      </div>
      <div>
        {!disabled && (
          <UpgradeButton move={moves.upgrade_storage}>Storage</UpgradeButton>
        )}
        <InvStorage />
        <CancelReplaceStorage ctx={ctx} playerID={playerID} moves={moves} />
      </div>
      <div>
        {!disabled && (
          <UpgradeButton move={moves.upgrade_marble}>Marble</UpgradeButton>
        )}
        <InvMarble />
      </div>
      <div>
        {!disabled && (
          <UpgradeButton move={moves.upgrade_workers}>Workers</UpgradeButton>
        )}
        <InvWorkers />
      </div>
      <div>
        {!disabled && (
          <UpgradeButton move={moves.upgrade_yield}>Yield</UpgradeButton>
        )}
        <InvYield />
      </div>
      {/*<Points G={G} playerID={playerID} />*/}
    </div>
  );
}
export default Inventory;

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
