"use strict";

const mongoose = require("mongoose");

const ObjectId = require("mongoose").Types.ObjectId;

ObjectId.prototype.valueOf = function() {
	return this.toString();
};

module.exports = () => {
	// register models
	mongoose.model("Complete", require("./coin"));
	mongoose.model("Partial", require("./coin"));
};
