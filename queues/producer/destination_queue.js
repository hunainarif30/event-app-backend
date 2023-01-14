const createKafka = require("./kafkaproducer");

var producer = createKafka();
const destinationQueue = async (
  destinationId,
  destinationType,
  destinationName,
  start,
  count,
  ) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "destination-queue",
      messages: [
        {
          value: JSON.stringify({
            destinationId,
            destinationType,
            destinationName,
            start,
            count,
          }),
        },
      ],
    });
    console.log("data pusblished to destination topic");
    await producer.disconnect();
  } catch (e) {
    console.log(e);
  }
};
module.exports = { destinationQueue };
