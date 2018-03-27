const mongoose = require("mongoose");
const Ad = mongoose.model("Ad");
const User = mongoose.model("User");
const multer = require("multer");

exports.homePage = async (req, res) => {
  const ads = await Ad.find();
  res.render('welcome', {title: 'Home Page', ads});
};

exports.getAdsTable = async(req, res) => {
    
    const ads = await Ad.find()
      .sort({ created: "desc" }); 
  res.render('adsTable', { title: 'Ads - Table', ads});
}

exports.getAds = async(req, res) => {
  const name = req.query.name;
  const tags = req.query.tags;
  const sale = req.query.sale;
  const priceRaw = req.query.price;
  const page = req.params.page || 1;
  const sort = req.query.sort;
  const fields = req.query.fields;
  const limit = parseInt(req.query.limit) || 4;
  const skip = parseInt(req.query.skip) || ((page * limit) - limit);

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

  const adsPromise = Ad

    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort || { created: 'desc' });

  const countPromise = Ad.count();

  const [ads, count] = await Promise.all([adsPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if (!ads.length && skip) {
    req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
    res.redirect(`/ads/page/${pages}`);
    return;
  }

  res.render('ads', { title: 'Ads', ads, page, pages, count });
};