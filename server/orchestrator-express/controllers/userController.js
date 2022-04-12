const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

class PostController {
  static async getUsers(req, res) {
    try {
      const { data } = await axios.get("http://localhost:4001/users");
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const { data } = await axios.get("http://localhost:4001/users/"+ id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      let response = await axios({
        method: "POST",
        url: "http://localhost:4001/users",
        data: {
          username,
          email,
          password,
          role: "Admin",
          phoneNumber,
          address,
        },
      });
      await redis.del("users");
      res.status(201).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const response = await axios({
        method: "DELETE",
        url: "http://localhost:4001/users/" + req.params.id,
      });
      await redis.del("users");
      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PostController;
