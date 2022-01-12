require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const router = require("./api/v1/routes/home");
const { PORT, ENV } = require("./config/server_config").props;

process.on("uncaughtException", (err) => {
  console.error(`[UNCAUGHT EXCEPTION]: ${err}`);
  process.exit(1);
});

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`[SERVER ERROR]: ${err.message}`);
  }
  console.log(`Server running at port ${PORT} in ${ENV} environment`);
});
