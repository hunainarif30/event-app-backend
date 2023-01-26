const awilix = require("awilix");
const emitter = require("./src/loaders/event_emitter");

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  container.register({
    emitter: awilix.asValue(emitter),
  });

  console.log("container registered", container);
}

module.exports = {
  container,
  setup,
};
