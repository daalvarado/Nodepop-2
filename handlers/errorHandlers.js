const i18n = require("../lib/i18nConfigure")();

exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error(i18n__("Not Found"));
  err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler
*/

exports.flashValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash("error", err.errors[key].message));
  res.redirect("back");
};

/*
  Development Error Handler
  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    details: err.stack
  };
  res.status(err.status || 500);
  res.format({
    "text/html": () => {
      res.render("error", { errorDetails, title: "Error", i18n });
    },
    "application/json": () => res.json(errorDetails)
  });
};

/*
  Production Error Handler
  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  const errorDetails = {
    message: err.message,
    status: err.status
  };
  res.status(err.status || 500);
  res.format({
    "text/html": () => {
      res.render("error", { errorDetails, title: "Error", i18n });
    },
    "application/json": () => res.json(errorDetails)
  });
};
