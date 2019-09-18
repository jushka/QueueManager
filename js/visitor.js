const timeLeftForm = document.getElementById("timeLeftForm");
const clientNumber = document.getElementById("clientNumber");
const timeLeftText = document.getElementById("timeLeftText");

function calcAverageTime(specialist) {
  let averageTime;
  let data = JSON.parse(window.localStorage.getItem("times"));
  let result = data.find(item => {
    if(item.specialist === specialist) {
      let time = item.times.reduce((item, acc) => acc+=item);
      averageTime = time / item.times.length; 
    }
  });
  return averageTime;
}

function calcRemainingTime(startTime, specialist) {
  let averageTime = calcAverageTime(specialist);
  let d = new Date();
  let timePassed = (d.getTime() - startTime) / 1000;
  return averageTime - timePassed;
}

timeLeftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let number = Number(clientNumber.value);
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let found = false;
  let remainingTime = 0;
  data.forEach(item => {
    item.clients.forEach(client => {
      if(client.number === number) {
        found = true;
        remainingTime = Math.round(calcRemainingTime(client.startTime, item.specialist));
      }
    });
  });
  if(!found) {
    timeLeftText.textContent = "Client not found";
    return;
  }
  if(remainingTime < 0) {
    timeLeftText.textContent = "You should be served soon :)"
  } else if(remainingTime > 60) {
    let min = Math.round(remainingTime / 60);
    let sec = remainingTime % 60;
    timeLeftText.textContent = `Time remaining: ${min} min(s) and ${sec} secs`;
  } else {
    timeLeftText.textContent = `Time remaining: ${remainingTime} seconds`;
  }
});