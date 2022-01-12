require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dbConfig = require("./config/db.config");
const router = require("./api/v1/routes/home.routes");
const { PORT, ENV } = require("./config/server.config").props;

process.on("uncaughtException", (err) => {
  console.error(`[UNCAUGHT EXCEPTION]: ${err}`);
  process.exit(1);
});

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/", router);

mongoose.connect(dbConfig.dbURI, null, (err) => {
  if (err) {
    console.log(`[Database connection error]: ${err.message}`);
    process.exit(1);
  }
  console.log("DB connection established");
  app.listen(PORT, (err) => {
    if (err) {
      console.log(`[SERVER ERROR]: ${err.message}`);
    }
    console.log(`Server running at port ${PORT} in ${ENV} environment`);
  });
});
