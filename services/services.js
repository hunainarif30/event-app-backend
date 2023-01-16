//const createTable = require("../queries/create_queries");
const db = require("../adapter/pgsql");
const pgp = require("pg-promise")();
const { v4: uuidv4 } = require("uuid");

async function insert_destinations(id, destination_city) {
  const result = await db.query(
    "INSERT INTO destinations (destination_id, city) VALUES (${id}, ${destination_city})",
    { id, destination_city },
  );
  return result;
}

async function create_partitions(destination_id, destinationName) {
  Tablename = destinationName.replace(
    /[\(\)-\s\&\'\"\$\@\#\%\^\,\.\!\_\|\=\?\:\;]+/g,
    "",
  );
  const result = await db.query(
    `CREATE TABLE IF NOT EXISTS ${Tablename} PARTITION OF events FOR VALUES IN (${destination_id})`,
  );
  console.log(result);
  return result;
}

async function create_event_table() {
  const result = await db.tx(async (t) => {
    const q0 = await t.none(
      "CREATE TABLE destinations (destination_id VARCHAR PRIMARY KEY , city VARCHAR )",
    );
    const q1 = await t.none(
      "CREATE TABLE events (event_id VARCHAR  , destination_id varchar , title VARCHAR, description TEXT, url TEXT  , PRIMARY KEY (event_id , destination_id)) PARTITION BY LIST(destination_id)",
    );
    const q2 = await t.none(
      "CREATE TABLE images (image_id VARCHAR PRIMARY KEY, image_url TEXT, event_id VARCHAR, destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))",
    );
    const q3 = await t.none(
      "CREATE TABLE review (review_id VARCHAR PRIMARY KEY, average_rating NUMERIC(2,1), provider VARCHAR, event_id VARCHAR , destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))",
    );
    const q4 = await t.none(
      "CREATE TABLE tag_info (tag_id VARCHAR PRIMARY KEY , tag_name VARCHAR  )",
    );
    const q5 = await t.none(
      "CREATE TABLE tags ( event_id VARCHAR ,tag_id VARCHAR, destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id), FOREIGN KEY (tag_id) REFERENCES tag_info (tag_id)  )",
    );
    const q6 = await t.none(
      "CREATE TABLE currency (currency_id VARCHAR PRIMARY KEY,currency VARCHAR )",
    );
    const q7 = await t.none(
      "CREATE TABLE price (event_id VARCHAR,currency  VARCHAR, destination_id varchar , price NUMERIC(10,5),  discount NUMERIC (10,5), FOREIGN KEY (event_id , destination_id) REFERENCES events  (event_id , destination_id))",
    );
    const q8 = await t.none(
      "CREATE TABLE over_all_ranting (event_id VARCHAR,rating NUMERIC(5,4), destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id) )",
    );
    return t.batch([q0, q1, q2, q3, q4, q5, q6, q7, q8]); // all of the queries are to be resolved;
  });
  return result;
}

async function DropAll() {
  const result = await db.tx(async (t) => {
    const q8 = await t.none("drop table over_all_ranting");
    const q7 = await t.none("drop table price");
    const q6 = await t.none("drop table currency");
    const q5 = await t.none("drop table tags");
    const q4 = await t.none("drop table tag_info");
    const q3 = await t.none("drop table review");
    const q2 = await t.none("drop table images");
    const q1 = await t.none("drop table events");
    const q0 = await t.none("drop table destinations");

    return t.batch([q0, q1, q2, q3, q4, q5, q6, q7, q8]); // all of the queries are to be resolved;
  });
  return result;
}

async function createCurrency() {
  const id = 1;
  const result = await db.none(
    "INSERT INTO currency (currency_id ,currency ) values (${id},'USD')",
    {
      id: id,
    },
  );
}

async function insert_to_db(data, destination_id) {
  console.log(destination_id);
  db.tx((t) => {
    const q1 = t.none(
      "INSERT INTO events (event_id,destination_id,title,description,url) VALUES(${event_id}, ${destination_id}, ${title}, ${description},  ${url})",
      {
        event_id: data.productCode,
        destination_id: destination_id,
        title: data.title,
        url: data.productUrl,
        description: data.description,
      },
    );

    const q2 = t.none(
      "INSERT INTO price (event_id,currency , destination_id , price ,  discount ) VALUES (${event_id},${currency} , ${destination_id} , ${price} ,  ${discount} )",
      {
        event_id: data.productCode,
        currency: data.pricing.currency,
        destination_id: destination_id,
        price: data.pricing.summary.fromPrice,
        discount: data.pricing.summary.fromPriceBeforeDiscount,
      },
    );

    const q3 = t.none(
      "INSERT INTO over_all_ranting (event_id , destination_id) VALUES (${event_id}, ${destination_id} )",
      {
        event_id: data.productCode,
        //  rating: data.reviews.combinedAverageRating,
        destination_id: destination_id,
      },
    );
    return t.batch([q1, q2, q3]); // all of the queries are to be resolved;
  });
}

module.exports = {
  insert_destinations,
  create_event_table,
  create_partitions,
  DropAll,
  insert_to_db,
  createCurrency,
};
