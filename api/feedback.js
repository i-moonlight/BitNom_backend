"use strict";

const mongoose = require("mongoose");
const auth = require("../common/auth");

module.exports = {
	create({ resource, type }, req) {
		return (
			auth
				.loginRequired(req)
				// fetch feedback using provided parameters
				.then(() => {
					return mongoose
						.model("Feedback")
						.find({ resource, respondent: req.user._id });
				})
				// update feedback if exists
				// reject to prevent further processing
				.then(feedback => {
					if (feedback) {
						feedback.type = type;
						return feedback
							.save()
							.then(feedback =>
								Promise.reject(
									new Error(
										"xxxxx" + JSON.stringify(feedback)
									)
								)
							);
					}
				})
				// fetch the associated resource
				.then(() => {
					const modelsWithFeedback = ["Thread"];
					return modelsWithFeedback
						.map(model => mongoose.model(model).findById(resource))
						.map(function() {
							return Array.concat.apply([], arguments);
						});
				})
				// reject if resource does not exist
				.then(savedResource => {
					if (!savedResource)
						return Promise.reject(
							"Specified resource does not exist"
						);
					return savedResource.user;
				})
				// create new feedback entry
				.then(resourceOwner => {
					return mongoose.model("Feedback").create({
						respondent: req.user._id,
						resource,
						resourceOwner,
						type,
						date: new Date()
					});
				})
				// transform feedback updates rejects into a feedback object
				// propagate all other rejects
				.catch(error => {
					if (error.message.indexOf("xxxxx") === 0) {
						return JSON.parse(error.message.replace("xxxxx", ""));
					}
					return Promise.reject(error);
				})
		);
	},
	get({ resource }, req) {
		const types = ["upvote", "downvote", "flag"];
		return Promise.all(
			types.map(type =>
				mongoose.model("Feedback").count({ resource, type })
			)
		).then(([upvotes, downvotes, flags]) => ({
			upvotes,
			downvotes,
			flags
		}));
	}
};
