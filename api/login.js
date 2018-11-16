"use strict";

const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");

const config = require("../config");

module.exports = ({ email, password }) => {
  return mongoose
    .model("User")
    .findOne({ email })
    .then(user => {
      if (!user) {
        throw new Error("Invalid email or password!");
      }
      return user.isPassword(password).then(matches => {
        if (!matches) {
          throw new Error("Invalid email or password!");
        }
        // return json web token
        return jsonwebtoken.sign(
          {
            _id: user._id,
            access: user.access
          },
          config.secret,
          { expiresIn: "1y" }
        );
      });
    });
};
