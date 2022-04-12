const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

const routes = require("./router");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(routes);

app.listen(PORT, () => {
  console.log(`server running ` + PORT);
});
