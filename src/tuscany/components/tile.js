import React from "react";
import "./tile.css";
import style from "../styles";
import Icon from "@mdi/react";
class Tile extends React.Component {
  render() {
    const {
      x,
      y,
      size,
      type: t,
      onClick,
      icon,
      highlighted,
      wild,
    } = this.props;

    const type = t.split("/")[0];
    const specialIcon = t.split("/")[1]?.split("&");

    const shadowColor = highlighted ? "#F00" : "#000";
    const shadowWrap = {
      filter: `drop-shadow(0px 0px 3px ${shadowColor})`,
      position: "absolute",
      left: x,
      top: y,
    };

    const Hex = ({ size: s, color, name }) => {
      const hexStyle = {
        position: "absolute",
        width: `${2 * s}px`,
        height: `${2 * s}px`,
        transform: "translate(-50%,-50%)",
        backgroundColor: color,
        WebkitClipPath:
          "polygon(100% 43%, 75% 87%, 25% 87%, 0% 43%, 25% 0%, 75% 0%)",
        clipPath: "polygon(100% 43%, 75% 87%, 25% 87%, 0% 43%, 25% 0%, 75% 0%)",
        cursor: "pointer",
      };
      return <div style={hexStyle} className={name} onClick={onClick}></div>;
    };

    const HexIcon = () => {
      if (icon && !wild) {
        if (specialIcon) {
          let icons = [];
          icons.push(
            <Icon key="1" path={style[specialIcon[0]].icon} size={1} />
          );
          if (specialIcon.length === 2) {
            icons.push(
              <Icon key="2" path={style[specialIcon[1]].icon} size={1} />
            );
          }
          const w = specialIcon.length === 2 ? "48px" : null;
          return (
            <span className="icon" style={{ width: w }}>
              {icons}
            </span>
          );
        } else
          return <Icon path={style[type].icon} size={1} className="icon" />;
      } else return <></>;
    };

    const Wild = () => {
      if (wild) {
        return (
          <>
            <Hex color="#333" size={size * 0.7 + 2}></Hex>
            <Hex color={style.wild.fill} size={size * 0.7}></Hex>
            <Icon path={style.wild.icon} size={1} className="icon" />;
          </>
        );
      } else return <></>;
    };

    return (
      <div style={shadowWrap}>
        <Hex color={highlighted ? "#F00" : "#333"} size={size + 2}></Hex>
        <Hex color={style[type].fill} size={size} name="innerHex"></Hex>
        <HexIcon />
        <Wild />
      </div>
    );
  }
}

export default Tile;
