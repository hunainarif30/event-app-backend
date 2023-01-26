const { fillDestination } = require("./destination/fillDestination");
const { fillTags } = require("./tags/fillTags");
const { container } = require("../../di-setup");

const emitter = container.resolve("emitter");

async function startProcedure() {
  await fillTags();
  emitter.on("event", function (data) {
    console.log("First event: " + data);
  });
  // await fillDestination();
}

module.exports = startProcedure;
