"use strict";

const mongoose = require("mongoose");
const schema = require("./shared/thread");

mongoose.model("CoinThread", schema);
