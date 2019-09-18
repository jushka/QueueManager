const specialistsDiv = document.getElementById("specialists");
const shownClients = 3;

function renderSpecialistClients(specialistName, specialistClients) {
  let waitingClients = specialistClients.filter(client => {
    return client.status === "waiting";
  });
  let specialistDiv = document.createElement("div");
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
    let clientNumberPara = document.createElement("p");
    clientNumberPara.textContent = client.number;
    let clientNamePara = document.createElement("p");
    clientNamePara.textContent = client.name;
    clientNumberDiv.appendChild(clientNumberPara);
    clientNameDiv.appendChild(clientNamePara);
    clientDiv.appendChild(clientNumberDiv);
    clientDiv.appendChild(clientNameDiv);
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
}