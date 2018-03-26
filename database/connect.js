'use strict';
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection
  .on("error", err => {
    console.error(`Error connecting to database: ${err.message}`);
    process.exit()
  })
  .once("open", () => {
    console.log("Connected to Mongoose on", mongoose.connection.name);
  });
  
  module.exports = {mongoose};
