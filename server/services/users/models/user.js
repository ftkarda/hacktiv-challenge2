const { getDatabase } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class User {
  static async findAll() {
    try {
      const db = getDatabase();
      const users = await db.collection("users").find().toArray();
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const db = getDatabase();
      const user = await db.collection("users").findOne({ _id: ObjectId(id) });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async create(user) {
    try {
      const db = getDatabase();
      const result = await db.collection("users").insertOne(user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const db = getDatabase();
      const result = await db
        .collection("users")
        .deleteOne({ _id: ObjectId(id) });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { User };
