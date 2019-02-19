"use strict";

const mongoose = require("mongoose");
const auth = require("../common/auth");

module.exports = model => ({
	create({ thread }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "thread", "create"))
			.then(() => mongoose.model("Coin").findById(thread.resource))
			.then(resource => {
				if (!resource)
					return Promise.reject("Specified resource does not exist");
			})
			.then(() => {
				thread.date = new Date();
				thread.user = req.user._id;
				return mongoose.model(model).create(thread);
			});
	},
	update({ thread }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "thread", "update"))
			.then(() => {
				delete thread.date;
				delete thread.user;
				delete thread.coin;
				const _id = thread._id;
				return mongoose.model(model).findByIdAndUpdate(_id, thread);
			});
	},
	delete({ _id }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "thread", "delete"))
			.then(() =>
				mongoose.model(model).deleteOne({ _id, user: req.user._id })
			);
	},
	get({ _id, category, user, resource, pagination }, req) {
		let params = {};
		if (_id) params._id = _id;
		if (category) params.category = category;
		if (user) params.user = user;
		if (resource) params.resource = resource;
		pagination = pagination || {};
		return mongoose
			.model(model)
			.find(params)
			.limit(pagination.limit || 20)
			.skip(pagination.skip || 0);
	},
	count({ category, user, resource }, req) {
		let params = {};
		if (category) params.category = category;
		if (user) params.user = user;
		if (resource) params.resource = resource;
		return mongoose.model(model).countDocuments(params);
	}
});
