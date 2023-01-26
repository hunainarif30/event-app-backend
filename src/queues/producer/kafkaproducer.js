const { Kafka, Partitioners } = require("kafkajs");
function createKafka() {
  const kafka = new Kafka({
    // enforceRequestTimeout: true,
    retry: true,
    Leader: 0,
    clientId: "my-app",
    brokers: ["localhost:9092"],
    connectionTimeout: 25000,
    requestTimeout: 25000,
  });
  const producer = kafka.producer({
    // idempotent: true,
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  return producer;
}
module.exports = createKafka;
