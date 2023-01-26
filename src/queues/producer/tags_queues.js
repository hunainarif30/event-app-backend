const createKafka = require("./kafkaproducer");
var producer = createKafka();
const TagsQueues = async (tags) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "tags-queue",
      messages: [
        {
          value: JSON.stringify(tags),
        },
      ],
    });
    // console.log(tagId, tagName);
    await producer.disconnect();
  } catch (e) {
    console.log(e);
  }
};
module.exports = { TagsQueues };
