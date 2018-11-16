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
		return auth.loginRequired(req).then(() => {
			return mongoose
				.model("User")
				.find(params)
				.limit(pagination.limit)
				.skip(pagination.skip);
		});
	},
	search({ searchString, pagination }) {
		auth.loginRequired(req).then(() =>
			mongoose
				.model("User")
				.find({ $text: { $search: searchString } })
				.limit(pagination.limit)
				.skip(pagination.skip)
		);
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
		return auth
			.loginRequired(req)
			.then(() => req.user.isPassword(oldPassword))
			.then(matches => {
				if (!matches)
					throw new Error(
						"Provided password does not match your old password!"
					);
				if (newPassword !== oldPassword)
					throw new Error("Provided passwords do not match!");
				req.user.password = newPassword;
				return req.user.save().then(() => "ok");
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
			.then(() =>
				mongoose
					.model("User")
					.findOneAndUpdate(
						{ _id },
						{ access: accessGroup },
						{ new: true }
					)
			);
	},
	updateDisplayName({ displayName }, req) {
		return auth.loginRequired(req).then(() => {
			req.user.displayName = displayName;
			return req.user.save();
		});
	}
};
