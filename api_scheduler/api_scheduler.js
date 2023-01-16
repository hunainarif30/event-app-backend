const cron = require('node-cron');
const destinationApi = require("./controller/controller");

// const fetchDestnations = cron.schedule('0 0 * * *', () => {
    const fetchDestinations = cron.schedule('* * * * *', () => {
  destinationApi();
});

fetchDestinations.start();