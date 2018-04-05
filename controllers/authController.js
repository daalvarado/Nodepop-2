const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const i18n = require("../lib/i18nConfigure")();
const jwt = require('jsonwebtoken');

exports.logout = async (req, res) => {
    delete req.session.user;
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
  return res.redirect('/authenticate');
};

//con JWT
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
      req.flash('error','Login details are not correct');
      return res.redirect(301,'/authenticate');
    }

    jwt.sign({id:user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    }, (err, token) => {
      if(err) {
        if (res.locals.postman) {
          return res.json({success: false, error: 'Error signing token'});
        }
        req.flash("error", "Error in token");
        return res.redirect(301, "/authenticate");
      }
      if (res.locals.postman) {
          res.json({success:true, token: token});
          } else {
      req.flash("success", `You are logged in!<br/><br/>Your token:<br/><br/>`+token);
      req.session.user=user;
      req.session.token=token;
      // $window.localStorage['jwtToken']=token;
      res.redirect("/");}
    });
};



