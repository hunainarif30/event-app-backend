const { fillDestination } = require("./destination/fillDestination");
const { fillTags } = require("./tags/fillTags");
async function startProcedure() {
  await fillDestination();
  await fillTags();
}

module.exports = startProcedure;
