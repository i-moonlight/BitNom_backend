"use strict";

const mongoose = require("mongoose");

// define the schema
const schema = mongoose.Schema({
	// fields
	respondent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	resource: { type: mongoose.Schema.Types.ObjectId, required: true },
	resourceOwner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	type: {
		type: String,
		enum: ["upvote", "downvote", "flag"],
		required: true
	},
	date: { type: Date, required: true }
});

mongoose.model("Feedback", schema);
