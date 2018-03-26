
const fs = require("fs");

exports.moment = require("moment");

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Nodepop`;

exports.menu = [
  { slug: "/ads", title: "Ads", icon: "ad" },
  { slug: "/tags", title: "Tags", icon: "tag" },
  { slug: "/add", title: "Add", icon: "add" },
  { slug: "/eng", title: "Eng", icon: "eng" },
  { slug: "/esp", title: "Esp", icon: "esp" }
];
