"use strict";

const superagent = require("superagent");
const mongoose = require("mongoose");
const config = require("../config");

module.exports = {
	get({ _id, partial, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (!_id && partial === false)
			params = {
				"github.dynamic.0": { $exists: true }
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
				"github.dynamic.0": { $exists: true }
			};
		return mongoose.model("Coin").count(params);
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
