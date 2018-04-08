'use strict';

const cote = require('cote');
const jimp = require("jimp");
const path = require("path");

const responder = new cote.Responder({ name: "photo service responder" });

responder.on('convertPhoto', async (req, done) => {
    const location = path.join(__dirname, "/../public/uploads");
    const filename = `${location}/${req.original}`;
    try {
    const photo = await jimp.read(filename);
    await photo.resize(req.size, jimp.AUTO);
    await photo.write(`${location}/${req.thumbnail}`)
    }
    catch (err) {
        console.log(err);
    };
    console.log("thumbnail conversion finished");
    done(result);
});
