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
	delete({ ids }) {
		auth.loginRequired(req).then(() =>
			mongoose
				.model("User")
				.deleteMany({ _id: { $in: ids } })
				.then(() => ids)
		);
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
					throw new Error(
						"No user was found using the provided email."
					);
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
			.then(() =>
				mongoose
					.model("AccessGroup")
					.findById(accessGroup)
					.then(group => {
						if (!group) {
							throw new Error(
								"Specified access group does not exist!"
							);
						}
					})
					.then(() => {
						return mongoose
							.model("User")
							.findOneAndUpdate(
								{ _id },
								{ access: accessGroup },
								{ new: true }
							);
					})
					.then(user => {
						if (!user) {
							throw new Error("Target resource does not exist!");
						}
						return user;
					})
			);
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
