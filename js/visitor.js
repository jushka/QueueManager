const timeLeftForm = document.getElementById("timeLeftForm");
const clientNumber = document.getElementById("clientNumber");
const timeLeftText = document.getElementById("timeLeftText");
const clientBox = document.getElementById("clientBox");
const msgDiv = document.getElementById("msgDiv");
let showRemainingTimeID;

function showMessage(alertType, alertText) {
  if(document.getElementById("msg")) {
    msgDiv.removeChild(document.getElementById("msg"));
  }
  let div = document.createElement("div");
  div.id = "msg";
  div.className = `alert ${alertType} alert-dismissible fade show text-center`;
  div.setAttribute("role", "alert");
  div.innerHTML = alertText;
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.className = "close";
  btn.setAttribute("data-dismiss", "alert");
  btn.setAttribute("aria-label", "Close");
  let span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML = "&times;";
  btn.appendChild(span);
  div.appendChild(btn);
  msgDiv.appendChild(div);
}

function showCancelBtn(client) {
  let cancelBtn = document.createElement("button");
  cancelBtn.id = "cancelBtn";
  cancelBtn.textContent = "Cancel your visit";
  cancelBtn.className = "btn btn-dark mt-2 red-btn";
  cancelBtn.addEventListener("click", () => {
    let data = JSON.parse(window.localStorage.getItem("clients"));
    let found = false;
    
    for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < data[i].clients.length; j++) {
        if(data[i].clients[j].number === client.number) {
          found = true;
          if(data[i].clients[j].status === "waiting") {
            data[i].clients[j].status = "cancelled";
          }
          j = data[i].clients.length;
        }
      }
      if(found) {
        i = data.length;
      };
    }

    window.localStorage.setItem("clients", JSON.stringify(data));
    showClientStatus();
  });
  clientBox.appendChild(cancelBtn);
}

function showDelayBtn(client) {
  let delayBtn = document.createElement("button");
  delayBtn.id = "delayBtn";
  delayBtn.textContent = "Delay your visit";
  delayBtn.className = "btn btn-dark mt-2 mr-4 yellow-btn";
  delayBtn.addEventListener("click", () => {
    let data = JSON.parse(window.localStorage.getItem("clients"));
    let searchResult = {
      foundClient: false,
      foundClientIndex: 0,
      foundClientSpecialistIndex: 0,
      foundClientName: "",
      foundClientStartTime: 0,
      foundNextClient: false,
      foundNextClientNumber: 0
    };
    
    for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < data[i].clients.length; j++) {
        if(!searchResult.foundClient && data[i].clients[j].number === client.number) {
          searchResult.foundClient = true;
          searchResult.foundClientIndex = j;
          searchResult.foundClientSpecialistIndex = i;
          searchResult.foundClientName = data[i].clients[j].name;
          searchResult.foundClientStartTime = data[i].clients[j].startTime;
          j++;
        }
        if(j < data[i].clients.length && searchResult.foundClient && data[i].clients[j].status === "waiting") {
          searchResult.foundNextClient = true;
          searchResult.foundNextClientNumber = data[i].clients[j].number;
          data[searchResult.foundClientSpecialistIndex].clients[searchResult.foundClientIndex].name = data[i].clients[j].name;
          data[searchResult.foundClientSpecialistIndex].clients[searchResult.foundClientIndex].startTime = data[i].clients[j].startTime;
          data[i].clients[j].name = searchResult.foundClientName;
          data[i].clients[j].startTime = searchResult.foundClientStartTime;
          j = data[i].clients.length;
        }
      }
      if(searchResult.foundClient) {
        i = data.length;
      };
    }

    if(searchResult.foundNextClient) {
      clientNumber.value = searchResult.foundNextClientNumber;
      showMessage("alert-success", "<strong>Success!</strong> Your visit has been delayed!");
      window.localStorage.setItem("clients", JSON.stringify(data));
    } else {
      showMessage("alert-danger", "You are the <strong>last in the queue!</strong>");
    }
  
    showClientStatus();
  });
  clientBox.appendChild(delayBtn);
}

function removeCancelBtn() {
  if(document.getElementById("cancelBtn")) {
    clientBox.removeChild(document.getElementById("cancelBtn"));
  }
}

function removeDelayBtn() {
  if(document.getElementById("delayBtn")) {
    clientBox.removeChild(document.getElementById("delayBtn"));
  }
}

function showRemainingTime(client) {
  if(client.status === "in service") {
    timeLeftText.textContent = "You are being served right now";
  } else if(client.status === "served") {
    timeLeftText.textContent = "You have been served";
  } else if(client.status === "cancelled") {
    timeLeftText.textContent = "Your visit has been cancelled";
  } else {
    showDelayBtn(client);
    showCancelBtn(client);
    let d = new Date();
    let remainingTime = Math.round((client.expectedEndTime - d.getTime()) / 1000);
    if(remainingTime < 0) {
      timeLeftText.textContent = "You should be served soon"
    } else if(remainingTime > 60) {
      let min = Math.round(remainingTime / 60);
      let sec = remainingTime % 60;
      timeLeftText.textContent = `Wait ${min} min(s) and ${sec} secs`;
    } else {
      timeLeftText.textContent = `Wait ${remainingTime} seconds`;
    }
  }
}

function showClientStatus() {
  clearInterval(showRemainingTimeID);
  let number = Number(clientNumber.value);
  removeCancelBtn();
  removeDelayBtn();
  let data = JSON.parse(window.localStorage.getItem("clients"));
  let found = false;
  let client;
  
  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data[i].clients.length; j++) {
      if(data[i].clients[j].number === number) {
        found = true;
        client = data[i].clients[j];
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
    showRemainingTime(client);
    showRemainingTimeID = setInterval(() => {
      removeCancelBtn();
      removeDelayBtn();
      data = JSON.parse(window.localStorage.getItem("clients"));
      found = false;

      for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].clients.length; j++) {
          if(data[i].clients[j].number === number) {
            found = true;
            client = data[i].clients[j];
            j = data[i].clients.length;
          }
        }
        if(found) {
          i = data.length;
        };
      }

      showRemainingTime(client);
    }, 5000);
  }
}

timeLeftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showClientStatus();
});