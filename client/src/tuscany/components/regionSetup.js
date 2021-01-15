import React, { useEffect, useState } from "react";
import { defineGrid, extendHex } from "honeycomb-grid";
import Tile from "./tile";
import { getArray } from "../regionConfig";
import Button from "react-bootstrap/Button";
import { Icon } from "@mdi/react";
import {
  mdiArrowUpBold,
  mdiArrowDownBold,
  mdiRotateLeft,
  mdiSwapHorizontal,
} from "@mdi/js";
import "./sharedRegion.css";

function RegionSetup({ G, ctx, moves, playerID, height }) {
  const [leftUp, setLeftUp] = useState(true);
  const [rightUp, setRightUp] = useState(true);
  const [tilesArray, setTilesArray] = useState([]);
  const [board, setBoard] = useState([]);

  const regions = G.players[playerID].regionTemplates;

  useEffect(() => {
    setTilesArray(getArray(...regions));
  }, [regions]);

  useEffect(() => {
    const newPosition = JSON.parse(startingPosition);
    newPosition.map((element, e) => {
      if (leftUp && e < 10) element.y++;
      if (rightUp && e > 19) element.y++;
      element.value = tilesArray[e];
      return element;
    });
    setBoard(newPosition);
  }, [tilesArray, leftUp, rightUp]);

  const HexSize = height / 13;

  const Hex = extendHex({ size: HexSize * 1.15, orientation: "flat" });
  const Grid = defineGrid(Hex);
  const tiles = [];
  const grid = Grid(board);

  grid.forEach((hex, h) => {
    if (hex.value !== undefined) {
      const { x, y } = hex.toPoint();
      tiles.push(
        <Tile key={h} size={HexSize} x={x + 30} y={y} type={hex.value} />,
      );
    }
  });

  const ToggleUpDownButton = ({ toggle, setter, className }) => {
    return (
      <Button
        className={className}
        variant="secondary"
        size="sm"
        onClick={() => {
          setter(!toggle);
        }}
      >
        <Icon path={toggle ? mdiArrowUpBold : mdiArrowDownBold} size={1} />
      </Button>
    );
  };

  return (
    <div className="outer">
      <div className="tileArea">{tiles}</div>
      <ToggleUpDownButton
        className="leftUpDown"
        toggle={leftUp}
        setter={setLeftUp}
      />
      <ToggleUpDownButton
        className="rightUpDown"
        toggle={rightUp}
        setter={setRightUp}
      />

      <Button
        size="sm"
        variant="secondary"
        className="rotateLeft"
        onClick={() => {
          setTilesArray([
            ...tilesArray.slice(0, 10).reverse(),
            ...tilesArray.slice(10, 20),
            ...tilesArray.slice(20, 30),
          ]);
        }}
      >
        <Icon path={mdiRotateLeft} size={1} />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="rotateMiddle"
        onClick={() => {
          setTilesArray([
            ...tilesArray.slice(0, 10),
            ...tilesArray.slice(10, 20).reverse(),
            ...tilesArray.slice(20, 30),
          ]);
        }}
      >
        <Icon path={mdiRotateLeft} size={1} />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="rotateRight"
        onClick={() => {
          setTilesArray([
            ...tilesArray.slice(0, 10),
            ...tilesArray.slice(10, 20),
            ...tilesArray.slice(20, 30).reverse(),
          ]);
        }}
      >
        <Icon path={mdiRotateLeft} size={1} />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="swapOneTwo"
        onClick={() => {
          setTilesArray([
            ...tilesArray.slice(10, 20),
            ...tilesArray.slice(0, 10),
            ...tilesArray.slice(20, 30),
          ]);
        }}
      >
        <Icon path={mdiSwapHorizontal} size={1} />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="swapTwoThree"
        onClick={() => {
          setTilesArray([
            ...tilesArray.slice(0, 10),
            ...tilesArray.slice(20, 30),
            ...tilesArray.slice(10, 20),
          ]);
        }}
      >
        <Icon path={mdiSwapHorizontal} size={1} />
      </Button>

      <Button
        className="boardSetupAccept"
        onClick={() => {
          moves.save_board_setup(playerID, board);
        }}
      >
        Accept
      </Button>
    </div>
  );
}
export default RegionSetup;

const startingPosition = JSON.stringify([
  {
    x: 0,
    y: 1,
  },
  {
    x: 0,
    y: 2,
  },
  {
    x: 0,
    y: 3,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 1,
    y: 2,
  },
  {
    x: 1,
    y: 3,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 2,
    y: 2,
  },
  {
    x: 2,
    y: 3,
  },
  {
    x: 3,
    y: 1,
  },
  {
    x: 3,
    y: 2,
  },
  {
    x: 3,
    y: 3,
  },
  {
    x: 4,
    y: 1,
  },
  {
    x: 4,
    y: 2,
  },
  {
    x: 4,
    y: 3,
  },
  {
    x: 4,
    y: 4,
  },
  {
    x: 5,
    y: 1,
  },
  {
    x: 5,
    y: 2,
  },
  {
    x: 5,
    y: 3,
  },
  {
    x: 6,
    y: 1,
  },
  {
    x: 6,
    y: 2,
  },
  {
    x: 6,
    y: 3,
  },
  {
    x: 7,
    y: 0,
  },
  {
    x: 7,
    y: 1,
  },
  {
    x: 7,
    y: 2,
  },
  {
    x: 7,
    y: 3,
  },
  {
    x: 8,
    y: 1,
  },
  {
    x: 8,
    y: 2,
  },
  {
    x: 8,
    y: 3,
  },
]);
