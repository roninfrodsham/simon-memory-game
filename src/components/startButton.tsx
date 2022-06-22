function StartButton({ onClick, activeGame }: {onClick: () => void, activeGame: boolean}) {
  return (
    <div className="startContainer cc">
      <div className="startButtonShadow cc circle">
        <div
          className={`startButton circle cc ${activeGame ? "active" : "idle"}`}
          onClick={onClick}
        ></div>
      </div>
    </div>
  );
}

export { StartButton };