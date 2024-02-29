import { ReactElement } from "react";
import { Colour } from "../types";

type GameButtonProps = {
  colour: Colour;
  lightUp: boolean;
  onClick: (colour: Colour) => void;
  active: boolean;
};

function GameButton({ colour, lightUp, onClick, active }: GameButtonProps): ReactElement {
  return (
    <div
      className={`gameButton pa ${colour} ${lightUp ? "on" : ""} ${active ? "active" : ""}`}
      onClick={() => onClick(colour)}
    ></div>
  );
}

export { GameButton };
