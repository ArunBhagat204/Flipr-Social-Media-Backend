require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./config/dbconfig");
const router = require("./routes/homeRoutes");

const app = express();
app.use(express.json());

mongoose.connect(dbConfig.dbURI, null, (err) => {
  if (err) {
    console.log(err);
  }
});

app.use("/", router);

app.listen(3000);
