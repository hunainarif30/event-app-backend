const db = require("../../adapter/pgsql");
var _ = require("lodash");
const { values } = require("lodash");
const pgp = require("pg-promise")();

async function insert_destinations(id, destination_city) {
  const result = await db.query(
    "INSERT INTO destinations (destination_id, city) VALUES (${id}, ${destination_city})",
    { id, destination_city }
  );
  return result;
}
async function insert_tags(tagId, tagName) {
  const result = await db.query(
    "INSERT INTO tag_info (tag_id, tag_name) VALUES (${tagId}, ${tagName})",
    { tagId, tagName }
  );
  return result;
}
async function create_partitions(destination_id, destinationName) {
  Tablename = destinationName.replace(
    /[\(\)-\s\&\'\"\$\@\#\%\^\,\.\!\_\|\=\?\:\;]+/g,
    ""
  );
  const result = await db.query(
    `CREATE TABLE IF NOT EXISTS ${Tablename} PARTITION OF events FOR VALUES IN (${destination_id})`
  );
  console.log(result);
  return result;
}
async function create_event_table() {
  const result = await db.tx(async (t) => {
    const q0 = await t.none(
      "CREATE TABLE destinations (destination_id VARCHAR PRIMARY KEY , city VARCHAR )"
    );
    const q1 = await t.none(
      "CREATE TABLE events (event_id VARCHAR  , destination_id varchar , title VARCHAR, description TEXT, url TEXT  , PRIMARY KEY (event_id , destination_id)) PARTITION BY LIST(destination_id)"
    );
    const q2 = await t.none(
      "CREATE TABLE images (image_url TEXT, event_id VARCHAR, destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))"
    );
    const q3 = await t.none(
      "CREATE TABLE review (average_rating NUMERIC(2,1), provider VARCHAR, event_id VARCHAR , destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))"
    );
    const q4 = await t.none(
      "CREATE TABLE tag_info (tag_id VARCHAR PRIMARY KEY , tag_name VARCHAR)"
    );
    const q5 = await t.none(
      "CREATE TABLE tags (tag_id VARCHAR, event_id VARCHAR , destination_id varchar , FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id), FOREIGN KEY (tag_id) REFERENCES tag_info (tag_id))"
    );
    const q6 = await t.none(
      "CREATE TABLE currency (currency_id VARCHAR PRIMARY KEY,currency VARCHAR )"
    );
    const q7 = await t.none(
      "CREATE TABLE price (event_id VARCHAR,currency  VARCHAR, destination_id varchar , price NUMERIC(10,5),  discount NUMERIC (10,5) , FOREIGN KEY (event_id , destination_id) REFERENCES events  (event_id , destination_id))"
    );
    const q8 = await t.none(
      "CREATE TABLE over_all_ranting (rating NUMERIC(5,4),event_id VARCHAR, destination_id varchar ,FOREIGN KEY (event_id , destination_id)REFERENCES events  (event_id , destination_id))"
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
async function insertTags(data, destination_id) {
  if (!_.isEmpty(data.tags)) {
    tags = data.tags;
    const cs = new pgp.helpers.ColumnSet(
      ["tag_id", "event_id", "destination_id"],
      {
        table: "tags",
      }
    );

    const values = tags.map((tag) => {
      return {
        tag_id: tag,
        event_id: data.productCode,
        destination_id: destination_id,
      };
    });

    const tagQuery = pgp.helpers.insert(values, cs);
    var q4 = await db.query(tagQuery);
  }
}
async function insert_to_db(data, destination_id) {
  const result = await db.tx(async (t) => {
    const q1 = await t.none(
      "INSERT INTO events (event_id,destination_id,title,description,url) VALUES(${event_id}, ${destination_id}, ${title}, ${description},  ${url})",
      {
        event_id: data.productCode,
        destination_id: destination_id,
        title: data.title,
        url: data.productUrl,
        description: data.description,
      }
    );

    const q2 = await t.none(
      "INSERT INTO price (event_id,currency , destination_id , price ,  discount ) VALUES (${event_id},${currency} , ${destination_id} , ${price} ,  ${discount} )",
      {
        event_id: data.productCode,
        currency: data.pricing.currency,
        destination_id: destination_id,
        price: data.pricing.summary.fromPrice,
        discount: data.pricing.summary.fromPriceBeforeDiscount,
      }
    );
    var values = await data.images[0].variants.filter((image) => {
      return (image.height == 480 && image.width == 720) 
    });
    var q3 = await t.query(
      "INSERT INTO images (image_url ,event_id , destination_id) VALUES (${image_url},${event_id}, ${destination_id} )",
      {
        image_url: values[0].url,
        event_id: data.productCode ,
        destination_id:  destination_id,
      }
    );
    if (!_.isEmpty(data.reviews)) {
      reviews = data.reviews.sources;
      const cs = new pgp.helpers.ColumnSet(
        ["average_rating", "provider", "event_id", "destination_id"],
        {
          table: "review",
        }
      );
      const values = reviews.map((review) => {
        return {
          average_rating: review.averageRating,
          provider: review.provider,
          event_id: data.productCode,
          destination_id: destination_id,
        };
      });
      const reviewQuery = pgp.helpers.insert(values, cs);
      var q4 = await t.query(reviewQuery);
      var q5 = await t.query(
        "INSERT INTO over_all_ranting (rating ,event_id , destination_id) VALUES (${rating},${event_id}, ${destination_id} )",
        {
          rating: data.reviews.combinedAverageRating,
          event_id: data.productCode,
          destination_id: destination_id,
        }
      );
   }

    return t.batch([q1,q2,q3,q4,q5]); // all of the queries are to be resolved;
  });
  return result;
}

module.exports = {
  insert_destinations,
  insertTags,
  insert_tags,
  create_event_table,
  create_partitions,
  DropAll,
  insert_to_db,
};
