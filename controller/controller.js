const createKafka = require("../queues/producer/kafkaproducer");
const { destinationQueue } = require("../queues/producer/destination_queue");
const { destinationInfo } = require("../apis/event_api");

let destinationType = {
  CITY: async (element) => {
    element.start = -1;
    element.count = 0;
    await destinationQueue(
      element.destinationId,
      element.destinationType,
      element.destinationName,
      element.start,
      element.count
    );
  },
};

async function destinationApi() {
  try {
    const result = await destinationInfo();
    result.map(async (element) => {
      if (element.sortOrder > 2) {
        return;
      }
     await destinationType["CITY"](element);
    });
    return 200;
  } catch (e) {
    console.log(e);
    return 500;
  }
}

module.exports = destinationApi;
