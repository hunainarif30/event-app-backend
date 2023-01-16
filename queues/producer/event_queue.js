const { eventInfo } = require("../../apis/event_api");
const { delayedQueue } = require("./delayed_queue");
const createKafka = require("./kafkaproducer.js");
const kafkaProducer = async (data, producer, destinationId) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "events-data",
      messages: [{ value: JSON.stringify({data, destinationId}) }],
    });
    console.log("data pusblished to kafka topic");
    await producer.disconnect();
  } catch (e) {
    console.log(e);
  }
};

async function recurse(data) {
  var producer = createKafka();
  var count = 101;
  let start = data.start;
  do {
    try {
      start = start + 1;
      const productData = await eventInfo(start * 10 + 1, data.destinationId);
      productData.products
      await kafkaProducer(productData.products, producer, data.destinationId);
      count = productData.totalCount;
    } catch (e) {
      await delayedQueue(
        data.destinationId,
        data.destinationType,
        data.count,
        start * 10 + 1
      );
      console.log("error: ", e.message);
    }
  } while ((count >= start * 10) & (start * 10 < 10001));
}

module.exports = { recurse };
