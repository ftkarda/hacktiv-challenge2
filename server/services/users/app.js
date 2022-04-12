const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute");
const { connect } = require("./config/mongodb");

const PORT = process.env.PORT || 4001;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.use("/users", userRoute);

connect().then(() => {
  app.listen(PORT, () => {
    console.log("app listening in port", PORT);
  });
});
