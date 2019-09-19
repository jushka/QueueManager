const timeLeftForm = document.getElementById("timeLeftForm");
const clientNumber = document.getElementById("clientNumber");
const timeLeftText = document.getElementById("timeLeftText");
let showRemainingTimeID;

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

function showRemainingTime(startTime, specialist, status) {
  if(status === "in service") {
    timeLeftText.textContent = "You are being served right now";
  } else if(status === "served") {
    timeLeftText.textContent = "You have been served";
  } else if(status === "cancelled") {
    timeLeftText.textContent = "Your visit has been cancelled";
  } else {
    let remainingTime = Math.round(calcRemainingTime(startTime, specialist));
    if(remainingTime < 0) {
      timeLeftText.textContent = "You should be served soon :)"
    } else if(remainingTime > 60) {
      let min = Math.round(remainingTime / 60);
      let sec = remainingTime % 60;
      timeLeftText.textContent = `Time remaining: ${min} min(s) and ${sec} secs`;
    } else {
      timeLeftText.textContent = `Time remaining: ${remainingTime} seconds`;
    }
  }
}

timeLeftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearInterval(showRemainingTimeID);
  if(window.localStorage.getItem("clients") === null) {
    timeLeftText.textContent = "Oops! Client not found";
    return;
  }
  let number = Number(clientNumber.value);
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let found = false;
  let startTime, specialist, status;
  
  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data[i].clients.length; j++) {
      if(data[i].clients[j].number === number) {
        found = true;
        startTime = data[i].clients[j].startTime;
        specialist = data[i].specialist;
        status = data[i].clients[j].status;
        j = data[i].clients.length;
      }
    }
    if(found) {
      i = data.length;
    };
  }

  if(!found) {
    timeLeftText.textContent = "Oops! Client not found";
    return;
  }  else {
    showRemainingTime(startTime, specialist, status);
    showRemainingTimeID = setInterval(() => {
      data = JSON.parse(window.localStorage.getItem("clients"));
      found = false;

      for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].clients.length; j++) {
          if(data[i].clients[j].number === number) {
            found = true;
            status = data[i].clients[j].status;
            j = data[i].clients.length;
          }
        }
        if(found) {
          i = data.length;
        };
      }

      showRemainingTime(startTime, specialist, status);
    }, 5000);
  }
});