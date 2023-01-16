//const createTable = require("../queries/create_queries");
const db = require("../adapter/pgsql");
const { v4: uuidv4 } = require("uuid");
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
      "CREATE TABLE events (event_id VARCHAR  , destination_id varchar , title VARCHAR, description TEXT, url TEXT  , PRIMARY KEY (event_id , destination_id)) PARTITION BY LIST(destination_id)"
    );
    const q2 = t.none(
      "CREATE TABLE images (image_id VARCHAR PRIMARY KEY, image_url TEXT, event_id VARCHAR, destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))"
    );
    const q3 = t.none(
      "CREATE TABLE review (review_id VARCHAR PRIMARY KEY, average_rating NUMERIC(2,1), provider VARCHAR, event_id VARCHAR , destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))"
    );
    const q4 = t.none(
      "CREATE TABLE tag_info (tag_id VARCHAR PRIMARY KEY , tag_name VARCHAR  )"
    );
    const q5 = t.none(
      "CREATE TABLE tags ( event_id VARCHAR ,tag_id VARCHAR, destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id), FOREIGN KEY (tag_id) REFERENCES tag_info (tag_id)  )"
    );
    const q6 = t.none(
      "CREATE TABLE currency (currency_id VARCHAR PRIMARY KEY,currency VARCHAR )"
    );
    const q7 = t.none(
      "CREATE TABLE price (event_id VARCHAR,currency_id VARCHAR, destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id), FOREIGN KEY (currency_id) REFERENCES currency (currency_id), price NUMERIC(5,2),  discount NUMERIC (5,2) )"
    );
    const q8 = t.none(
      "CREATE TABLE over_all_ranting (event_id VARCHAR,rating NUMERIC(2,1), destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id) )"
    );
    return t.batch([q1, q2, q3, q4, q5, q6, q7, q8]); // all of the queries are to be resolved;
  })
    .then((data) => {
      console.log("sucess"); // commit
    })
    .catch((error) => {
      // failure, ROLLBACK was executed
    });
}

async function DropAll() {
  db.tx((t) => {
    const q8 = t.none("drop table over_all_ranting");
    const q7 = t.none("drop table price");
    const q6 = t.none("drop table currency");
    const q5 = t.none("drop table tags");
    const q4 = t.none("drop table tag_info");
    const q3 = t.none("drop table review");
    const q2 = t.none("drop table images");
    const q1 = t.none("drop table events");
    return t.batch([q1, q2, q3, q4, q5, q6, q7, q8]); // all of the queries are to be resolved;
  })
    .then((data) => {
      console.log("sucess"); // commit
    })
    .catch((error) => {
      // failure, ROLLBACK was executed
    });
}

async function createCurrency() {
  const id = 1;
  const result = await db.none(
    "INSERT INTO currency (currency_id ,currency ) values (${id},'USD')",
    {
      id: id,
    }
  );
}

async function create_partitions(destination_id, destinationName) {
  Tablename = destinationName.replace(/\s/g, "");
  const result = await db.query(
    `CREATE TABLE ${Tablename} PARTITION OF events FOR VALUES IN (${destination_id})`
  );
  console.log(result);
  return result;
}
async function insert_to_db(data, destination_id) {
  console.log(destination_id);
  db.tx((t) => {
    const q1 = t.none(
      "INSERT INTO events (event_id   , destination_id  , title , description , url ) VALUES(${event_id}, ${destination_id}, ${title}, ${description},  ${url})",
      {
        event_id: data.productCode,
        destination_id: destination_id,
        title: data.title,
        url: data.productUrl,
        description: data.description,
      }
    );
    //   id = uuid();

    // const q2 = t.none(
    //   "INSERT INTO images (image_id , image_url , event_id , destination_id) VALUES (${image_id},${url},${event_id}, ${destination_id}) ",
    //   {
    //     image_id:id,
    //     destination_id: destination_id,
    //     url: data.url,
    //     event_id: data.productCode,
    //   }
    // );
    // id = uuidv4();
    // id2 = uuidv4();
    // const q3 = t.none(
    //   "INSERT INTO review (review_id, average_rating , provider , event_id , destination_id ) VALUES (${review_id}, ${average_rating1}, ${provider}, ${event_id}, ${destinationId}),(${review_id2}, ${average_rating2}, ${provider}, ${event_id}, ${destinationId})",

    //   {
    //     review_id: id,
    //     review_id2: id2,

    //     destinationId: destination_id,

    //     average_rating1: data.reviews.sources[0].averageRating,
    //     average_rating2: data.reviews.sources[1].averageRating,
    //     provider: data.reviews.sources[0].provider,
    //     event_id: data.productCode,
    //   }
    // );
    // id = uuid();
    // const q4 = t.none("INSERT INTO tag_info (tag_id  , tag_name) VALUES (${tag_id}, 1)",{
    //     tag_id : id,
    // }
    // );
    // id = uuid();
    // const q5 = t.none(
    //   "INSERT INTO tags ( event_id  ,tag_id , destination_id ) VALUES (${event_id} , ) "
    // );

    var currency_id = 1
    //  t.any(
    //   "SELECT currency_id FROM currency WHERE currency = 'USD'"
    // );

    const q7 = t.none(
      "INSERT INTO price (event_id,currency_id , destination_id , price ,  discount ) VALUES (${event_id},${currency_id} , ${destination_id} , ${price} ,  ${discount} )",
      {
        event_id: data.productCode,
        currency_id: currency_id,
        destination_id: destination_id,
        price: data.pricing.summary.fromPrice,

        discount: data.pricing.summary.fromPriceBeforeDiscount,
      }
    );

    const q8 = t.none(
      "INSERT INTO over_all_ranting (event_id ,rating , destination_id) VALUES (${event_id}, 123, ${destination_id} )",
      {
        event_id: data.productCode,
      //  rating: data.reviews.combinedAverageRating,
        destination_id: destination_id,
      }
    );
    return t.batch([q1, q7, q8]); // all of the queries are to be resolved;
  });
}

module.exports = {
  createDestinations,
  insert_destinations,
  create_event_table,
  create_partitions,
  DropAll,
  insert_to_db,
  createCurrency,
};
