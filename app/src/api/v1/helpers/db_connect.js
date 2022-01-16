const mongoose = require("mongoose");
const dbConfig = require("../../../config/db.config");

const dbConnect = () => {
  mongoose.connect(dbConfig.dbURI, null, (err) => {
    if (err) {
      console.log(`[Database connection error]: ${err.message}`);
      process.exit(1);
    }
    console.log("DB connection established");
  });
};

module.exports = dbConnect;
