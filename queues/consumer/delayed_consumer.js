const { Kafka } = require("kafkajs");
const { destinationQueue } = require("../producer/destination_queue");
const createKafka = require("../producer/kafkaproducer");
const { deadLetterQueue } = require("../producer/dead_letter_queue");

const kafka = new Kafka({
  enforceRequestTimeout: true,
  clientId: "my-app",
  brokers: ["localhost:9092"],
  connectionTimeout: 25000,
  requestTimeout: 25000,
});
async function main() {
  var producer = createKafka();
  const consumer = kafka.consumer({ groupId: "test-group1" });
  await consumer.connect();
  await consumer.subscribe({ topic: "delayed-queue" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = await JSON.parse(message.value.toString());
      data.count = data.count + 1;
      if (data.count > 2) {
        console.log("count ", data.count);
        console.log("=============check dead letter===============");
        await deadLetterQueue(data);
      } else {
        // console.log("delayed data consuming: ", data);
        console.log("delayed queue se start aya : ", data.start);
        await destinationQueue(
          data.destinationId,
          data.destinationType,
          data.start,
          data.count,
          //  producer
        );
      }
    },
  });
}

main();
