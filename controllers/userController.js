const mongoose = require("mongoose");
const User = mongoose.model("User");
const i18n = require("../lib/i18nConfigure")();

exports.registerForm = async (req, res) => {
    res.render('register', {title: i18n.__('Register'), i18n})
};

exports.loginForm = async (req, res) => {
  res.render('login', {title: i18n.__('Login'), i18n})
};


exports.test = async (req, res) => {
  res.json ({
    name: i18n.__("hello")
  })
};

exports.validateRegister = async (req, res, next) => {
  req.sanitizeBody("name");
  req.checkBody("name", "Please enter a name").notEmpty();
  req.checkBody("email", "Please enter a valid email").isEmail();
  req.sanitizeBody("email").normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody("password", "Please enter a Password").notEmpty();
  req.checkBody("password-confirm", "Please confirm Password").notEmpty();
  req
    .checkBody("password-confirm", "Passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors.map(err => err.msg));
    res.render("register", {
      title: "Register",
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next(); 
};;

exports.register = async (req, res, next) => {
await User.create([
    { 
      name: req.body.name,
      email: req.body.email,
      password: await User.hashPassword(req.body.password)
    }]);
  
  next();
};

