"use strict";

const mongoose = require("mongoose");

module.exports = {
	get({ _id, partial, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		return mongoose
			.model("Coin")
			.find(params)
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	search({ searchString, partial, pagination }) {
		return mongoose
			.model("Coin")
			.find({ $text: { $search: searchString } })
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	vote({ invoiceId, user, candidate, amount }) {
		return mongoose
			.model("Vote")
			.create({ invoiceId, user, candidate, amount, date: new Date() });
	},
	votes({ candidate }) {
		return mongoose.model("Vote").find({ candidate });
	}
};
