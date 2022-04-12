const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Unauthorized":
      res.status(err.code).json({ message: err.message });
      break;
    case "BadRequest":
      res.status(err.code).json({ message: err.message });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "NotFound":
      res.status(err.code).json({ message: err.message });
      break;
    case "InvalidUser":
      res.status(err.code).json({ message: err.message });
      break;
    case "JsonWebTokenError":
      res.status(400).json({ message: "access_token must be provided" });
      break;
    case "Forbidden":
      res.status(err.code).json({ message: err.message });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errorHandler;
