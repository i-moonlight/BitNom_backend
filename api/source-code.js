"use strict";

const mongoose = require("mongoose");

module.exports = {
	create({ target, description, code }) {
		return auth.loginRequired(req).then(() =>
			mongoose.model("SourceCode").create({
				target,
				description,
				code,
				date: new Date(),
				user: req.user._id
			})
		);
	},
	get({ _id, name, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("SourceCode")
				.find(params)
				.limit(pagination.limit)
				.skip(pagination.skip)
		);
	},
	search({ searchString, pagination }) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("SourceCode")
				.find({ $text: { $search: searchString } })
				.limit(pagination.limit)
				.skip(pagination.skip)
		);
	},
	delete({ ids, pagination }) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("SourceCode")
				.deleteMany({ _id: { $in: ids } })
				.then(() => ids)
		);
	},
	update({ _id, description, code }) {
		let updates = {};
		if (description) updates.description = description;
		if (code) updates.code = code;
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose
					.model("SourceCode")
					.findOneAndUpdate({ _id }, { $set: updates }, { new: true })
			);
	}
};
