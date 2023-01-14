const createKafka = require("./kafkaproducer");

const delayedQueue = async (destinationId, destinationType,count, start) => {
  try {
    const producer = createKafka();
    await producer.connect();
    await producer.send({
      topic: "delayed-queue",
      messages: [{ value: JSON.stringify({ destinationId, destinationType,count, start}) }],
    });

    console.log("data pusblished to delayed Queue");

    await producer.disconnect();
  } catch (e) {
    console.log(e);
  }
};

module.exports = { delayedQueue };
