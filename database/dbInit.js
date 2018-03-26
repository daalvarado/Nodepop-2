"use strict";
require("dotenv").config({ path: "variables.env" });
const {mongoose} = require("./connect");
const { Ad } = require("./models/Ad");
const { User } = require("./models/User");

const adsDatabase = require("./db/ads.json");
const usersDatabase = require("./db/users.json");

// Ad.deleteMany()
//   .then(result => {
//     console.log("Ads database erased");
//   })
//   .then(Ad.insertMany(adsDatabase))
//   .then(result => {
//     console.log("Ads database updated");
//   })
//   .catch(e => console.log("Error deleting and updating Ads database"));

// User.deleteMany()
//   .then(result => {
//     console.log("Users database erased");
//   })
//   .then(User.insertMany(usersDatabase))
//   .then(result => {
//     console.log("Users database updated");
//     process.exit(0);
//   })
//   .catch(e => console.log("Error deleting and updating Users database"));

  async function initData() {
      await Ad.deleteMany();
      await User.deleteMany();
      console.log('Data Deleted!!');
 try{
    await Ad.insertMany(adsDatabase);
    await User.insertMany(usersDatabase);
    console.log("Data Loaded!!");
    process.exit(0)
} catch(e) {
    console.log('👎👎👎👎👎👎👎👎 Error Loading Data!');
    console.log(e);
    process.exit(0);
  }
  }

 
initData();
