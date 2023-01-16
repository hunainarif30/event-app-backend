const { Kafka } = require("kafkajs");
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
  await consumer.subscribe({ topic: "events-data" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const productData = await JSON.parse(message.value.toString());
      await productData.data.map(
        async (item) => await insert_to_db(item, productData.destinationId)
      );
      // await productData.data.map(async (item) =>
      //   console.log(item.reviews, productData.destinationId)
      // );
      // console.log(
      //   productData.data.map((item) => {
      //     item.reviews;
      //     item.productCode;
      //   })
      // );
    },
  });
}

main();
