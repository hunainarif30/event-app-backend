const express = require("express");
const app = express();
const startProcedure = require("./controller/controller");
const {
  create_event_table,
  DropAll,
  createCurrency,
} = require("./services/services");
const port = 3000;
// require("./api_scheduler/api_scheduler.js");

app.get("/postDestinations", async (req, res) => {
  const result = await startProcedure();
  res.send("ok");
});

app.post("/createEventsTable", async (req, res) => {
  try {
    const result = await create_event_table();
    res.send("ok");
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/dropAll", async (req, res) => {
  try {
    const result = await DropAll();
    res.send("ok");
  } catch (e) {
    console.log(e.message);
  }
});

app.listen(port, () => {
  console.log(`Event app listening on port ${port}`);
});
