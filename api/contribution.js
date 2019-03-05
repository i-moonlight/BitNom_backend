"use strict";

const mongoose = require("mongoose");
const auth = require("../common/auth");

module.exports = {
	get(_, req) {
		return auth
			.loginRequired(req)
			.then(() =>
				mongoose
					.model("CoinThread")
					.find(
						{ user: req.user._id },
						{ _id: 1, title: 1, resource: 1 }
					)
			)
			.then(userThreads =>
				mongoose.model("Coin").populate(userThreads, {
					path: "resource",
					select: ["_id", "name"]
				})
			)
			.then(userThreads => {
				return Promise.all([
					Promise.resolve(userThreads),
					mongoose
						.model("Feedback")
						.aggregate()
						.match({
							resource: { $in: userThreads.map(({ _id }) => _id) }
						})
						.group({
							_id: { resource: "$resource", type: "$type" },
							count: { $sum: 1 }
						}),
					mongoose
						.model("ResourceMessage")
						.aggregate()
						.match({
							resource: {
								$in: userThreads.map(({ _id }) => _id)
							},
							user: { $ne: mongoose.Types.ObjectId(req.user._id) }
						})
						.group({ _id: "$resource", count: { $sum: 1 } })
				]);
			})
			.then(([threads, feedback, replies]) => {
				return threads.map(thread => {
					let contributions = 0;
					feedback.forEach(f => {
						if (String(f._id.resource) === String(thread._id)) {
							contributions += f.count;
						}
					});
					replies.forEach(reply => {
						if (String(reply._id) === String(thread._id)) {
							contributions += reply.count;
						}
					});
					return {
						_id: thread._id,
						type: "coin-thread",
						title: thread.title,
						resource: thread.resource,
						contributions
					};
				});
			});
	}
};
