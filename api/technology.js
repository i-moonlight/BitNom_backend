"use strict";

const mongoose = require("mongoose");

const auth = require("../common/auth");

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
	search({ _id, searchString, pagination }) {
		let params = {};
		if (_id) params.user = _id;
		return mongoose
			.model("Technology")
			.find(Object.assign(params, { $text: { $search: searchString } }))
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	create({ technology }, req) {
		technology.follows = 0;
		technology.date = new Date();
		technology.user = "5bab3fba9927f84421ee9103";
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "technology", "create"))
			.then(() => mongoose.model("Technology").create(technology));
	},
	vote({ candidate, invoiceId, user, amount }) {
		return mongoose
			.model("Vote")
			.create({ candidate, invoiceId, user, amount, date: new Date() });
	},
	delete({ ids }, req) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("Technology")
				.find({ _id: { $in: ids } })
				.then(technologies => {
					let owned = technologies.reduce((acc, technology) => {
						return acc && technology.user === req.user._id;
					}, true);
					if (!owned) {
						throw new Error("Ownership required!");
					}
				})
				.then(() => {
					return mongoose
						.model("Technology")
						.deleteMany({ _id: { $in: ids } });
				})
				.then(() => ids)
		);
	},
	update({ _id, technology }, req) {
		return auth.loginRequired(req).then(() => {
			return mongoose
				.model("Technology")
				.findByIdAndUpdate(_id, technology, { new: true });
		});
	}
};
