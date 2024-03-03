import { useState, useEffect, useLayoutEffect, useReducer } from "react";
import { gameReducer } from "./reducer/gameReducer";
import { GameButton, StartButton } from "./components";
import { getRandomInt, timeout } from "./utils/misc";
import { Colour, ActionTypes, Action, GameStateProps } from "./types";
import {
  COLOURS_COUNT,
  INITIAL_SPEED,
  SPEED_DECREMENT,
  MIN_SPEED,
  AUDIO_PLAYBACK,
  TIMEOUT_DURATION,
  LIGHT_UP_DELAY,
  ERROR_DELAY,
} from "./constants";
import logo from "./logo.svg";
import "./App.css";

import greenMp3 from "./sounds/green.mp3";
import redMp3 from "./sounds/red.mp3";
import yellowMp3 from "./sounds/yellow.mp3";
import blueMp3 from "./sounds/blue.mp3";
import errorMp3 from "./sounds/error.mp3";

const greenSound = new Audio(greenMp3);
const redSound = new Audio(redMp3);
const yellowSound = new Audio(yellowMp3);
const blueSound = new Audio(blueMp3);
const errorSound = new Audio(errorMp3);

const soundMap = {
  [Colour.GREEN]: greenSound,
  [Colour.RED]: redSound,
  [Colour.YELLOW]: yellowSound,
  [Colour.BLUE]: blueSound,
};

const colours: Colour[] = [Colour.GREEN, Colour.RED, Colour.YELLOW, Colour.BLUE];

const initialGameState: GameStateProps = {
  isGameActive: false,
  simonMode: false,
  colours: [],
  score: 0,
  speed: INITIAL_SPEED,
  audioPlayback: AUDIO_PLAYBACK,
  userColours: [],
};

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
    if (!gameState.simonMode && gameState.isGameActive) {
      const userColoursCopy = [...gameState.userColours];
      const colour = userColoursCopy.shift();
      setCurrentColour(selectedColour);
      playSound(selectedColour);

      if (selectedColour === colour) {
        if (userColoursCopy.length) {
          dispatch({ type: ActionTypes.USER_INPUT });
        } else {
          await timeout(TIMEOUT_DURATION);
          setCurrentColour("");
          dispatch({ type: ActionTypes.END_USER_MODE });
        }
      } else {
        errorSound.play();
        await timeout(ERROR_DELAY);
        dispatch({ type: ActionTypes.END_GAME, payload: initialGameState });
      }
      await timeout(TIMEOUT_DURATION);
      setCurrentColour("");
    }
  };

  const playSound = (selectedColour: Colour) => {
    const sound = soundMap[selectedColour];
    if (sound) {
      sound.playbackRate = gameState.audioPlayback;
      sound.play();
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
            active={gameState.isGameActive}
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
