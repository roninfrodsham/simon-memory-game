function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function timeout(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function postData(name, score) {
  fetch(
    "https://v88bc240rk.execute-api.eu-west-2.amazonaws.com/stage/addListing",
    {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ name: name, score: score }),
    }
  );
}

export { getRandomInt, timeout, postData };