"use strict";

const mongoose = require("mongoose");

module.exports = {
	get({ _id, partial, pagination }) {
		const collection = partial ? "Partial" : "Complete";
		let params = {};
		if (_id) params._id = _id;
		return mongoose
			.model(collection)
			.find(params)
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	search({ searchString, partial, pagination }) {
		const collection = partial ? "Partial" : "Complete";
		return mongoose
			.model(collection)
			.find({ $text: { $search: searchString } })
			.limit(pagination.limit)
			.skip(pagination.skip);
	}
};
