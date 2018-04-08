const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const User = mongoose.model("User");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const expressValidator = require("express-validator");
const routes = require("./routes/index");
const helpers = require("./helpers");
const i18n = require("./lib/i18nConfigure")();
const errorHandlers = require("./handlers/errorHandlers");

const app = express();

// handle cookies
app.use(cookieParser());

// define view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// define public folder for static files
app.use(express.static(path.join(__dirname, "public")));

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use express validator
app.use(expressValidator());
 
// use sessions
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// use flash
app.use(flash());

// use i18n
app.use(i18n.init);

// use helpers
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.session=req.session;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

//identify postman requests and put user data into user variable
app.use((req, res, next) => {
  res.locals.postman = req.headers["user-agent"]
        .toLowerCase()
        .startsWith("postman");
  if (req.session && req.session.user) {
    User.findOne ({email: req.session.user.email}, (err,user)=> {
      if (user) {
        req.user = user;
        req.user.password="";
        req.session.user = user;
        res.locals.user= user;
      }
      next();
    });
  } else {
    next();
  }
});

//Define routes
app.use(  "/",  routes);

//Error handling
app.use(errorHandlers.notFound);
app.use(errorHandlers.flashValidationErrors);
if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

module.exports = app;