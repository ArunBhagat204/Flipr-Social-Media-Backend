require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dbConfig = require("./config/dbconfig");
const router = require("./routes/homeRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(dbConfig.dbURI, null, (err) => {
  if (err) {
    console.log(`Mongoose connection error - ${err.message}`);
  }
});

app.use("/", router);

app.listen(3000);
