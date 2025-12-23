// E:\lams-cms\config\redis.js
const redis = require("redis");
const client = redis.createClient({
  url: "redis://localhost:6379",
});

(async () => {
  await client.connect();
  console.log("Redis Connected");
})();

module.exports = client;
