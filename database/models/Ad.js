"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// define Schemas
const adSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: "Please enter an ad name!",
    trim: true
  },
  sale: {
    type: Boolean,
    index: true,
    default: true,
    required: "Please enter if it true for sale or false for purchase",
    enum: ["true", "false"]
  },
  price: {
    type: Number,
    index: true,

    min: 0.01,
    required: "Please enter a price",
    validate: {
      validator: function(v) {
        return /^[0-9]\d{0,9}(\.\d{1,2})?$/.test(v);
      },
      message:
        "Price is not valid. Must be greater than 0.01 and have no more than 2 decimals"
    }
  },
  picture: { type: String },
  thumbnail: {type: String},
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', 
  },
  created: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: String,
    index: true,
    required: true,
    validate: {
      validator: function(v) {
        v = v.split(",");
        var count = 0;
        for (let i = 0; i < v.length; i++) {
          v[i] = v[i].trim();
          if (
            v[i] === "lifestyle" ||
            v[i] === "motor" ||
            v[i] === "mobile" ||
            v[i] === "work"
          ) {
            count = count;
          } else {
            count++;
          }
        }
        return count == 0;
      },
      message: "Tags not valid"
    }
  }
});



adSchema.statics.list = function(filter, skip, limit, sort, fields, callback) {
  const query = Ad.find(filter);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec(callback);
};

adSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};



// create the model
const Ad = mongoose.model("Ad", adSchema);

// export the model
module.exports = { Ad };
