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
	require("./coin-vote");
	require("./vote");
	require("./technology");
	require("./source-code");
	require("./coin-thread");
	require("./technology-thread");
	require("./message");
	require("./feedback");
};
