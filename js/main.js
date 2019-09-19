const timesBlueprint = [
  {
  specialist: "Investment",
  times: [20, 30, 40]
  },
  {
  specialist: "Credit",
  times: [40, 30, 20]
  },
  {
  specialist: "Pension",
  times: [30, 20, 40]
  },
];

if(window.localStorage.getItem("times") === null) {
  window.localStorage.setItem("times", JSON.stringify(timesBlueprint));
}