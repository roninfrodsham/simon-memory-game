import { ActionTypes, Action, GameStateProps } from "../types";

export function gameReducer(state: GameStateProps, action: Action): GameStateProps {
  switch (action.type) {
    case ActionTypes.START_GAME:
      return { ...state, isGameActive: true, simonMode: true };
    case ActionTypes.END_GAME:
      return action.payload;
    case ActionTypes.ADD_COLOUR:
      return { ...state, colours: [...state.colours, action.payload] };
    case ActionTypes.END_SIMON_MODE:
      return { ...state, simonMode: false, userColours: [...state.colours], speed: action.payload };
    case ActionTypes.USER_INPUT:
      return { ...state, userColours: [...state.userColours.slice(1)] };
    case ActionTypes.END_USER_MODE:
      return { ...state, simonMode: true, score: state.colours.length, userColours: [] };
    default:
      return state;
  }
}
