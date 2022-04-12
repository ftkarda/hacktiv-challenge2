const { convertTokenToPayLoad } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = convertTokenToPayLoad(access_token);
    const user = await User.findByPk(payload.id);
  
    if (!user) {
      throw {
        code: 401,
        name: "InvalidUser",
        message: "Invalid token or user",
      };
    }

    req.currentUser = {
      id: user.id,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
