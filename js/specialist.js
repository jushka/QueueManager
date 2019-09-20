const specialistSelect = document.getElementById("specialistSelect");
const clientsDiv = document.getElementById("clients");

function addVisitTime(specialist, time) {
  let data = JSON.parse(window.localStorage.getItem("times"));
  let result = data.find((item, index) => {
    if (item.specialist === specialist) {
      data[index].times.push(time);
      return true;
    }
  });
  window.localStorage.setItem("times", JSON.stringify(data));
}

function markClientAsServed(specialistName, clientNumber) {
  let data = JSON.parse(window.localStorage.getItem("clients"));

  for (let i = 0; i < data.length; i++) {
    if (data[i].specialist === specialistName) {
      for (let j = 0; j < data[i].clients.length; j++) {
        if (data[i].clients[j].number === clientNumber) {
          if(data[i].clients[j].status === "waiting" || data[i].clients[j].status === "in service") {
            data[i].clients[j].status = "served";
            let d = new Date();
            data[i].clients[j].endTime = d.getTime();
            let visitTime = data[i].clients[j].endTime - data[i].clients[j].startTime;
            addVisitTime(specialistName, visitTime);
          }
          j = data[i].clients.length;
        }
      }
      i = data.length;
    }
  }

  window.localStorage.setItem("clients", JSON.stringify(data));
}

function markClientAsInService(specialistName) {
  let data = JSON.parse(window.localStorage.getItem("clients"));

  for(let i = 0; i < data.length; i++) {
    if(data[i].specialist === specialistName) {
      for(let j = 0; j < data[i].clients.length; j++) {
        if(data[i].clients[j].status === "in service") {
          j = data[i].clients.length;
        } else if (data[i].clients[j].status === "waiting") {
          data[i].clients[j].status = "in service";
          j = data[i].clients.length;
        }
      }
      i = data.length;
    }
  }

  window.localStorage.setItem("clients", JSON.stringify(data));
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
  specialistTitle.className = "text-secondary display-4 my-3";
  specialistDiv.appendChild(specialistTitle);
  specialistClients.forEach(client => {
    let clientDiv = document.createElement("div");
    clientDiv.className = "border-top";
    let clientNumberDiv = document.createElement("div");
    clientNumberDiv.className = "client__number mt-2";
    let clientNameDiv = document.createElement("div");
    clientNameDiv.className = "client__name";
    let clientButtonDiv = document.createElement("div");
    let clientNumberPara = document.createElement("p");
    clientNumberPara.textContent = client.number;
    let clientNamePara = document.createElement("p");
    clientNamePara.textContent = client.name;
    let clientButton = document.createElement("button");
    clientButton.textContent = "Served";
    clientButton.className = "btn btn-dark mb-3 purple-btn";
    clientButton.addEventListener("click", () => {
      markClientAsServed(specialistName, client.number);
      markClientAsInService(specialistName);
      loadData(specialistName);
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
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let specialistClients = data.find(item => {
    return item.specialist === specialist;
  }).clients;
  let waitingClients = specialistClients.filter(client => {
    if (client.status === "waiting" || client.status === "in service") {
      return client;
    }
  });
  renderSpecialistClients(specialist, waitingClients);
}

specialistSelect.addEventListener("change", () => {
  specialistSelect.value === "" ? null : loadData(specialistSelect.value);
});