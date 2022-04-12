const { MongoClient } = require("mongodb");

// Connection Url
const url =
  "mongodb+srv://ftkarda:42WAqXH2aiQyPhPG@cluster0.blqc2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, {
  connectTimeoutMS: 15000,
  useUnifiedTopology: true,
});

// Database Name
const dbName = "p3-news-portal";
let db;

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    db = client.db(dbName);
  } catch (error) {
    throw error;
  }
}

function getDatabase() {
  return db;
}
module.exports = {
  connect,
  getDatabase,
};
