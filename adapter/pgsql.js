const monitor = require("pg-monitor");
const pgp = require("pg-promise");
const bluebird = require("bluebird");
const config = require("../config/config");

console.info("Initializing PGSQL Adapter >");

const dbConfig = config.get("database").pgsql;

const initOptions = {
  promiseLib: bluebird,
};

const pgsql = pgp(initOptions);

if (!monitor.isAttached())
  monitor.attach(initOptions, ["query", "error", "connect", "disconnect"]);

const db = pgsql(dbConfig);

// await db.query("SELECT 1");

module.exports = db;
