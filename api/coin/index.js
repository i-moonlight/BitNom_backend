"use strict";

const mongoose = require("mongoose");

module.exports = {
	get(options) {
		const collection = options && options.partials ? "Partial" : "Complete";
		return mongoose.model(collection).find();
	}
};
