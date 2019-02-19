"use strict";

const mongoose = require("mongoose");

// define the schema
module.exports = mongoose.Schema({
	// fields
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: String,
		enum: ["srccode", "feature", "other"],
		required: true,
		default: "other"
	},
	srccodes: [{ type: String }],
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	date: { type: Date, required: true },
	resource: { type: mongoose.Schema.Types.ObjectId, required: true }
});
