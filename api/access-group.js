"use strict";

const mongoose = require("mongoose");

module.exports = {
	create({ name, permissions }) {
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose.model("AccessGroup").create({ name, permissions })
			);
	},
	get({ _id, name, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (name) params.name = name;
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("AccessGroup")
				.find(params)
				.limit(pagination.limit)
				.skip(pagination.skip)
		);
	},
	search({ searchString, pagination }) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("AccessGroup")
				.find()
				.limit(pagination.limit)
				.skip(pagination.skip)
		);
	},
	delete({ ids, pagination }) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("AccessGroup")
				.deleteMany({ _id: { $in: ids } })
				.then(() => ids)
		);
	},
	deletePermission({ _id, permissionId }) {
		return auth.loginRequired(req).then(() =>
			mongoose
				.model("AccessGroup")
				.findById(_id)
				.then(accessGroup => {
					if (!accessGroup)
						throw new Error(
							"No access group was found using provided id!"
						);
					accessGroup.permissions.pull(permissionId);
					return accessGroup.save();
				})
		);
	},
	update({ _id, name, permission }) {
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
