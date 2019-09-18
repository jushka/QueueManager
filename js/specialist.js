const specialistSelect = document.getElementById("specialistSelect");
const clientsDiv = document.getElementById("clients");

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
  specialistClients.map(client => {
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
    clientButton.textContent = "Serviced";
    clientButton.addEventListener("click", () => {
      let data = JSON.parse(window.localStorage.getItem("clients"));
      let specialistClients = data.find(item => {
        return item.specialist === specialistName;
      }).clients;
      specialistClients = specialistClients.filter(item => {
        return item.name !== client.name;
      });
      let updateResult = data.find((item, index) => {
        if(item.specialist === specialistName) {
          data[index].clients = specialistClients;
          return true;
        }
      });
      window.localStorage.setItem("clients", JSON.stringify(data));
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
  renderSpecialistClients(specialist, specialistClients);
}

specialistSelect.addEventListener("change", () => {
  specialistSelect.value === "" ? null : loadData(specialistSelect.value); 
});