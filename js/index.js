const specialistsDiv = document.getElementById("specialists");
const shownClients = 3;

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

function renderSpecialistClients(specialistName, specialistClients) {
  let waitingClients = specialistClients.filter(client => {
    if(client.status === "waiting" || client.status === "in service") {
      return client;
    }
  });
  let specialistDiv = document.createElement("div");
  specialistDiv.className = "specialist";
  let specialistTitle = document.createElement("h2");
  specialistTitle.textContent = specialistName;
  specialistDiv.appendChild(specialistTitle);
  shownWaitingClients = waitingClients.slice(0, shownClients);
  shownWaitingClients.forEach(client => {
    let clientDiv = document.createElement("div");
    clientDiv.className = "client";
    let clientNumberDiv = document.createElement("div");
    clientNumberDiv.className = "client__number";
    let clientNameDiv = document.createElement("div");
    clientNameDiv.className = "client__name";
    let clientTimeDiv = document.createElement("div");
    clientTimeDiv.className = "client__time";
    let clientNumberPara = document.createElement("p");
    clientNumberPara.textContent = client.number;
    let clientNamePara = document.createElement("p");
    clientNamePara.textContent = client.name;
    let clientTimePara = document.createElement("p");

    if(client.status === "in service") {
      clientTimePara.textContent = "Client is being served right now";
    } else {
      let remainingTime = Math.round(calcRemainingTime(client.startTime, specialistName));
      if(remainingTime < 0) {
        clientTimePara.textContent = "You should be served soon :)"
      } else if(remainingTime > 60) {
        let min = Math.round(remainingTime / 60);
        let sec = remainingTime % 60;
        clientTimePara.textContent = `Time remaining: ${min} min(s) and ${sec} secs`;
      } else {
        clientTimePara.textContent = `Time remaining: ${remainingTime} seconds`;
      }
    }

    clientNumberDiv.appendChild(clientNumberPara);
    clientNameDiv.appendChild(clientNamePara);
    clientTimeDiv.appendChild(clientTimePara);
    clientDiv.appendChild(clientNumberDiv);
    clientDiv.appendChild(clientNameDiv);
    clientDiv.appendChild(clientTimeDiv);
    specialistDiv.appendChild(clientDiv);
  });
  specialistsDiv.appendChild(specialistDiv);
}

function loadData() {
  let data = JSON.parse(window.localStorage.getItem("clients"));
  data.map(specialist => {
    renderSpecialistClients(specialist.specialist, specialist.clients);
  });
}

if(window.localStorage.getItem("clients")) {
  loadData();
  setInterval(() => {
    if(document.querySelectorAll(".specialist")) {
      let items = document.querySelectorAll(".specialist");
      items.forEach(item => {
        specialistsDiv.removeChild(item);
      });
    }
    loadData();
  }, 5000);
}