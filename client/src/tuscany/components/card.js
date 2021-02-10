import React from "react";
import style from "../styles";
import Icon from "@mdi/react";
import "./card.css";

class Card extends React.Component {
  render() {
    const { type, stacked, onClick, active, size } = this.props;

    const iconStyle = {
      pointerEvents: "none",
      margin: "40% auto",
      display: "block",
    };

    return (
      <div
        onClick={onClick}
        className={`myCard ${stacked ? "stacked" : ""} ${
          active ? "cardActive" : ""
        }`}
        style={{
          backgroundColor: style[type].fill,
          height: size,
          width: size * 0.75,
        }}
      >
        <Icon
          path={style[type].icon}
          size={size / 50}
          style={iconStyle}
          color={style[type]?.iconColor}
        />
      </div>
    );
  }
}

export default Card;
