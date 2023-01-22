const { Kafka } = require("kafkajs");
const { insert_tags } = require("../../services/services");
const { insert_to_db } = require("../../services/services");
const kafka = new Kafka({
  enforceRequestTimeout: true,
  clientId: "my-app",
  brokers: ["localhost:9092"],
  connectionTimeout: 25000,
  requestTimeout: 25000,
});

var count = 0;

async function main() {
  const consumer = kafka.consumer({
    groupId: "test-gr",
  });
  await consumer.connect();
  await consumer.subscribe({ topic: "tags-queue" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const productData = await JSON.parse(message.value.toString());
      await insert_tags(productData.tagId, productData.tagName);
    },
  });
}

main();
