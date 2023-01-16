const express = require("express");
const app = express();
const destinationApi = require("./controller/controller");
const {
  create_event_table,
  DropAll,
  createCurrency,
} = require("./services/services");
const port = 3000;


app.get("/postDestinations", async (req, res) => {
  const result = await destinationApi();
  console.log(result);
  res.sendStatus(result);
});

app.post("/createEventsTable", async (req, res) => {
  const result = await create_event_table();
  res.sendStatus(result);
});

app.post("/createCurrencyTable", async (req, res) => {
  const result = await createCurrency();

  res.sendStatus(result);
});

app.post("/dropAll", async (req, res) => {
  const result = await DropAll();
  res.sendStatus(result);
});

app.listen(port, () => {
  console.log(`Event app listening on port ${port}`);
});
