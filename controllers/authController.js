const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const i18n = require("../lib/i18nConfigure")();
const jwt = require('jsonwebtoken');

exports.logout = async (req, res) => {
    delete req.session.user;
    delete req.session.token;
    res.clearCookie(process.env.KEY);
    req.flash('success', i18n.__('You are now logged out!'));
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  const token = req.session.token || req.query.token || req.get('x-access-token');
  if (!token) {
    if (res.locals.postman || req.url=="/api/ads" || req.url=="/api/users") {
    const err = new Error(i18n.__('no token provided'));
    err.status=401;
    return next(err);}
    req.flash("error", i18n.__('You must be logged in to do that!'));
    return res.redirect("/authenticate");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      err.status=401;
      return next(err);
    }
    console.log(decoded);
    req.apiUserId = decoded.id;
    next();
  })
}

exports.loginJWT = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    res.locals.error = '';
    res.locals.email = email;

    const user = await User.findOne({ email: email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      if (res.locals.postman) {
        return res.json({success: false, error: 'Wrong credentials'});
      }
      req.flash('error',i18n.__('Login details are not correct'));
      return res.redirect(301,'/authenticate');
    }

    jwt.sign({id:user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    }, (err, token) => {
      if(err) {
        if (res.locals.postman) {
          return res.json({success: false, error: 'Error signing token'});
        }
        req.flash("error", i18n.__("Error in token"));
        return res.redirect(301, "/authenticate");
      }
      if (res.locals.postman) {
          res.json({success:true, token: token});
          } else {
      req.flash("success", i18n.__(`You are logged in!<br/><br/>Your token:<br/><br/>`)+token);
      req.session.user=user;
      req.session.token=token;
      res.redirect("/");}
    });
};



