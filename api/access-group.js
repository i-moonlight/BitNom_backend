"use strict";

const mongoose = require("mongoose");
const auth = require("../common/auth");

module.exports = {
	create({ name, permissions }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "accessGroup", "create"))
			.then(() =>
				mongoose.model("AccessGroup").create({ name, permissions })
			);
	},
	get({ _id, name, pagination }, req) {
		let params = {};
		if (_id) params._id = _id;
		if (name) params.name = name;
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "accessGroup", "get"))
			.then(() =>
				mongoose
					.model("AccessGroup")
					.find(params)
					.limit(pagination.limit)
					.skip(pagination.skip)
			);
	},
	search({ searchString, pagination }, req) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("AccessGroup")
				.find()
				.limit(pagination.limit)
				.skip(pagination.skip)
		);
	},
	delete({ ids }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "accessGroup", "delete"))
			.then(() => {
				if (ids.indexOf(String(req.user.access)) !== -1) {
					throw new Error("Cannot delete own access group!");
				}
				return mongoose
					.model("AccessGroup")
					.find({
						_id: { $in: ids },
						name: "admin"
					})
					.then(adminAccessGroup => {
						if (adminAccessGroup.length !== 0) {
							throw new Error(
								"Cannot delete admin access group!"
							);
						}
						return mongoose
							.model("AccessGroup")
							.deleteMany({ _id: { $in: ids } });
					})
					.then(() => "ok");
			});
	},
	deletePermission({ _id, permissionId }, req) {
		return auth
			.loginRequired(req)
			.then(() =>
				auth.hasPermission(req, "accessGroup", "deletePermission")
			)
			.then(() =>
				mongoose
					.model("AccessGroup")
					.findById(_id)
					.then(accessGroup => {
						if (!accessGroup)
							throw new Error("Target resource does not exist!");
						accessGroup.permissions.pull(permissionId);
						return accessGroup.save();
					})
			);
	},
	update({ _id, name, permission }, req) {
		let updates = { name };
		["create", "read", "update", "delete"].forEach(operation => {
			updates["permissions.$." + operation] = permission[operation];
		});
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose
					.model("AccessGroup")
					.findOneAndUpdate(
						{ _id, "permissions.name": permission.name },
						{ $set: updates },
						{ new: true }
					)
			);
	}
};
