const createKafka = require("./kafkaproducer");

const deadLetterQueue = async (data) => {
  try {
    const producer = createKafka();
    await producer.connect();
    await producer.send({
      topic: "dead-letter-queue",
      messages: [{ value: JSON.stringify({ data}) }],
    });

    console.log("data pusblished to dead letter queue delayed Queue");

    await producer.disconnect();
  } catch (e) {
    console.log(e);
  }
};

module.exports = { deadLetterQueue };