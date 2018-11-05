"use strict";

const mongoose = require("mongoose");

module.exports = {
	create({ name, permissions }) {
		return mongoose.model("AccessGroup").create({ name, permissions });
	},
	get({ _id, name, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (name) params.name = name;
		return mongoose
			.model("AccessGroup")
			.find(params)
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	search({ searchString, pagination }) {
		return mongoose
			.model("AccessGroup")
			.find()
			.limit(pagination.limit)
			.skip(pagination.skip);
	}
};
