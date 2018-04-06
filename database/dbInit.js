"use strict";
require("dotenv").config({ path: __dirname +"/../variables.env" });

const {mongoose} = require("./connect");
const { Ad } = require("./models/Ad");
const { User } = require("./models/User");

const adsDatabase = require("./db/ads.json");
const usersDatabase = require("./db/users.json");

const initData = async () => {
  try{
    await Ad.remove();
    console.log("Ad Data Deleted!!");
    await User.remove();
    console.log('User Data Deleted!!'); 
    await Ad.insertMany(adsDatabase);
    console.log("Ad Data Loaded!!");
    await User.insertMany(usersDatabase);
    console.log("User Data Loaded!!");
    process.exit(0)
    } catch(e) {
    console.log('Error Loading Data!');
    console.log(e);
    process.exit(0);
    }
  };

 
initData();

