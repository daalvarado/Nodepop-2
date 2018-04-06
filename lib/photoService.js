'use strict';

const cote = require('cote');
const jimp = require("jimp");

const responder = new cote.Responder({ name: "photo service responder" });

responder.on('convertPhoto', async (req, done) => {
    const location = path.join(__dirname, "/../public/uploads");
    const filename = `${location}/${req.original}`
    jimp.read(filename).then(function(image) {
        return image.resize(req.size, jimp.AUTO)
        .write(`${location}/${req.thumbnail}`)
    }).catch(function(err){
        console.log(err);
    });
    done(result);
});
