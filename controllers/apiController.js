const mongoose = require("mongoose");
const Ad = mongoose.model("Ad");
const User = mongoose.model("User");
const multer = require("multer");
const i18n = require("../lib/i18nConfigure")();



exports.apiAds = async (req, res) => {
  
  const name = req.query.name;
  const tags = req.query.tags;
  const sale = req.query.sale;
  const priceRaw = req.query.price;
  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  const sort = req.query.sort;
  const fields = req.query.fields;
  
  const filter = {};

  if (typeof name !== "undefined") {
    filter.name = new RegExp("^" + req.query.name, "i");
  }

  if (typeof sale !== "undefined") {
    filter.sale = sale;
    console.log(filter.sale);
  }

  if (typeof tags !== "undefined") {
    const regex = tags.split(",").join("|");
    filter.tags = { $regex: regex, $options: "i" };
    console.log(filter.tags);
  }

  if (typeof priceRaw !== "undefined") {
    if (/^[0-9]\d{0,9}(\.\d{1,2})?$/.test(priceRaw)) {
      filter.price = priceRaw;
    } else if (/^-[0-9]\d{0,9}(\.\d{1,2})?$/.test(priceRaw)) {
      filter.price = { $lte: priceRaw.substring(1) };
    } else if (/^[0-9]\d{0,9}(\.\d{1,2})?-$/.test(priceRaw)) {
      filter.price = { $gte: priceRaw.substring(0, priceRaw.length - 1) };
    } else if (/^[0-9]\d{0,9}(\.\d{1,2})?-\d{0,9}(\.\d{1,2})?$/.test(priceRaw)) {
      const max = priceRaw.split("-").pop();
      const min = priceRaw.split("-")[0];
      filter.price = { $gte: min, $lte: max };
    }
  }
    
  const ads = await Ad
    .list(filter, skip, limit, sort, fields);
  res.json(ads);
};

exports.apiUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

