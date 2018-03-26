const mongoose = require("mongoose");
const Ad = mongoose.model("Ad");
const User = mongoose.model("User");
const multer = require("multer");

exports.homePage = (req, res) => {
  res.render("index");
};

exports.getAdsTable = async(req, res) => {
    
    const ads = await Ad.find()
      .sort({ created: "desc" }); 
  res.render('adsTable', { title: 'Ads - Table', ads});
}

exports.getAds = async(req, res) => {
const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;

  const adsPromise = Ad
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });

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