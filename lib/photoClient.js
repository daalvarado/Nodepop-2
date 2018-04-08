'use strict'

const cote = require("cote");

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
console.log('conversion sent to photo service')
  });

  next();
};