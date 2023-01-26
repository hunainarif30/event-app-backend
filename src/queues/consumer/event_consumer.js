const { Kafka, logLevel } = require("kafkajs");
const _ = require("lodash");
const {
  insert_to_db,
  insert_reviews,
  insertTags,
} = require("../../services/services");
const kafka = new Kafka({
  enforceRequestTimeout: true,
  clientId: "my-app",
  brokers: ["localhost:9092"],
  connectionTimeout: 25000,
  requestTimeout: 25000,
  logLevel: logLevel.ERROR,
});

const event_consumer = async () => {
  const consumer = kafka.consumer({
    groupId: "test-gr",
  });
  await consumer.connect();
  await consumer.subscribe({ topic: "events-data" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const productData = await JSON.parse(message.value.toString());
      await productData.data.map(
        async (item) => await insert_to_db(item, productData.destinationId)
      );
    },
  });
};

module.exports = event_consumer;
