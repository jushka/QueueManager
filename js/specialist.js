const specialistSelect = document.getElementById("specialistSelect");
const clientsDiv = document.getElementById("clients");
const timesBlueprint = [
  {
  specialist: "Investment",
  times: [10]
  },
  {
  specialist: "Credit",
  times: [15]
  },
  {
  specialist: "Pension",
  times: [20]
  },
];

function calcVisitTime(startTime, endTime) {
  return Math.round((endTime - startTime) / 1000);
}

function addVisitTime(specialist, time) {
  let data = JSON.parse(window.localStorage.getItem("times"));
  let result = data.find((item, index) => {
    if(item.specialist === specialist) {
      data[index].times.push(time);
      return true;
    }
  });
  window.localStorage.setItem("times", JSON.stringify(data));
}

function serveClient(specialistName, clientNumber) {
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let specialistClients = data.find(item => {
    return item.specialist === specialistName;
  }).clients;

  let result1 = specialistClients.find((item, index) => {
    if(item.number === clientNumber) {
      let client = specialistClients[index];
      client.status = "served";
      let d = new Date();
      client.endTime = d.getTime();
      let visitTime = calcVisitTime(client.startTime, client.endTime);
      addVisitTime(specialistName, visitTime);
      return true;
    }
  });

  let result2 = data.find((item, index) => {
    if(item.specialist === specialistName) {
      data[index].clients = specialistClients;
      return true;
    }
  });
  window.localStorage.setItem("clients", JSON.stringify(data));
  loadData(specialistName);
}

function renderSpecialistClients(specialistName, specialistClients) {
  let specialistDiv = document.getElementById("specialistDiv");
  if (specialistDiv) {
    clientsDiv.removeChild(specialistDiv);
  }
  specialistDiv = document.createElement("div");
  specialistDiv.id = "specialistDiv";
  let specialistTitle = document.createElement("h2");
  specialistTitle.textContent = specialistName;
  specialistDiv.appendChild(specialistTitle);
  specialistClients.forEach(client => {
    let clientDiv = document.createElement("div");
    clientDiv.className = "client";
    let clientNumberDiv = document.createElement("div");
    clientNumberDiv.className = "client__number";
    let clientNameDiv = document.createElement("div");
    clientNameDiv.className = "client__name";
    let clientButtonDiv = document.createElement("div");
    let clientNumberPara = document.createElement("p");
    clientNumberPara.textContent = client.number;
    let clientNamePara = document.createElement("p");
    clientNamePara.textContent = client.name;
    let clientButton = document.createElement("button");
    clientButton.textContent = "Served";
    clientButton.addEventListener("click", () => {
      serveClient(specialistName, client.number);
    });
    clientNumberDiv.appendChild(clientNumberPara);
    clientNameDiv.appendChild(clientNamePara);
    clientButtonDiv.appendChild(clientButton);
    clientDiv.appendChild(clientNumberDiv);
    clientDiv.appendChild(clientNameDiv);
    clientDiv.appendChild(clientButtonDiv);
    specialistDiv.appendChild(clientDiv);
  });
  clientsDiv.appendChild(specialistDiv);
}

function loadData(specialist) {
  if(window.localStorage.getItem("clients") === null) {
    return;
  }
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let specialistClients = data.find(item => {
    return item.specialist === specialist;
  }).clients;
  let waitingClients = specialistClients.filter(client => {
    return client.status === "waiting";
  });
  renderSpecialistClients(specialist, waitingClients);
}

specialistSelect.addEventListener("change", () => {
  specialistSelect.value === "" ? null : loadData(specialistSelect.value); 
});

if(window.localStorage.getItem("times") === null) {
  window.localStorage.setItem("times", JSON.stringify(timesBlueprint));
}