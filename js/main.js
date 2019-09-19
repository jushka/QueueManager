if(window.localStorage.getItem("times") === null) {
  let timesBlueprint = [
    {
    specialist: "Investment",
    times: [30000]
    },
    {
    specialist: "Credit",
    times: [30000, 60000]
    },
    {
    specialist: "Pension",
    times: [30000]
    },
  ];
  window.localStorage.setItem("times", JSON.stringify(timesBlueprint));
}

if(window.localStorage.getItem("clients") === null) {
  let clientsBlueprint = [
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
  window.localStorage.setItem("clients", JSON.stringify(clientsBlueprint));
}