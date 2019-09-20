const timeLeftForm = document.getElementById("timeLeftForm");
const clientNumber = document.getElementById("clientNumber");
const timeLeftText = document.getElementById("timeLeftText");
const clientBox = document.getElementById("clientBox");
let showRemainingTimeID;

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

function removeCancelBtn() {
  if(document.getElementById("cancelBtn")) {
    clientBox.removeChild(document.getElementById("cancelBtn"));
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