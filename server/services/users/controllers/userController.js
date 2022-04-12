const { User } = require("../models/user");

class UserController {
  static async findAllUser(req, res) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internat server error" });
    }
  }

  static async findByIdUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password, role, phoneNumber, address } =
        req.body;

      const user = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      });
      res.status(201).json({
        message: `Success create user id ${user.insertedId}`,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await User.delete(id);

      res.status(200).json({ message: `Success delete user id ${id}` });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = UserController;
