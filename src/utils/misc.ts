function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function timeout(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export { getRandomInt, timeout };
