const { destinationQueue } = require("../../queues/producer/destination_queue");
const { getAllDestination } = require("../../apis/event_api");
const { create_partitions } = require("../../services/services");

const decisionMaker = {
  CITY: async (element) => {
    element.start = -1;
    element.count = 0;
    await create_partitions(element.destinationId, element.destinationName);
    await destinationQueue(
      element.destinationId,
      element.destinationType,
      element.destinationName,
      element.start,
      element.count,
    );
  },
  REGION: () => {
    return;
  },
  COUNTRY: () => {
    return;
  },
};

async function fillDestination() {
  try {
    const result = await getAllDestination();
    result.map(async (element) => {
      if (element.sortOrder > 1) {
        return;
      }
      await decisionMaker[element.destinationType](element);
    });
    return 200;
  } catch (e) {
    console.log(e.message);
    return 500;
  }
}

module.exports = { fillDestination };
