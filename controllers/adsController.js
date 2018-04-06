const mongoose = require("mongoose");
const Ad = mongoose.model("Ad");
const User = mongoose.model("User");
const multer = require("multer");
const jimp = require("jimp");
const i18n = require("../lib/i18nConfigure")();
const uuid = require("uuid");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed!" }, false);
    }
  }
};

exports.homePage = async (req, res) => {
  const ads = await Ad.find();
  res.render("welcome", { title: i18n.__("Home Page"), ads, i18n });
};

exports.getAdsTable = async(req, res) => {
    const ads = await Ad.find().populate('author', 'email')
      .sort({ created: "desc" });
  res.render("adsTable", { title: i18n.__("Ads - Table"), ads, i18n });
}

exports.getTags = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || {$exists: true, $ne: []};
  const tagsPromise = Ad.getTagsList();
  const adsPromise = Ad.find({ tags: tagQuery });
  const [tags, ads] = await Promise.all([tagsPromise, adsPromise]);
  res.render("Tags", {tags, title: i18n.__("Get Stores by Tag"), tag, ads, i18n });
};

exports.addAd = (req, res) => {
  res.render("editAd", { title: i18n.__("Add a New Ad"), i18n });
};

const confirmOwner = (ad, user) => {
  if (!ad.author.equals(user._id)) {
    throw Error('You must have created an ad in order to edit it!');
  }
};

exports.editAd = async (req, res) => {
  const ad = await Ad.findOne({ _id: req.params.id });
  confirmOwner(ad, req.user);
  res.render('editAd', { title: `Edit ${ad.name}`, ad });
};

exports.upload = multer(multerOptions).single('picture');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next(); 
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  const photoId = uuid.v4();
  const thumbnailId = `${photoId}-t`;
  req.body.picture = `${photoId}.${extension}`;
  req.body.thumbnail = `${thumbnailId}.${extension}`; 
  
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(400, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.picture}`);
  next();
};

exports.createAd = async (req, res) => {
  req.body.author = req.user._id;
  const ad = await new Ad(req.body).save();
  req.flash(
    "success",
    `Successfully Added ${ad.name}.`
  );
  res.redirect(`/ads`);
};

exports.updateAd = async (req, res) => {
  const ad = await Ad.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash(
    "success",
    `Successfully updated <strong>${ad.name}</strong>`
  );
  res.redirect(`/ads`);
};

exports.english = async(req, res) => {
  res.cookie("nodepop-lang", "en");
  i18n.locale = "en";
  res.redirect(req.headers.referer)
}

exports.spanish = async (req, res) => {
  res.cookie("nodepop-lang", "es");
  i18n.locale='es';
  res.redirect(req.headers.referer);
};

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
    
  }

  if (typeof tags !== "undefined") {
    const regex = tags.split(",").join("|");
    filter.tags = { $regex: regex, $options: "i" };
    
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
  res.render('ads', { title: i18n.__('Ads'), ads, page, pages, count,i18n });
};

