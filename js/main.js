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

if(window.localStorage.getItem("times") === null) {
  window.localStorage.setItem("times", JSON.stringify(timesBlueprint));
}