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
    "INSERT INTO destinations (destination_id, city) VALUES (${id}, ${cit})",
    { id, cit }
  );
  return result;
}
async function create_event_table() {
  db.tx((t) => {
    // creating a sequence of transaction queries:
    const q1 = t.none(
      "CREATE TABLE events (event_id VARCHAR PRIMARY KEY, title VARCHAR, description TEXT, url TEXT)"
    );
    const q2 = t.none(
      "CREATE TABLE images (image_id VARCHAR PRIMARY KEY, image_url TEXT, event_id VARCHAR , FOREIGN KEY (event_id) REFERENCES events (event_id) )"
    );
    const q3 = t.none(
      "CREATE TABLE review (review_id VARCHAR PRIMARY KEY, average_rating NUMERIC(2,1), provider VARCHAR, event_id VARCHAR ,FOREIGN KEY (event_id) REFERENCES events (event_id) )"
    );
    const q4 = t.none(
      "CREATE TABLE tag_info (tag_id VARCHAR PRIMARY KEY , tag_name VARCHAR  )"
    );
    const q5 = t.none(
      "CREATE TABLE tags ( event_id VARCHAR ,tag_id VARCHAR,FOREIGN KEY (event_id) REFERENCES events (event_id), FOREIGN KEY (tag_id) REFERENCES tag_info (tag_id)  )"
    );
    const q6 = t.none(
      "CREATE TABLE currency (currency_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,currency VARCHAR )"
    );
    const q7 = t.none(
      "CREATE TABLE price (event_id VARCHAR,currency_id int,FOREIGN KEY (event_id) REFERENCES events (event_id), FOREIGN KEY (currency_id) REFERENCES currency (currency_id), price NUMERIC(5,2),  discount NUMERIC (5,2) )"
    );
    const q8 = t.none(
      "CREATE TABLE over_all_ranting (event_id VARCHAR,rating NUMERIC(2,1),FOREIGN KEY (event_id) REFERENCES events (event_id) )"
    );

    // returning a promise that determines a successful transaction:
    return t.batch([q1, q2, q3, q4, q5, q6, q7, q8]); // all of the queries are to be resolved;
  })
    .then((data) => {
      console.log("sucess");
      // success, COMMIT was executed
    })
    .catch((error) => {
      // failure, ROLLBACK was executed
    });
  //   const result = await db.query(
  //     "CREATE TABLE events (event_id VARCHAR PRIMARY KEY, title VARCHAR, description TEXT, url TEXT)"
  //   );
  //   return result;
}
module.exports = {
  createDestinations,
  insert_destinations,
  create_event_table,
};
