function GameButton({ colour, lightUp, onClick, active }: { colour: string, lightUp: boolean, onClick: any, active: boolean }) {
  return (
    <div
      className={`gameButton pa ${colour} ${lightUp ? "on" : ""} ${
        active ? "active" : ""
      }`}
      onClick={() => onClick(colour)}
    ></div>
  );
}

export { GameButton };