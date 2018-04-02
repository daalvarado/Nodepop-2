const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const i18n = require("../lib/i18nConfigure")();


exports.login = async (req, res) => {;
    const email = req.body.email;
    const password = req.body.password;
    
    res.locals.error = '';
    res.locals.email = email;

    const user = await User.findOne({ email: email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      req.flash('error','Login details are not correct');
      res.render('login',{title: 'Login', i18n});
      return;
    }

    req.session.user = { _id: user._id };
    res.redirect('/');
};

exports.logout = async (req, res) => {
    req.session.user ="";
    res.clearCookie(process.env.KEY);
    req.flash('success', 'You are now logged out! 👋');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
    return;
  };
  req.flash("error", "You must be logged in to do that!");
  res.redirect('/login');
  return;
};