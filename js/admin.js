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
  window.localStorage.setItem("nextClientNumber", "10");
}

function addNewClient() {
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let specialist = newClientSpecialist.value;
  let index;
  
  // set client number
  if(window.localStorage.getItem("nextClientNumber") === null) {
    window.localStorage.setItem("nextClientNumber", "1");
  }
  let number = Number(window.localStorage.getItem("nextClientNumber"));
  window.localStorage.setItem("nextClientNumber", (number + 1).toString());

  // set client name
  let name = newClientName.value;

  // set client status
  let status = "in service";
  for(let i = 0; i < data.length; i++) {
    if(data[i].specialist === specialist) {
      index = i;
      for(let j = 0; j < data[i].clients.length; j++) {
        if(data[i].clients[j].status === "in service") {
          status = "waiting";
          j = data[i].clients.length;
        }
      }
      i = data.length;
    }
  }

  // set client startTime
  let d = new Date();
  let startTime = d.getTime();
  
  // create new client
  let newClient = {
    number: number,
    name: name,
    status: status,
    startTime: startTime,
    endTime: 0
  };

  // push new client to client array
  data[index].clients.push(newClient);
  
  // let specialistClients = data.find(item => {
  //   return item.specialist === specialist;
  // }).clients;

  // specialistClients.push(newClient);
  // let updateResult = data.find((item, index) => {
  //   if(item.specialist === specialist) {
  //     data[index].clients = specialistClients;
  //     return true;
  //   }
  // });

  window.localStorage.setItem("clients", JSON.stringify(data));
}

saveExampleDataBtn.addEventListener("click", saveExampleData);

newClientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addNewClient();
  newClientName.value = "";
  newClientName.focus();
});

if(window.localStorage.getItem("clients") === null) {
  let blueprint = [
    {
    specialist: "Investment",
    clients: []
    },
    {
    specialist: "Credit",
    clients: []
    },
    {
    specialist: "Pension",
    clients: []
    },
  ];
  window.localStorage.setItem("clients", JSON.stringify(blueprint));
}