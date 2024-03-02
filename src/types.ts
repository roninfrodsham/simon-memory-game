export type GameStateProps = {
  isGameActive: boolean;
  simonMode: boolean;
  colours: Colour[];
  score: number;
  speed: number;
  audioPlayback: number;
  userPlay: boolean;
  userColours: Colour[];
};

export enum Colour {
  GREEN = "green",
  RED = "red",
  YELLOW = "yellow",
  BLUE = "blue",
}

export enum ActionTypes {
  START_GAME = "START_GAME",
  END_GAME = "END_GAME",
  ADD_COLOUR = "ADD_COLOUR",
  END_SIMON_MODE = "END_SIMON_MODE",
  USER_INPUT = "USER_INPUT",
  END_USER_MODE = "END_USER_MODE",
}

export type Action =
  | { type: ActionTypes.START_GAME }
  | { type: ActionTypes.END_GAME }
  | { type: ActionTypes.ADD_COLOUR; payload: Colour }
  | { type: ActionTypes.END_SIMON_MODE; payload: number }
  | { type: ActionTypes.USER_INPUT; payload: Colour }
  | { type: ActionTypes.END_USER_MODE };
