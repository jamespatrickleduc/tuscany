import React, { useState, useEffect } from "react";
import Card from "./card";
import "./hand.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Tile from "./tile";

function Hand({ G, ctx, playerID, moves }) {
  const [selected, setSelected] = useState([]);
  const [worth, setWorth] = useState(0);
  const [declaredWild, setDeclaredWild] = useState("socket");

  const isInteracting = ctx.activePlayers?.[playerID] === "pay_for_tile";
  const canDraw = ctx.activePlayers?.[playerID] === "do_action";
  const storageIndex = G.players[playerID].storageTileSelected;
  const tileType = G.players[playerID].storage[storageIndex];
  const undeclaredWild = tileType === "wild" && declaredWild === "socket";

  const toggleCard = (index) => {
    if (selected.includes(index)) {
      setSelected(() => selected.filter((el) => el !== index));
    } else setSelected(() => [...selected, index]);
  };

  let cards = [];
  let previous = undefined;
  let combinedHand = [
    ...Array(G.players[playerID].workers).fill("worker"),
    ...G.players[playerID].hand,
  ];
  combinedHand.forEach((card, c) => {
    const stacked = c !== 0 && previous === card;
    cards.push(
      <Card
        type={card}
        key={c}
        stacked={stacked}
        onClick={() => {
          console.log("clicked card");
          if (isInteracting && !undeclaredWild) {
            toggleCard(c);
          }
        }}
        active={selected.includes(c)}
      />
    );
    previous = card;
  });

  useEffect(() => {
    if (!isInteracting) return;

    console.log(selected);
    let w = 0;
    let resources = [];
    selected.forEach((index) => {
      resources.push(combinedHand[index]);
      if (combinedHand[index] === "worker") w += 1;
      else if (
        tileType?.split("/")[0] === combinedHand[index] ||
        declaredWild === combinedHand[index]
      )
        w += 1;
      else w += 0.5;
    });
    setWorth(w);
    moves.update_spend_resources(resources, w);
  }, [selected]);

  useEffect(() => {
    console.log({ isInteracting });
    if (!isInteracting) {
      setSelected([]);
      setWorth(0);
      setDeclaredWild("socket");
    }
  }, [isInteracting]);

  const WildDeclarer = () => {
    if (tileType === "wild") {
      const Item = ({ tile }) => {
        return (
          <Dropdown.Item as="div" eventKey={tile}>
            <div
              style={{
                position: "relative",
                height: "40px",
                width: "40px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              <Tile size={20} x={20} y={20} type={tile} icon={true} />
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                verticalAlign: "middle",
              }}
              className="ml-3"
            >
              {tile}
            </div>
          </Dropdown.Item>
        );
      };

      const declareWild = (e) => {
        console.log(e);
        setDeclaredWild(e);
        setSelected([...selected]);
        moves.declare_wild(e);
      };

      return (
        <>
          <Dropdown
            onSelect={declareWild}
            className={"d-inline-block align-middle"}
          >
            <Dropdown.Toggle>What will the wild be?</Dropdown.Toggle>

            <Dropdown.Menu>
              <Item tile="castle" />
              <Item tile="city" />
              <Item tile="farm" />
              <Item tile="inn" />
              <Item tile="monastery" />
              <Item tile="quarry" />
              <Item tile="village" />
              <Item tile="wagon" />
            </Dropdown.Menu>
          </Dropdown>
          <div
            className={"position-relative d-inline-block ml-3 align-middle"}
            style={{
              height: "40px",
              width: "40px",
            }}
          >
            <Tile size={20} x={20} y={20} type={declaredWild} icon={true} />
          </div>
        </>
      );
    } else return <></>;
  };

  const PurchasePrompt = () => {
    if (isInteracting) {
      return (
        <div className="purchasePrompt">
          <span>{worth}/2</span> How will you pay for your{" "}
          {tileType.split("/")[0]}?
          <Button
            onClick={() => {
              moves.cancel_move();
            }}
          >
            Cancel
          </Button>
        </div>
      );
    } else return <></>;
  };

  return (
    <div className="handContainer">
      <WildDeclarer />
      <PurchasePrompt />
      <Button
        className="ml-2"
        disabled={!canDraw}
        onClick={() => {
          moves.draw_cards();
        }}
        size="lg"
      >
        Draw
      </Button>
      <div className="sizer"></div>
      {cards}
    </div>
  );
}

export default Hand;
