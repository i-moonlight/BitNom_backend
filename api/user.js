"use strict";

const mongoose = require("mongoose");
const randomstring = require("randomstring");

module.exports = {
	get({ _id, email, access, pagination }) {
		let params = {};
		if (_id) params._id = _id;
		if (email) params.email = email;
		if (access) params.access = access;
		return mongoose
			.model("User")
			.find(params)
			.limit(pagination.limit)
			.skip(pagination.skip);
	},
	search({ searchString, pagination }) {
		return mongoose
			.model("User")
			.find({ $text: { $search: searchString } })
			.limit(pagination.limit)
			.skip(pagination.skip);
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
	}
};
