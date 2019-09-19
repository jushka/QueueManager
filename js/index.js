const specialistsDiv = document.getElementById("specialists");
const shownClients = 3;

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
  specialistTitle.className = "text-center display-4 specialist__name";
  specialistDiv.appendChild(specialistTitle);
  shownWaitingClients = waitingClients.slice(0, shownClients);
  shownWaitingClients.forEach(client => {
    let clientDiv = document.createElement("div");
    clientDiv.className = "client row";
    let clientNumberDiv = document.createElement("div");
    clientNumberDiv.className = "client__number col-4 col-xl-2";
    let clientNameDiv = document.createElement("div");
    clientNameDiv.className = "client__name col-8 col-xl-3";
    let clientTimeDiv = document.createElement("div");
    clientTimeDiv.className = "client__time col-12 col-xl-7";
    let clientNumberPara = document.createElement("p");
    clientNumberPara.textContent = client.number;
    clientNumberPara.className = "text-center";
    let clientNamePara = document.createElement("p");
    clientNamePara.textContent = client.name;
    clientNamePara.className = "text-center";
    let clientTimePara = document.createElement("p");
    clientTimePara.className = "text-center";

    if(client.status === "in service") {
      clientNumberDiv.style.color = "green";
      clientNameDiv.style.color = "green";
      clientTimeDiv.style.color = "green";
      clientTimePara.textContent = "Client is being served";
    } else {
      let d = new Date();
      let remainingTime = Math.round((client.expectedEndTime - d.getTime()) / 1000);
      if(remainingTime < 0) {
        clientTimePara.textContent = "You should be served soon"
      } else if(remainingTime > 60) {
        let min = Math.round(remainingTime / 60);
        let sec = remainingTime % 60;
        clientTimePara.textContent = `Wait ${min} min(s) and ${sec} secs`;
      } else {
        clientTimePara.textContent = `Wait ${remainingTime} seconds`;
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