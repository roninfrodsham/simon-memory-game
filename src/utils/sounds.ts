import greenMp3 from "../sounds/green.mp3";
import redMp3 from "../sounds/red.mp3";
import yellowMp3 from "../sounds/yellow.mp3";
import blueMp3 from "../sounds/blue.mp3";
import errorMp3 from "../sounds/error.mp3";
import { Colour } from "../types";

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

export { soundMap, errorSound };
