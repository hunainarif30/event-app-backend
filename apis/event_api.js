const axios = require("axios");
require('dotenv').config();
const headers = require("../config/debug.json")
async function destinationInfo() {
  const response = await axios({
    method: "get",
    url: `${process.env.BASE_URL}/v1/taxonomy/destinations`,
    headers: {
      "exp-api-key": "4d1960fb-a0b2-4ed5-8194-811ef09a9db8",
      Accept: "application/json;version=2.0",
      "Accept-Language": "en-US",
      rejectUnauthorized: false,
    },
  });

  return response.data.data;
}
async function eventInfo(start, destinationId) {
  const response = await axios({
    method: "post",
    url: `${process.env.BASE_URL}/products/search`,
    headers: {
      "exp-api-key": "4d1960fb-a0b2-4ed5-8194-811ef09a9db8",
      Accept: "application/json;version=2.0",
      "Accept-Language": "en-US",
      rejectUnauthorized: false,
    },
    data: {
      filtering: {
        destination: destinationId,
      },
      pagination: {
        start: start,
        count: 10,
      },
      currency: "USD",
    },
  });
  return response["data"];
}

module.exports = { destinationInfo, eventInfo };
