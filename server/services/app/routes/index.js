const router = require("express").Router();
const userRoute = require("./userRoute");
const categoryRoute = require("./categoryRoute");
const postRoute = require("./postRoute");
const costumerRoute = require("./customerRoute");

const authentication = require("../middlewares/authentication");

router.use("/", userRoute);
router.use("/customers", costumerRoute);

router.use(authentication);

router.use("/categories", categoryRoute);
router.use("/posts", postRoute);

module.exports = router;
