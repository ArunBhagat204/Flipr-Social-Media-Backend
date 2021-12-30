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
    console.log(`[Database connection error]: ${err.message}`);
    process.exit(1);
  }
});

app.use("/", router);

app.listen(3000);
