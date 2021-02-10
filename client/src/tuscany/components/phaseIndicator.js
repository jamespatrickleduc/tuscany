import React from "react";
import Stack from "./stack";
import Icon from "@mdi/react";
import { mdiRomanNumeral1, mdiRomanNumeral2, mdiRomanNumeral3 } from "@mdi/js";
function PhaseIndicator({ G, playerID, height }) {
  const { hexTiles } = G.players[playerID];
  const stackC = hexTiles.slice(0, 7).length;
  const stackB = hexTiles.slice(7, 14).length;
  const stackA = hexTiles.slice(14, 21).length;

  return (
    <>
      <Icon
        path={mdiRomanNumeral1}
        size={0.9}
        style={{ position: "absolute", left: "-50%" }}
      />
      <Stack height={height / 3} num={stackA} />
      <Icon
        path={mdiRomanNumeral2}
        size={0.9}
        style={{ position: "absolute", left: "-50%" }}
      />
      <Stack height={height / 3} num={stackB} />
      <Icon
        path={mdiRomanNumeral3}
        size={0.9}
        style={{ position: "absolute", left: "-50%" }}
      />
      <Stack height={height / 3} num={stackC} />
    </>
  );
}
export default PhaseIndicator;
