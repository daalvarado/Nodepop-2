
const i18n = require("i18n");

const fs = require("fs");

exports.moment = require("moment");

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Nodepop`;

exports.menu = [
  { slug: "/ads", title: i18n.__("Ads"), icon: "ad" },
  { slug: "/table", title: i18n.__("Table"), icon: "table"},
  { slug: "/tags", title: i18n.__("Tags"), icon: "tag" },
  { slug: "/add", title: i18n.__("Add"), icon: "add" },
  { slug: "/api", title: "API", icon: "api" },
  { slug: "/users", title: i18n.__("Users"), icon: "users" }
];

exports.languages = [
  { slug: "ads/en", title: "en", icon: "eng" },
  { slug: "ads/es", title: "es", icon: "esp" }
];
