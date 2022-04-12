const { comparePasswordWithHash } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");


class UserController {
  static async register(req, res, next) {
    const { username, email, role, password, phoneNumber, address } = req.body;
    try {
      const user = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      });
      res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!email || !password) {
        throw {
          code: 400,
          name: "BadRequest",
          message: "Input email/password",
        };
      }

      if (!user) {
        throw {
          code: 401,
          name: "Unauthorized",
          message: "Invalid email or password",
        };
      }

      const isValidPassword = comparePasswordWithHash(password, user.password);
      if (!isValidPassword) {
        throw {
          code: 401,
          name: "Unauthorized",
          message: "Invalid email or password",
        };
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const access_token = generateToken(payload);

      res.status(200).json({
        message: "Login Successfull",
        access_token: access_token,
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const user = await User.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
