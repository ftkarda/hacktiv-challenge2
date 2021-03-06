
const { MongoClient } = require("mongodb");
const docs = require("./user-init.json");
// Replace the uri string with your MongoDB deployment's connection string.

const uri = "mongodb+srv://ftkarda:42WAqXH2aiQyPhPG@cluster0.blqc2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("p3-news-portal");

    const users = database.collection("users");

    const option = { ordered: true };
    const result = await users.insertMany(docs, option);
    console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
