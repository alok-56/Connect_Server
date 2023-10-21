const mongoose = require("mongoose");
require("dotenv").config();

const DB = () => {
  mongoose
    .connect(process.env.DB_KEY)
    .then((res) => {
      console.log("Database connection established")
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = DB;
