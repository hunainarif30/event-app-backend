const { key } = require("nconf");
const { fillDestination } = require("./destination/fillDestination");
const { fillTags } = require("./tags/fillTags");
async function startProcedure() {
  await fillTags(); // producing

  await fillDestination();
  // producing evenets
}

module.exports = startProcedure;

// tagid - primary key

// enents -- foreign key
