const { MongoClient } = require("mongodb");

// Connection Url
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "p3-news-portal";
let db;

async function connect() {
  await client.connect();
  console.log("Connected successfully to server");
  db = client.db(dbName);
}

function getDatabase() {
  return db;
}
module.exports = {
  connect,
  getDatabase,
};
