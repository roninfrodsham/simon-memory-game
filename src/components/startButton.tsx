import { ReactElement } from "react";

type StartButtonProps = {
  onClick: () => void;
  activeGame: boolean;
};

function StartButton({ onClick, activeGame }: StartButtonProps): ReactElement {
  return (
    <div className='startContainer cc'>
      <div className='startButtonShadow cc circle'>
        <div className={`startButton circle cc ${activeGame ? "active" : "idle"}`} onClick={onClick}></div>
      </div>
    </div>
  );
}

export { StartButton };
