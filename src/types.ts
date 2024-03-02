/**
 * Represents the state of the game.
 */
export type GameStateProps = {
  isGameActive: boolean; // Whether the game is currently active
  simonMode: boolean; // Whether the game is in Simon mode
  colours: Colour[]; // The sequence of colours that the user needs to repeat
  score: number; // The current score
  speed: number; // The speed of the game
  audioPlayback: number; // The current audio playback
  userColours: Colour[]; // The sequence of colours entered by the user
};

/**
 * Represents the possible colours in the game.
 */
export enum Colour {
  GREEN = "green",
  RED = "red",
  YELLOW = "yellow",
  BLUE = "blue",
}

/**
 * Represents the possible actions that can be dispatched to the game reducer.
 */
export enum ActionTypes {
  START_GAME = "START_GAME",
  END_GAME = "END_GAME",
  ADD_COLOUR = "ADD_COLOUR",
  END_SIMON_MODE = "END_SIMON_MODE",
  USER_INPUT = "USER_INPUT",
  END_USER_MODE = "END_USER_MODE",
}

/**
 * Represents an action that can be dispatched to the game reducer.
 */
export type Action =
  | { type: ActionTypes.START_GAME }
  | { type: ActionTypes.END_GAME }
  | { type: ActionTypes.ADD_COLOUR; payload: Colour }
  | { type: ActionTypes.END_SIMON_MODE; payload: number }
  | { type: ActionTypes.USER_INPUT; payload: Colour }
  | { type: ActionTypes.END_USER_MODE };
