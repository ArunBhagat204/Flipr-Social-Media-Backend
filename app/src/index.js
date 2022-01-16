require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./api/v1/helpers/db_connect");
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

dbConnect();

app.listen(PORT, (err) => {
  if (err) {
    console.log(`[SERVER ERROR]: ${err.message}`);
  }
  console.log(`Server running at port ${PORT} in ${ENV} environment`);
});
