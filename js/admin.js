const saveExampleDataBtn = document.getElementById("saveExampleDataBtn");
const newClientForm = document.getElementById("newClientForm");
const newClientSpecialist = document.getElementById("specialistSelect");
const newClientName = document.getElementById("name");

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'clients.json', true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(xobj.responseText);
    }
  }
  xobj.send();
}

function saveExampleData() {
  loadJSON((response) => {
    window.localStorage.setItem("clients", response);
  });
}

function addNewClient() {
  let specialist = newClientSpecialist.value;
  let name = newClientName.value;
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let specialistClients = data.find(item => {
    return item.specialist === specialist;
  }).clients;
  let number = specialistClients.length > 0 ? specialistClients[(specialistClients.length - 1)].number + 1 : 1;
  let newClient = {number: number, name: name};
  specialistClients.push(newClient);
  let updateResult = data.find((item, index) => {
    if(item.specialist === specialist) {
      data[index].clients = specialistClients;
      return true;
    }
  });
  window.localStorage.setItem("clients", JSON.stringify(data));
}

saveExampleDataBtn.addEventListener("click", saveExampleData);

newClientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addNewClient();
  newClientName.value = "";
});