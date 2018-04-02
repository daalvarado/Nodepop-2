"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const md5 = require("md5");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, index: true, required: 'Please enter a name', trim: true },
  email: { type: String, required: 'Please enter an email address', index: true, unique: true, lowercase: true, trim:true, validate: [validator.isEmail, 'Invalid Email Address']},
  password: String,
});

userSchema.statics.listar = function(
  filtro,
  skip,
  limit,
  sort,
  fields,
  callback
) {
  const query = User.find(filter);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec(callback);
};

userSchema.virtual("gravatar").get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.statics.hashPassword = function(plain) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, 10, function(err, hash) {
      if (err) {
        reject(err);
        return;
      }
      resolve(hash);
    });
  });
};

userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model("User", userSchema);

module.exports = { User };
