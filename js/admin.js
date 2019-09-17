const saveExampleDataBtn = document.getElementById("saveExampleDataBtn");

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

saveExampleDataBtn.addEventListener("click", saveExampleData);