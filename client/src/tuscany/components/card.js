import React from "react";
import style from "../styles";
import Icon from "@mdi/react";
import "./card.css";

class Card extends React.Component {
  render() {
    const { type, stacked, onClick, active } = this.props;

    const iconStyle = {
      pointerEvents: "none",
      margin: "15px auto",
      display: "block",
    };

    return (
      <div
        onClick={onClick}
        className={`myCard ${stacked ? "stacked" : ""} ${
          active ? "cardActive" : ""
        }`}
        style={{ backgroundColor: style[type].fill }}
      >
        <Icon path={style[type].icon} size={1} style={iconStyle} />
      </div>
    );
  }
}

export default Card;
