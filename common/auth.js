"use strict";

const mongoose = require("mongoose");

module.exports = {
	loginRequired(req) {
		if (!req.user) return Promise.reject(new Error("Login required!"));
		return Promise.resolve();
	},
	hasPermission(req, model, endpoint) {
		mongoose
			.model("AccessGroup")
			.find({
				_id: req.user.access,
				"permissions.model": model,
				"permissions.endpoint": endpoint
			})
			.then(group => {
				if (group.length === 0) {
					return Promise.reject(new Error("Permission denied!"));
				}
			});
	},
	ownsResource(req, resource) {
		if (String(req.user._id) !== resource.user) {
			return Promise.reject(new Error("Resource ownership required!"));
		}
		return Promise.resolve(resource);
	}
};
