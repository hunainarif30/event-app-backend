const express = require("express");
const app = express();
const destinationApi = require("./controller/controller");
const db = require("./adapter/pgsql");

const {
  createDestinations,
  create_event_table,
  DropAll,
  createCurrency,
} = require("./services/services");
const port = 3000;
// var db = new adapter();;

app.get("/postDestinations", async (req, res) => {
  const result = await destinationApi();
  console.log(result);
  res.send(result);
});
app.listen(port, () => {
  console.log(`Event app listening on port ${port}`);
});

app.post("/createDestinationsTable", async (req, res) => {
  const result = await createDestinations();
  res.send(result);
});
app.post("/createEventsTable", async (req, res) => {
  const result = await create_event_table();
  res.send(result);
});
app.post("/createCurrencyTable", async (req, res) => {
  const result = await createCurrency();

  res.send(result);
});

app.post("/dropAll", async (req, res) => {
  const result = await DropAll();
  res.send(result);
});
