const router = require("express").Router();
const postRoute = require("./postRoute");
const userRoute = require("./userRoure");


router.use("/posts", postRoute);
router.use("/users", userRoute);


module.exports = router;
