const { destinationQueue } = require("../queues/producer/destination_queue");
const { destinationInfo } = require("../apis/event_api");
const { create_partitions } = require("../services/services");

const obj = {
  CITY: async (element) => {
    element.start = -1;
    element.count = 0;
    console.log("here***");
    // console.log("beta hallo", element.sortOrder);
    // await create_partitions(element.destinationId, element.destinationName);
    // await destinationQueue(
    //   element.destinationId,
    //   element.destinationType,
    //   element.destinationName,
    //   element.start,
    //   element.count,
    // );
  },
};

async function destinationApi() {
  try {
    const result = await destinationInfo();
    result.map(async (element) => {
      // if (element.sortOrder > 2) {
      //   return;
      // }
      const city = element;
      obj[element.destinationType](element);
    });
    console.log(result.length);
    return 200;
  } catch (e) {
    console.log(e.message);
    return 500;
  }
}

module.exports = destinationApi;
