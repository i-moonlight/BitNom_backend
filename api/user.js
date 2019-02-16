"use strict";

const mongoose = require("mongoose");
const randomstring = require("randomstring");

const auth = require("../common/auth");

module.exports = {
	get({ _id, email, access, pagination }, req) {
		let params = {};
		if (_id) params._id = _id;
		if (email) params.email = email;
		if (access) params.access = access;
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "user", "get"))
			.then(() => {
				return mongoose
					.model("User")
					.find(params)
					.limit(pagination.limit)
					.skip(pagination.skip);
			});
	},
	search({ access, searchString, pagination }, req) {
		let params = {};
		if (access) params.access = access;
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "user", "search"))
			.then(() => {
				return mongoose
					.model("User")
					.find(
						Object.assign(params, {
							$text: { $search: searchString }
						})
					)
					.limit(pagination.limit)
					.skip(pagination.skip);
			});
	},
	create({ email, password }) {
		const user = {
			email,
			password,
			date: new Date(),
			access: mongoose.Types.ObjectId(),
			verificationString: randomstring.generate(8)
		};
		return mongoose.model("User").create(user);
	},
	delete({ ids }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "user", "delete"))
			.then(() => {
				if (ids.indexOf(String(req.user._id)) !== -1) {
					throw new Error("Cannot delete self!");
				}
				return mongoose
					.model("User")
					.find({ _id: { $in: ids } }, { _id: 0, access: 1 })
					.then(users => {
						return users.map(user => user.access);
					})
					.then(accessGroups => {
						return mongoose.model("AccessGroup").find({
							_id: { $in: accessGroups },
							name: "admin"
						});
					})
					.then(adminAccessGroup => {
						if (adminAccessGroup.length !== 0) {
							throw new Error("Cannot delete an admin user!");
						}
						return mongoose
							.model("User")
							.deleteMany({ _id: { $in: ids } });
					})
					.then(() => "ok");
			});
	},
	changePassword({ oldPassword, newPassword, confirmPassword }, req) {
		let user;
		return auth
			.loginRequired(req)
			.then(() => mongoose.model("User").findById(req.user._id))
			.then(savedUser => {
				user = savedUser;
				return user.isPassword(oldPassword);
			})
			.then(matches => {
				if (!matches) throw new Error("Incorrect password!");
				if (newPassword !== confirmPassword)
					throw new Error("Passwords mismatch!");
				user.password = newPassword;
				return user.save().then(() => "ok");
			});
	},
	resetPassword({ email }) {
		return mongoose
			.model("User")
			.findOne({ email })
			.then(user => {
				if (user === null)
					throw new Error("Target resource does not exist!");
				const password = randomstring.generate(8);
				user.password = password;
				console.log(`Sending ${password} via reset password email.`);
				return user.save().then(() => "ok");
			});
	},
	updateAccessGroup({ _id, accessGroup }, req) {
		return auth
			.loginRequired(req)
			.then(() => auth.hasPermission(req, "user", "updateAccessGroup"))
			.then(() => {
				return mongoose
					.model("AccessGroup")
					.findById(accessGroup)
					.then(group => {
						if (!group) {
							throw new Error(
								"Specified access group does not exist!"
							);
						} else if (group.name === "admin") {
							throw new Error(
								"Cannot set user access group to admin!"
							);
						}
					})
					.then(() => mongoose.model("User").findById(_id))
					.then(user => {
						if (!user) {
							throw new Error("Target resource does not exist!");
						}
						return user;
					})
					.then(user => {
						return mongoose
							.model("AccessGroup")
							.findById(user.access)
							.then(group => {
								if (group && group.name === "admin") {
									throw new Error(
										"Cannot modify admin's access group!"
									);
								}
								user.access = accessGroup;
								return user.save();
							});
					});
			});
	},
	updateDisplayName({ displayName }, req) {
		return auth
			.loginRequired(req)
			.then(() => mongoose.model("User").findById(req.user._id))
			.then(user => {
				user.displayName = displayName;
				return user.save();
			});
	}
};
