import { useState, useEffect, useLayoutEffect, useReducer } from "react";
import { GameButton, StartButton } from "./components";
import { getRandomInt, timeout } from "./utils/misc";
import { Colour, ActionTypes, Action, GameStateProps } from "./types";
import logo from "./logo.svg";
import "./App.css";

import greenMp3 from "./sounds/green.mp3";
import redMp3 from "./sounds/red.mp3";
import yellowMp3 from "./sounds/yellow.mp3";
import blueMp3 from "./sounds/blue.mp3";
import errorMp3 from "./sounds/error.mp3";

const COLOURS_COUNT = 4;
const INITIAL_SPEED = 800;
const SPEED_DECREMENT = 100;
const MIN_SPEED = 200;
const AUDIO_PLAYBACK = 2;
const TIMEOUT_DURATION = 200;
const LIGHT_UP_DELAY = 1000;
const ERROR_DELAY = 500;

// switch these to use an oscillator!!!!
const greenSound = new Audio(greenMp3);
const redSound = new Audio(redMp3);
const yellowSound = new Audio(yellowMp3);
const blueSound = new Audio(blueMp3);
const errorSound = new Audio(errorMp3);

const colours: Colour[] = [Colour.GREEN, Colour.RED, Colour.YELLOW, Colour.BLUE];

const initialGameState: GameStateProps = {
  isGameActive: false,
  simonMode: false,
  colours: [],
  score: 0,
  speed: INITIAL_SPEED,
  audioPlayback: AUDIO_PLAYBACK,
  userPlay: false,
  userColours: [],
};

function gameReducer(state: GameStateProps, action: Action): GameStateProps {
  switch (action.type) {
    case ActionTypes.START_GAME:
      return { ...state, isGameActive: true, simonMode: true };
    case ActionTypes.END_GAME:
      return { ...initialGameState };
    case ActionTypes.ADD_COLOUR:
      const coloursCopy = [...state.colours];
      coloursCopy.push(action.payload);
      return { ...state, colours: coloursCopy };
    case ActionTypes.END_SIMON_MODE:
      return { ...state, simonMode: false, userPlay: true, userColours: [...state.colours], speed: action.payload };
    case ActionTypes.USER_INPUT:
      const userColoursCopy = [...state.userColours];
      const colour = userColoursCopy.shift();
      return { ...state, userColours: userColoursCopy };
    case ActionTypes.END_USER_MODE:
      return { ...state, simonMode: true, userPlay: false, score: state.colours.length, userColours: [] };
    default:
      return state;
  }
}

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [currentColour, setCurrentColour] = useState<string | null>(null);

  const startGame = () => {
    dispatch({ type: ActionTypes.START_GAME });
  };

  useLayoutEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (gameState.isGameActive && gameState.simonMode) {
      console.log("Adding colour");
      dispatch({ type: ActionTypes.ADD_COLOUR, payload: colours[getRandomInt(COLOURS_COUNT)] });
    }
  }, [gameState.simonMode]);

  useEffect(() => {
    if (gameState.isGameActive && gameState.simonMode && gameState.colours.length) {
      lightUpColours();
    }
  }, [gameState.isGameActive, gameState.simonMode, gameState.colours.length]);

  async function lightUpColours() {
    await timeout(LIGHT_UP_DELAY);
    for (let index = 0; index < gameState.colours.length; index++) {
      setCurrentColour(gameState.colours[index]);
      playSound(gameState.colours[index]);
      await timeout(gameState.speed);
      setCurrentColour("");
      await timeout(gameState.speed);
    }
    const newGameSpeed = gameState.speed - SPEED_DECREMENT < MIN_SPEED ? MIN_SPEED : gameState.speed - SPEED_DECREMENT;
    dispatch({ type: ActionTypes.END_SIMON_MODE, payload: newGameSpeed });
  }

  const gameButtonClickHandle = async (selectedColour: Colour) => {
    if (!gameState.simonMode && gameState.userPlay) {
      const userColoursCopy = [...gameState.userColours];
      const colour = userColoursCopy.shift();
      setCurrentColour(selectedColour);
      playSound(selectedColour);

      if (selectedColour === colour) {
        if (userColoursCopy.length) {
          dispatch({ type: ActionTypes.USER_INPUT, payload: selectedColour });
        } else {
          await timeout(TIMEOUT_DURATION);
          setCurrentColour("");
          dispatch({ type: ActionTypes.END_USER_MODE });
        }
      } else {
        errorSound.play();
        await timeout(ERROR_DELAY);
        dispatch({ type: ActionTypes.END_GAME });
      }
      await timeout(TIMEOUT_DURATION);
      setCurrentColour("");
    }
  };

  const playSound = (selectedColour: Colour) => {
    switch (selectedColour) {
      case "green":
        greenSound.playbackRate = gameState.audioPlayback;
        greenSound.play();
        break;
      case "red":
        redSound.playbackRate = gameState.audioPlayback;
        redSound.play();
        break;
      case "yellow":
        yellowSound.playbackRate = gameState.audioPlayback;
        yellowSound.play();
        break;
      case "blue":
        blueSound.playbackRate = gameState.audioPlayback;
        blueSound.play();
        break;
    }
  };

  return (
    <div className='simon circle oh bGray'>
      <div className='buttonsContainer pa circle oh'>
        {colours.map((colour) => (
          <GameButton
            colour={colour}
            lightUp={currentColour === colour}
            onClick={gameButtonClickHandle}
            key={colour}
            active={gameState.userPlay}
          />
        ))}
        <div className='divider pa hoz bGray shadow10'></div>
        <div className='divider pa vert bGray shadow10'></div>
        <div className='divider pa hoz bGray z10'></div>
        <div className='divider pa vert bGray z10'></div>
      </div>
      <div className='centreContainer cc pa circle bGray shadow10'>
        <div className='centreSpacer circle oh'>
          <div className='speakerContainer pa circle oh'>
            <div className='speakerClip'>
              <div className='speaker'></div>
            </div>
          </div>
          <div className='controlsContainer pa circle oh'>
            <div className='controlsInner cc'>
              <img src={logo} className='logo bGray' alt='Simon Logo' />
              <div className='controls cc'>
                <div className='screenShadow cc'>
                  <div className='screen cc'>
                    <input type='text' value={gameState.score} disabled />
                  </div>
                </div>
                <StartButton onClick={startGame} activeGame={gameState.isGameActive} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { App };
