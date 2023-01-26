const { TagsQueues } = require("../../queues/producer/tags_queues");
const { getAllTags } = require("../../../apis/event_api");

async function fillTags() {
  try {
    const result = await getAllTags();
    await TagsQueues(result);
    console.log("data published to tags queue");
    return 200;
  } catch (e) {
    console.log(e.message);
    return 500;
  }
}

module.exports = { fillTags };
