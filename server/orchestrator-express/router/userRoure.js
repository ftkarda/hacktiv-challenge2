const router = require("express").Router();
const UserController = require("../controllers/userController");

router.get("/", UserController.getUsers);
router.post("/", UserController.createUser);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
