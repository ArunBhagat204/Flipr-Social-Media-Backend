require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dbConfig = require("./config/dbconfig");
const router = require("./api/v1/routes/home");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(dbConfig.dbURI, null, (err) => {
  if (err) {
    console.log(`[Database connection error]: ${err.message}`);
    process.exit(1);
  }
});

app.use("/", router);

app.listen(3000);
