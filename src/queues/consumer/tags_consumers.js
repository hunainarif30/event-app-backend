const { Kafka, logLevel } = require("kafkajs");
const { insert_tags } = require("../../services/services");
const { insert_to_db } = require("../../services/services");
const { container } = require("../../../di-setup");
const emitter = container.resolve("emitter");
const kafka = new Kafka({
  // enforceRequestTimeout: true,
  clientId: "my-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.ERROR,
  connectionTimeout: 25000,
  requestTimeout: 25000,
});
// kafka.logger().setLogLevel(logLevel.WARN);

const tags_consumer = async () => {
  const consumer = kafka.consumer({
    groupId: "test",
  });
  await consumer.connect();
  await consumer.subscribe({ topic: "tags-queue" });
  console.log("tags consumer runnning");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const productData = await JSON.parse(message.value.toString());
      productData.map((tag) => {
        console.log(tag.tagId, tag.allNamesByLocale.en);
        // await insert_tags(tag.tagId, tag.allNamesByLocale.en);
      });

      emitter.emit("event", "hello");
    },
  });
};

module.exports = tags_consumer;
