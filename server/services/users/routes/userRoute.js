const router = require("express").Router();
const UserControllers = require("../controllers/userController");

router.get("/", UserControllers.findAllUser);
router.post("/", UserControllers.createUser);
router.get("/:id", UserControllers.findByIdUser);
router.delete("/:id", UserControllers.deleteUser);

module.exports = router;
