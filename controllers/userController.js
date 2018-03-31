const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");

exports.registerForm = async (req, res) => {
    res.render('register', {title: 'Register'})
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
const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

