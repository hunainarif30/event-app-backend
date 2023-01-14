const createKafka = require("../queues/producer/kafkaproducer");
const { destinationQueue } = require("../queues/producer/destination_queue");
const { destinationInfo } = require("../apis/event_api");
// const insertDestinations = require("../queries/insert_destinations");

async function destinationApi() {
  try {
    //  const producer = createKafka();
    const result = await destinationInfo();
    let newArray = result.slice(0, 2);
    // console.log(newArray);

    newArray.forEach(async (element) => {
      element.start = -1;
      element.count = 0;

      if (element.destinationType === "CITY") {
        await destinationQueue(
          element.destinationId,
          element.destinationType,

          element.destinationName,
          element.start,
          element.count
          // producer
        );
        // ---> db destinations insert
      }
    });

    return 200;
  } catch (e) {
    console.log(e);
    return 500;
  }
}

module.exports = destinationApi;
