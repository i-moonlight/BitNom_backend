"use strict";

const mongoose = require("mongoose");

const ObjectId = require("mongoose").Types.ObjectId;

ObjectId.prototype.valueOf = function() {
	return this.toString();
};

module.exports = () => {
	// register models
	require("./coin");
	require("./user");
	require("./access-group");
};
