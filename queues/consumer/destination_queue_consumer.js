const { Kafka } = require("kafkajs");
// const Services = require("../../services/services");
const { recurse } = require("../producer/event_queue");
const { insert_destinations } = require("../../services/services");
const kafka = new Kafka({
  enforceRequestTimeout: true,
  clientId: "my-app",
  brokers: ["localhost:9092"],
  connectionTimeout: 25000,
  requestTimeout: 25000,
});

async function main() {
  const consumer = kafka.consumer({
    groupId: "test-group",
  });
  await consumer.connect();
  await consumer.subscribe({ topic: "destination-queue" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const productData = await JSON.parse(message.value.toString());

      await insert_destinations(
        productData.destinationId,
        productData.destinationName
      );

      await create_event_table(productData.destinationId, destinationName);
      // const result = Services.createDestinations();
      //  await recurse(productData);
    },
  });
}

main();
