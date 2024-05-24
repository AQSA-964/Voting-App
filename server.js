require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const router = require("./routes/index");
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());

connectDB();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
