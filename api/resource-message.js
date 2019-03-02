"use strict";

const mongoose = require("mongoose");
const auth = require("../common/auth");

module.exports = {
	create({ resource, parentMessage, text }, req) {
		return auth
			.loginRequired(req)
			.then(() => {
				if (parentMessage) {
					return mongoose
						.model("ResourceMessage")
						.findById(parentMessage)
						.then(message => {
							if (message && message.parentMessage)
								return message.parentMessage;
							return parentMessage;
						});
				}
				return parentMessage;
			})
			.then(parentMessage =>
				mongoose.model("ResourceMessage").create({
					resource,
					parentMessage,
					text,
					date: new Date(),
					user: req.user._id
				})
			);
	},
	get({ resource, pagination }) {
		pagination = pagination || {};
		return mongoose
			.model("ResourceMessage")
			.find({ resource })
			.limit(pagination.limit || 20)
			.skip(pagination.skip || 0)
			.then(messages => {
				return mongoose.model("User").populate(messages, {
					path: "user",
					select: ["_id", "avatar", "displayName"]
				});
			});
	}
};
