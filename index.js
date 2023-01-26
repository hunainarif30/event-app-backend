const express = require("express");
const app = express();
const { setup } = require("./di-setup");
setup();
const { create_event_table, DropAll } = require("./src/services/services");
const tags_consumer = require("./src/queues/consumer/tags_consumers");
const event_consumer = require("./src/queues/consumer/event_consumer");
const destination_consumer = require("./src/queues/consumer/destination_consumer");
const delayed_consumer = require("./src/queues/consumer/delayed_consumer");
tags_consumer();
// event_consumer();
// destination_consumer();
// delayed_consumer();

const startProcedure = require("./src/controller/controller");
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
