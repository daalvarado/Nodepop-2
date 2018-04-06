'use strict'

const cote = require("cote");
const jimp = require("jimp");
const uuid = require("uuid");


exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

const requester = new cote.Requester({ name: "photo conversion client" });

  const photoId = uuid.v4();
  const thumbnailId = `${photoId}-t`;
  const extension = req.file.mimetype.split("/")[1];
  req.body.picture = `${photoId}.${extension}`;
  req.body.thumbnail = `${thumbnailId}.${extension}`; 
  
  const request = { type: "convertPhoto", size: 400, name: req.body.picture, file: req.file.buffer };
  requester.send( request, (res) => {
      console.log(res)
  });

  next();

};

exports.thumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

const requester = new cote.Requester({ name: "thumbnail client" });
const request = {
  type: "convertPhoto",
  size: 100,
  original: req.body.picture,
  thumbnail: req.body.thumbnail
};
  requester.send( request, (res) => {
console.log(res);
  });

  next();
};