import { useState, useEffect, useReducer, useCallback } from "react";
import { gameReducer } from "./reducer/gameReducer";
import { GameButton, StartButton } from "./components";
import { getRandomInt, timeout } from "./utils/misc";
import { soundMap, errorSound } from "./utils/sounds";
import { Colour, ActionTypes, GameStateProps } from "./types";
import {
  COLOURS_COUNT,
  INITIAL_SPEED,
  SPEED_DECREMENT,
  MIN_SPEED,
  AUDIO_PLAYBACK,
  TIMEOUT_DURATION,
  LIGHT_START_DELAY,
  LIGHT_END_DELAY,
  ERROR_DELAY,
  COLOURS,
} from "./constants";
import logo from "./logo.svg";
import "./App.css";

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

  const startGame = useCallback(() => {
    dispatch({ type: ActionTypes.START_GAME });
  }, []);

  useEffect(() => {
    if (gameState.simonMode) {
      dispatch({ type: ActionTypes.ADD_COLOUR, payload: COLOURS[getRandomInt(COLOURS_COUNT)] });
    }
  }, [gameState.simonMode]);

  useEffect(() => {
    if (gameState.isGameActive && gameState.colours.length) {
      lightUpColours();
    }
  }, [gameState.isGameActive, gameState.colours]);

  async function lightUpColours() {
    await timeout(LIGHT_START_DELAY);
    for (let index = 0; index < gameState.colours.length; index++) {
      setCurrentColour(gameState.colours[index]);
      playSound(gameState.colours[index]);
      await timeout(gameState.speed);
      setCurrentColour("");
      await timeout(LIGHT_END_DELAY);
    }
    const newGameSpeed = gameState.speed - SPEED_DECREMENT < MIN_SPEED ? MIN_SPEED : gameState.speed - SPEED_DECREMENT;
    dispatch({ type: ActionTypes.END_SIMON_MODE, payload: newGameSpeed });
  }

  const gameButtonClickHandle = async (selectedColour: Colour) => {
    if (!gameState.simonMode && gameState.isGameActive) {
      const colour = gameState.userColours[0];

      setCurrentColour(selectedColour);
      playSound(selectedColour);

      if (selectedColour === colour) {
        if (gameState.userColours.length > 1) {
          dispatch({ type: ActionTypes.USER_INPUT });
        } else {
          dispatch({ type: ActionTypes.END_USER_MODE });
          await timeout(TIMEOUT_DURATION);
          setCurrentColour("");
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
      sound.play().catch((error) => {
        console.error(`Failed to play sound: ${error}`);
      });
    }
  };

  return (
    <div className='simon circle oh bGray'>
      <div className='buttonsContainer pa circle oh'>
        {COLOURS.map((colour) => (
          <GameButton
            colour={colour}
            lightUp={currentColour === colour}
            onClick={gameButtonClickHandle}
            key={colour}
            active={gameState.isGameActive && !gameState.simonMode}
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
