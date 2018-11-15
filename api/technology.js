"use strict";

const mongoose = require("mongoose");

module.exports = {
	get({ _id, name, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (name) params.name = name;
		return mongoose
			.model("Technology")
			.find(params)
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	search({ searchString, pagination }) {
		return mongoose
			.model("Technology")
			.find({ $text: { $search: searchString } })
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	create({ technology }) {
		technology.follows = 0;
		technology.date = new Date();
		technology.user = "5bab3fba9927f84421ee9103";
		return mongoose.model("Technology").create(technology);
	},
	vote({ candidate, invoiceId, user, amount }) {
		return mongoose
			.model("Vote")
			.create({ candidate, invoiceId, user, amount, date: new Date() });
	},
	delete({ ids }) {
		return mongoose
			.model("Technology")
			.deleteMany({ _id: { $in: ids } })
			.then(() => ids);
	},
	update({ _id, technology }, req) {
		return Promise.resolve().then(() => {
			return mongoose
				.model("Technology")
				.findByIdAndUpdate(_id, technology, { new: true });
		});
	}
};
