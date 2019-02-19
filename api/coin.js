"use strict";

const mongoose = require("mongoose");

module.exports = {
	get({ _id, partial, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (!_id && partial === false)
			params = {
				name: { $ne: "" },
				abbreviation: { $ne: "" },
				"github.link": { $ne: "" }
			};
		pagination = pagination || {};
		return mongoose
			.model("Coin")
			.find(params)
			.limit(pagination.limit || 20)
			.skip(pagination.skip || 0);
	},
	search({ searchString, partial, pagination }) {
		pagination = pagination || {};
		return mongoose
			.model("Coin")
			.find({ $text: { $search: searchString } })
			.limit(pagination.limit || 20)
			.skip(pagination.skip || 0);
	},
	count({ partial }) {
		let params = {};
		if (partial === false)
			params = {
				name: { $ne: "" },
				abbreviation: { $ne: "" },
				"github.link": { $ne: "" }
			};
		return mongoose.model("Coin").countDocuments(params);
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
