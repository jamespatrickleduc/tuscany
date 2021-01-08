import React, { useState, useEffect, useRef } from "react";
import Tile from "./tile";
import "./prompt.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Prompt({ G, playerID, ctx, moves }) {
  const showMarblePrompt = ctx.activePlayers?.[playerID] === "use_marble";
  const { marble } = G.players[playerID];

  const [centered, setCentered] = useState(true);

  const handleClose = () => {
    console.log("handle close");
  };

  const UseMarble = ({ show }) => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered={centered}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>You have {marble} Marble</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you like to use a marble to take an extra turn?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="mr-5"
            onClick={() => {
              setCentered(!centered);
            }}
          >
            Move Popup
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              moves.dont_use_marble();
            }}
          >
            End Turn
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              moves.use_marble();
            }}
          >
            Use a Marble
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <UseMarble show={showMarblePrompt} />
    </>
  );
}

export default Prompt;
