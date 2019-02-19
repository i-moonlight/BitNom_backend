"use strict";

const mongoose = require("mongoose");
const auth = require("../common/auth");

module.exports = {
	create({ recipient, text }, req) {
		return auth
			.loginRequired(req)
			.then(() => mongoose.model("User").findById(recipient))
			.then(user => {
				if (!user)
					return Promise.reject("Specified recipient does not exist");
			})
			.then(() => {
				let message = { recipient, text };
				message.date = new Date();
				message.sender = req.user._id;
				message.read = false;
				return mongoose.model("Message").create(message);
			});
	},
	delete({ _id }, req) {
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose
					.model("Message")
					.deleteOne({ _id, sender: req.user._id })
			);
	},
	get({ sender, pagination }, req) {
		pagination = pagination || {};
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose
					.model("Message")
					.find({ recipient: req.user._id, sender })
					.limit(pagination.limit || 20)
					.skip(pagination.skip || 0)
			)
			.then(messages => {
				const ids = messages.map(({ _id }) => _id);
				return mongoose
					.model("Message")
					.updateMany({ _id: { $in: ids } }, { read: true })
					.then(() => messages);
			});
	},
	unreadPerUser(_, req) {
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose
					.model("Message")
					.find({ recipient: req.user._id })
					.sort({ date: -1 })
			)
			.then(messages => {
				let idCount = {};
				messages.forEach(message => {
					if (!idCount[message.sender]) {
						idCount[message.sender] = {
							count: 0,
							date: message.date
						};
					}
					if (message.read === false)
						idCount[message.sender].count += 1;
					idCount[message.sender].date = message.date;
				});
				let countObjects = Object.keys(idCount).map(key => ({
					sender: key,
					count: idCount[key].count,
					date: idCount[key].date
				}));
				return mongoose
					.model("User")
					.populate(countObjects, { path: "sender" });
			});
	}
};
