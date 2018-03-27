
const fs = require("fs");

exports.moment = require("moment");

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Nodepop`;

exports.menu = [
  { slug: "/ads", title: "Ads", icon: "ad" },
  { slug: "/table", title: "Table", icon: "table"},
  { slug: "/tags", title: "Tags", icon: "tag" },
  { slug: "/add", title: "Add", icon: "add" },
  { slug: "/api", title: "API", icon: "api" },
  { slug: "/users", title: "Users", icon: "users" }
];

exports.languages = [
  { title: "Eng", icon: "eng" },
  { title: "Esp", icon: "esp" }
];
