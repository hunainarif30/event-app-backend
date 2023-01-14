//const createTable = require("../queries/create_queries");
const db = require("../adapter/pgsql");
async function createDestinations() {
  const result = await db.query(
    "CREATE TABLE destinations (destination_id VARCHAR PRIMARY KEY , city VARCHAR )"
  );
  return result;
}

async function insert_destinations(id, cit) {
  const result = await db.query(
    "INSERT INTO destinations (destination_id, city) VALUES ('123', 'destination')"
  );
  return result;
}
module.exports = { createDestinations, insert_destinations };
