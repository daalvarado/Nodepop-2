'use strict';

const cote = require('cote');
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const responder = new cote.Responder({ name: "photo service responder" });

responder.on('convertPhoto', async (req, done) => {
    console.log("converting" + req.size + req.name + req.file);
    // const location = path.join(__dirname, "/../public/uploads");
    // const filename = `${location}/${req.name}`
    console.log(filename);
    jimp.read(req.file).then(function(image) {
        return image.resize(req.size, jimp.AUTO)
        .write('/photos/'+req.name)
    }).catch(function(err){
        console.log(err);
    });
    done(result);
});



//     const photo = await jimp.read(req.file);
//     await photo.resize(req.size, jimp.AUTO);
//     await fs.writeFile(filename, photo);
//     const result ="done!"
//     done(result);
// })
